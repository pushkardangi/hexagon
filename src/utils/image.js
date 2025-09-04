// utils/getImageUrl.js

const DEFAULT_IMAGE = "https://res.cloudinary.com/dijkastra-cloud/image/upload/v1756629413/openai/dall-e-2/r6cczeds3uvilwg2odca.png"; // you can replace with your own asset

/**
 * Returns a safe image URL
 * If no image is found, returns a default fallback image.
 *
 * @param {string|null} url - Original Cloudinary (or other) image URL
 * @param {object} options - Transformation options { w, h, c }
 */
export function getImageUrl(url, { w = 200, h = 200, c = "fill" } = {}) {
  if (!url) return DEFAULT_IMAGE;

  try {
    // Cloudinary style transformation injection
    return url.replace("/upload/", `/upload/w_${w},h_${h},c_${c}/`);
  } catch {
    return DEFAULT_IMAGE;
  }
}
