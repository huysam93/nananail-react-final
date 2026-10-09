const { getDB } = require('../database');

// Thêm cột status nếu chưa tồn tại (migration tự động)
function ensureStatusColumn(db) {
    db.run(`ALTER TABLE reviews ADD COLUMN status TEXT DEFAULT 'approved'`, (err) => {
        // Bỏ qua lỗi nếu cột đã tồn tại
    });
}

// GET /reviews - chỉ trả về approved (public)
exports.getAllReviews = (req, res) => {
    const db = getDB();
    ensureStatusColumn(db);
    db.all("SELECT * FROM reviews WHERE status = 'approved' OR status IS NULL ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// GET /reviews/all - admin: trả về tất cả
exports.getAllReviewsAdmin = (req, res) => {
    const db = getDB();
    ensureStatusColumn(db);
    db.all("SELECT * FROM reviews ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// POST /reviews - khách gửi, status = pending
exports.createReview = (req, res) => {
    const { customer_name, content, rating, status } = req.body;
    const db = getDB();
    ensureStatusColumn(db);
    // Admin tạo → approved, khách gửi → pending
    const reviewStatus = status || 'pending';
    db.run(
        'INSERT INTO reviews (customer_name, content, rating, status) VALUES (?, ?, ?, ?)',
        [customer_name, content, rating, reviewStatus],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, customer_name, content, rating, status: reviewStatus });
        }
    );
};

// PUT /reviews/:id - cập nhật (admin)
exports.updateReview = (req, res) => {
    const { customer_name, content, rating, status } = req.body;
    const db = getDB();
    db.run(
        'UPDATE reviews SET customer_name = ?, content = ?, rating = ?, status = ? WHERE id = ?',
        [customer_name, content, rating, status || 'approved', req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Review updated', changes: this.changes });
        }
    );
};

// PATCH /reviews/:id/approve - duyệt review
exports.approveReview = (req, res) => {
    const db = getDB();
    db.run("UPDATE reviews SET status = 'approved' WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review approved' });
    });
};

// PATCH /reviews/:id/reject - từ chối review
exports.rejectReview = (req, res) => {
    const db = getDB();
    db.run("UPDATE reviews SET status = 'rejected' WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review rejected' });
    });
};

// DELETE /reviews/:id
exports.deleteReview = (req, res) => {
    const db = getDB();
    db.run('DELETE FROM reviews WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Review deleted', changes: this.changes });
    });
};
