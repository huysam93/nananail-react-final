const { getDB } = require('../database');
const { saveBase64Image, deleteImageFile } = require('../utils/imageStorage');

exports.getSliderImages = (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM slider_images', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addSliderImage = (req, res) => {
  const db = getDB();
  const { image_base64 } = req.body;
  if (!image_base64) {
    return res.status(400).json({ error: 'Image data is required.' });
  }
  const storedImagePath = saveBase64Image(image_base64, 'slider');

  db.run('INSERT INTO slider_images (image_base64) VALUES (?)', [storedImagePath], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, image_base64: storedImagePath });
  });
};

exports.deleteSliderImage = (req, res) => {
  const db = getDB();
  const id = req.params.id;

  db.get('SELECT image_base64 FROM slider_images WHERE id = ?', [id], (err, row) => {
    if (row && row.image_base64) {
      deleteImageFile(row.image_base64);
    }
    db.run('DELETE FROM slider_images WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Slider image deleted', changes: this.changes });
    });
  });
};
