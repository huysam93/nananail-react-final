const { getDB } = require('../database');

function ensurePromotionsTable(db, cb) {
    db.run(`CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      discount_percent INTEGER DEFAULT 0,
      original_price REAL,
      promo_price REAL,
      valid_from DATETIME,
      valid_to DATETIME,
      badge TEXT,
      color TEXT,
      image_url TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, cb);
}

exports.getAllPromotions = (req, res) => {
    const db = getDB();
    ensurePromotionsTable(db, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const sql = `SELECT * FROM promotions ORDER BY created_at DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
};

exports.getActivePromotions = (req, res) => {
    const db = getDB();
    ensurePromotionsTable(db, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const now = new Date().toISOString();
        const sql = `
            SELECT * FROM promotions 
            WHERE is_active = 1 
              AND (valid_to IS NULL OR valid_to >= ?)
            ORDER BY created_at DESC
        `;
        db.all(sql, [now], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
};

exports.createPromotion = (req, res) => {
    const db = getDB();
    const { title, description, discount_percent, original_price, promo_price, valid_from, valid_to, badge, color, image_url } = req.body;
    db.run(
        `INSERT INTO promotions (title, description, discount_percent, original_price, promo_price, valid_from, valid_to, badge, color, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, discount_percent, original_price, promo_price, valid_from, valid_to, badge, color, image_url],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        }
    );
};

exports.updatePromotion = (req, res) => {
    const db = getDB();
    const { title, description, discount_percent, original_price, promo_price, valid_from, valid_to, badge, color, image_url, is_active } = req.body;
    db.run(
        `UPDATE promotions SET title=?, description=?, discount_percent=?, original_price=?, promo_price=?, valid_from=?, valid_to=?, badge=?, color=?, image_url=?, is_active=? WHERE id=?`,
        [title, description, discount_percent, original_price, promo_price, valid_from, valid_to, badge, color, image_url, is_active, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Promotion updated', changes: this.changes });
        }
    );
};

exports.deletePromotion = (req, res) => {
    const db = getDB();
    db.run('DELETE FROM promotions WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Promotion deleted', changes: this.changes });
    });
};
