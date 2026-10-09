const { getDB } = require('../database');

// ─── Tier logic ────────────────────────────────────────────────────────────────
const TIERS = [
    { name: 'Kim Cương', minPoints: 2000, color: '#60A5FA', emoji: '💎' },
    { name: 'Vàng',      minPoints: 1000, color: '#F59E0B', emoji: '🥇' },
    { name: 'Bạc',       minPoints: 500,  color: '#9CA3AF', emoji: '🥈' },
    { name: 'Đồng',      minPoints: 0,    color: '#CD7F32', emoji: '🥉' },
];

function calcTier(points) {
    for (const t of TIERS) {
        if (points >= t.minPoints) return t.name;
    }
    return 'Đồng';
}

function nextTier(points) {
    const current = TIERS.findIndex(t => points >= t.minPoints);
    if (current <= 0) return null;
    return TIERS[current - 1];
}

// ─── GET all members (admin) ───────────────────────────────────────────────────
const getAllMembers = (req, res) => {
    const db = getDB();
    db.all('SELECT * FROM loyalty_members ORDER BY points DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// ─── GET member by phone (public lookup) ──────────────────────────────────────
const getMemberByPhone = (req, res) => {
    const db = getDB();
    const { phone } = req.params;
    db.get('SELECT * FROM loyalty_members WHERE phone = ?', [phone], (err, member) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!member) return res.status(404).json({ error: 'Không tìm thấy thành viên với số điện thoại này.' });

        // Get last 10 transactions
        db.all(
            'SELECT * FROM loyalty_transactions WHERE member_id = ? ORDER BY created_at DESC LIMIT 10',
            [member.id],
            (err2, transactions) => {
                if (err2) return res.status(500).json({ error: err2.message });

                const tierInfo = TIERS.find(t => t.name === member.tier) || TIERS[3];
                const next = nextTier(member.points);
                const nextTierInfo = next ? { ...next, pointsNeeded: next.minPoints - member.points } : null;

                res.json({ ...member, tierInfo, nextTier: nextTierInfo, transactions });
            }
        );
    });
};

// ─── POST register new member ─────────────────────────────────────────────────
const registerMember = (req, res) => {
    const db = getDB();
    const { full_name, phone, email, notes } = req.body;
    if (!full_name || !phone) {
        return res.status(400).json({ error: 'Họ tên và số điện thoại là bắt buộc.' });
    }

    // Check duplicate
    db.get('SELECT id FROM loyalty_members WHERE phone = ?', [phone], (err, existing) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existing) return res.status(409).json({ error: 'Số điện thoại này đã đăng ký thành viên.' });

        db.run(
            `INSERT INTO loyalty_members (full_name, phone, email, points, tier, total_visits, joined_at)
             VALUES (?, ?, ?, 0, 'Đồng', 0, datetime('now','localtime'))`,
            [full_name.trim(), phone.trim(), email || null],
            function (err2) {
                if (err2) {
                    if (err2.message.includes('UNIQUE')) return res.status(409).json({ error: 'Số điện thoại đã đăng ký.' });
                    return res.status(500).json({ error: err2.message });
                }
                // Welcome bonus 50 points
                const memberId = this.lastID;
                db.run(
                    `INSERT INTO loyalty_transactions (member_id, points_change, type, description)
                     VALUES (?, 50, 'earn', 'Điểm chào mừng thành viên mới')`,
                    [memberId]
                );
                db.run('UPDATE loyalty_members SET points = 50, tier = ? WHERE id = ?', [calcTier(50), memberId]);

                res.status(201).json({ id: memberId, message: 'Đăng ký thành công! Bạn nhận được 50 điểm chào mừng 🎉' });
            }
        );
    });
};

// ─── POST add points (admin) ──────────────────────────────────────────────────
const addPoints = (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const { points_change, type = 'earn', description = 'Cộng điểm từ lần làm nail' } = req.body;

    if (!points_change || isNaN(points_change)) {
        return res.status(400).json({ error: 'Số điểm không hợp lệ.' });
    }

    db.get('SELECT * FROM loyalty_members WHERE id = ?', [id], (err, member) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!member) return res.status(404).json({ error: 'Không tìm thấy thành viên.' });

        const newPoints = Math.max(0, member.points + parseInt(points_change));
        const newTier = calcTier(newPoints);
        const newVisits = type === 'earn' ? member.total_visits + 1 : member.total_visits;

        db.run(
            `UPDATE loyalty_members SET points = ?, tier = ?, total_visits = ?, last_visit = datetime('now','localtime') WHERE id = ?`,
            [newPoints, newTier, newVisits, id],
            (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });

                db.run(
                    `INSERT INTO loyalty_transactions (member_id, points_change, type, description)
                     VALUES (?, ?, ?, ?)`,
                    [id, points_change, type, description]
                );

                const tierUpgraded = newTier !== member.tier;
                res.json({
                    message: `${type === 'earn' ? '+' : ''}${points_change} điểm${tierUpgraded ? ` 🎉 Lên hạng ${newTier}!` : ''}`,
                    newPoints,
                    newTier,
                    tierUpgraded,
                });
            }
        );
    });
};

// ─── PUT update member info ────────────────────────────────────────────────────
const updateMember = (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const { full_name, email, notes } = req.body;
    db.run(
        'UPDATE loyalty_members SET full_name = ?, email = ?, notes = ? WHERE id = ?',
        [full_name, email, notes, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Cập nhật thành công' });
        }
    );
};

// ─── DELETE member ────────────────────────────────────────────────────────────
const deleteMember = (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.run('DELETE FROM loyalty_transactions WHERE member_id = ?', [id]);
    db.run('DELETE FROM loyalty_members WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Đã xóa thành viên' });
    });
};

// ─── GET stats (admin dashboard) ─────────────────────────────────────────────
const getStats = (req, res) => {
    const db = getDB();
    db.all(
        `SELECT tier, COUNT(*) as count FROM loyalty_members GROUP BY tier`,
        [],
        (err, tierStats) => {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT COUNT(*) as total, AVG(points) as avgPoints FROM loyalty_members', [], (err2, overall) => {
                if (err2) return res.status(500).json({ error: err2.message });
                res.json({ tierStats, overall });
            });
        }
    );
};

module.exports = { getAllMembers, getMemberByPhone, registerMember, addPoints, updateMember, deleteMember, getStats };
