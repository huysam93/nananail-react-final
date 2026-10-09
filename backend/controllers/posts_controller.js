const { getDB } = require('../database');

// Ensure table exists
function ensurePostsTable(db, cb) {
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        cover_image TEXT,
        category TEXT DEFAULT 'Tin tức',
        status TEXT DEFAULT 'published',
        author TEXT DEFAULT 'NanaNail',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, cb);
}

// Tạo slug từ tiêu đề
function makeSlug(title, id) {
    const base = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    return `${base}-${id}`;
}

// GET /posts - public: chỉ published
exports.getAllPosts = (req, res) => {
    const db = getDB();
    ensurePostsTable(db, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const { category, limit } = req.query;
        let sql = "SELECT id, title, slug, excerpt, cover_image, category, author, created_at FROM posts WHERE status = 'published'";
        const params = [];
        if (category) { sql += ' AND category = ?'; params.push(category); }
        sql += ' ORDER BY created_at DESC';
        if (limit) { sql += ' LIMIT ?'; params.push(parseInt(limit)); }
        db.all(sql, params, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
};

// GET /posts/all - admin: tất cả posts
exports.getAllPostsAdmin = (req, res) => {
    const db = getDB();
    ensurePostsTable(db, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
};

// GET /posts/:idOrSlug - chi tiết bài viết
exports.getPost = (req, res) => {
    const db = getDB();
    ensurePostsTable(db, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const { idOrSlug } = req.params;
        const isId = /^\d+$/.test(idOrSlug);
        const sql = isId ? 'SELECT * FROM posts WHERE id = ?' : 'SELECT * FROM posts WHERE slug = ?';
        db.get(sql, [idOrSlug], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Post not found' });
            res.json(row);
        });
    });
};

// POST /posts - tạo bài viết mới
exports.createPost = (req, res) => {
    const { title, excerpt, content, cover_image, category, status, author } = req.body;
    const db = getDB();
    ensurePostsTable(db, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.run(
            `INSERT INTO posts (title, excerpt, content, cover_image, category, status, author) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, excerpt, content, cover_image || null, category || 'Tin tức', status || 'published', author || 'NanaNail'],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                const newId = this.lastID;
                const slug = makeSlug(title, newId);
                db.run('UPDATE posts SET slug = ? WHERE id = ?', [slug, newId], () => {
                    res.status(201).json({ id: newId, slug, title, status: status || 'published' });
                });
            }
        );
    });
};

// PUT /posts/:id - cập nhật bài viết
exports.updatePost = (req, res) => {
    const { title, excerpt, content, cover_image, category, status, author } = req.body;
    const db = getDB();
    const slug = makeSlug(title, req.params.id);
    db.run(
        `UPDATE posts SET title=?, slug=?, excerpt=?, content=?, cover_image=?, category=?, status=?, author=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
        [title, slug, excerpt, content, cover_image || null, category || 'Tin tức', status || 'published', author || 'NanaNail', req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Post updated', changes: this.changes, slug });
        }
    );
};

// DELETE /posts/:id
exports.deletePost = (req, res) => {
    const db = getDB();
    db.run('DELETE FROM posts WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post deleted', changes: this.changes });
    });
};
