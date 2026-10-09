const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nananail_secret_key_dalat_nail_2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
};

module.exports = verifyToken;
