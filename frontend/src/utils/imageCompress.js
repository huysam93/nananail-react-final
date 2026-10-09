/**
 * Resize + re-encode an image File on the client before it's sent to the backend
 * as base64. Raw phone-camera photos (3-10MB) inflate ~33% as base64 and routinely
 * blew past the backend's JSON body limit, causing before/after uploads to fail.
 * Returns a data URI string (e.g. "data:image/jpeg;base64,...").
 */
export const compressImageFile = (file, { maxWidth = 1280, maxHeight = 1280, quality = 0.8 } = {}) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
