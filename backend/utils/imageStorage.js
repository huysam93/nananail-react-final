const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Save Base64 string to disk and return public image URL (/uploads/file.jpg)
 */
const saveBase64Image = (base64Data, prefix = 'img') => {
  if (!base64Data) return null;
  // If it's already an HTTP URL or relative /uploads path, return as is
  if (base64Data.startsWith('http://') || base64Data.startsWith('https://') || base64Data.startsWith('/uploads/')) {
    return base64Data;
  }

  try {
    // Strip data prefix if present (e.g. data:image/png;base64,)
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let extension = 'jpg';
    let rawBase64 = base64Data;

    if (matches && matches.length === 3) {
      const mime = matches[1];
      rawBase64 = matches[2];
      if (mime.includes('png')) extension = 'png';
      else if (mime.includes('webp')) extension = 'webp';
      else if (mime.includes('gif')) extension = 'gif';
    }

    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const buffer = Buffer.from(rawBase64, 'base64');

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Failed to save image file:', error);
    return base64Data; // fallback to original
  }
};

/**
 * Delete image file from disk if it exists in /uploads/
 */
const deleteImageFile = (imagePath) => {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  try {
    const fileName = path.basename(imagePath);
    const filePath = path.join(UPLOADS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete image file:', error);
  }
};

module.exports = {
  saveBase64Image,
  deleteImageFile,
  UPLOADS_DIR
};
