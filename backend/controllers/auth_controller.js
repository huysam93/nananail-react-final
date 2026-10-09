const { getDB } = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nananail_secret_key_dalat_nail_2026';

exports.login = (req, res) => {
  const { username, password } = req.body;
  const db = getDB();

  if (!username || !password) {
    return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role || 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role || 'admin'
      }
    });
  });
};

exports.me = (req, res) => {
  res.status(200).json({
    user: req.user
  });
};
