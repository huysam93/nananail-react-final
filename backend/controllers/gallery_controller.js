const { getDB } = require('../database');
const { saveBase64Image, deleteImageFile } = require('../utils/imageStorage');

exports.getGalleryImages = (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM gallery_images', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addGalleryImage = (req, res) => {
  const { image_base64, tag } = req.body;
  const db = getDB();

  if (!image_base64) {
    return res.status(400).json({ error: 'Hình ảnh là bắt buộc.' });
  }

  // Convert Base64 to file path or store URL
  const storedImagePath = saveBase64Image(image_base64, 'gallery');

  db.run('INSERT INTO gallery_images (image_base64, tag) VALUES (?, ?)', [storedImagePath, tag], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, image_base64: storedImagePath, tag });
  });
};

exports.deleteGalleryImage = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  // Find image to delete file
  db.get('SELECT image_base64 FROM gallery_images WHERE id = ?', [id], (err, row) => {
    if (row && row.image_base64) {
      deleteImageFile(row.image_base64);
    }
    db.run('DELETE FROM gallery_images WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Đã xóa ảnh khỏi bộ sưu tập', changes: this.changes });
    });
  });
};
