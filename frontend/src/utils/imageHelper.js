/**
 * Utility helper to resolve image source URL whether it's:
 * 1. Base64 string
 * 2. Static file URL path (/uploads/...)
 * 3. External HTTP/HTTPS URL
 */
export const getImageUrl = (imgStr) => {
  if (!imgStr) return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80';
  if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) return imgStr;
  if (imgStr.startsWith('/uploads/')) {
    const backendOrigin = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${backendOrigin}${imgStr}`;
  }
  if (imgStr.startsWith('data:image')) return imgStr;
  return `data:image/jpeg;base64,${imgStr}`;
};
