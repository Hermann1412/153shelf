// In dev: relative paths go through Vite proxy (same origin → cookies always sent)
// In prod: VITE_API_URL is set to the full Render backend URL
export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const MEDIA_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

// Handles both Cloudinary full URLs and legacy local paths
export const mediaUrl = (path: string) =>
  !path ? '' : path.startsWith('http') ? path : `${MEDIA_URL}${path}`;
