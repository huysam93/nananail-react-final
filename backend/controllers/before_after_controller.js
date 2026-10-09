const { getDB } = require('../database');
const { saveBase64Image, deleteImageFile } = require('../utils/imageStorage');

function ensureBeforeAfterTable(db, cb) {
  db.run(`CREATE TABLE IF NOT EXISTS before_after_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    description TEXT,
    before_image TEXT NOT NULL,
    after_image TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, cb);
}

// GET all before/after images
const getAllImages = (req, res) => {
  const db = getDB();
  ensureBeforeAfterTable(db, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all('SELECT * FROM before_after_images ORDER BY created_at DESC', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
};

// POST create new pair
const createImage = (req, res) => {
  const db = getDB();
  const { title, category, description, before_image, after_image } = req.body;
  if (!before_image || !after_image) {
    return res.status(400).json({ error: 'Cần cả ảnh trước và ảnh sau' });
  }

  ensureBeforeAfterTable(db, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const storedBefore = saveBase64Image(before_image, 'before');
    const storedAfter = saveBase64Image(after_image, 'after');

    db.run(
      `INSERT INTO before_after_images (title, category, description, before_image, after_image, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`,
      [title || '', category || 'Gel', description || '', storedBefore, storedAfter],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Đã lưu cặp ảnh thành công' });
      }
    );
  });
};

// DELETE
const deleteImage = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  db.get('SELECT before_image, after_image FROM before_after_images WHERE id = ?', [id], (err, row) => {
    if (row) {
      if (row.before_image) deleteImageFile(row.before_image);
      if (row.after_image) deleteImageFile(row.after_image);
    }
    db.run('DELETE FROM before_after_images WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy' });
      res.json({ message: 'Đã xóa thành công' });
    });
  });
};

module.exports = { getAllImages, createImage, deleteImage };
