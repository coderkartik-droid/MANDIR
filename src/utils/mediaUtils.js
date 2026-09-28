/**
 * mediaUtils.js
 *
 * Client-side media utility library.
 *
 * Responsibilities:
 *   • Resolve the best available image URL (WebP → original fallback)
 *   • Build clean, canonical media URLs from bare filenames
 *   • Provide a simple in-memory URL cache so the same path is never
 *     resolved more than once per session
 *   • Export folder constants so there is exactly one place to change
 *     if the folder layout ever moves
 *
 * Nothing here touches the DOM or React — pure functions only.
 */

// ─── Canonical folder constants ───────────────────────────────────────────────
// These must stay in sync with the media folders served by the FastAPI backend.

export const MEDIA_PATHS = {
  gallery:     '/media/images/gallery',
  temple:      '/media/images/temple',
  hero:        '/media/images/hero',
  festivals:   '/media/images/festivals',
  icons:       '/media/images/icons',
  backgrounds: '/media/images/backgrounds',
  audio:       '/media/audio',
  video:       '/media/video',
  documents:   '/media/documents',
};

// ─── In-memory resolution cache ───────────────────────────────────────────────
// Maps original URL → { src, webpSrc, type }
const _cache = new Map();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Derive the WebP sibling URL for a given image URL.
 * e.g. "/media/images/gallery/arch.jpg" → "/media/images/gallery/arch.webp"
 * Returns null for URLs that are already .webp or are external (http/https).
 */
export function toWebpUrl(url) {
  if (!url || url.startsWith('http')) return null;
  if (url.toLowerCase().endsWith('.webp')) return null;
  return url.replace(/\.(jpe?g|png|gif)$/i, '.webp');
}

/**
 * Returns a resolved media descriptor for an image path.
 * Result shape: { src: string, webpSrc: string|null, isExternal: boolean }
 *
 * Cached per URL for the lifetime of the page.
 */
export function resolveImage(url) {
  if (!url) return { src: '', webpSrc: null, isExternal: false };
  if (_cache.has(url)) return _cache.get(url);

  const isExternal = url.startsWith('http://') || url.startsWith('https://');
  const result = {
    src: url,
    webpSrc: isExternal ? null : toWebpUrl(url),
    isExternal,
  };

  _cache.set(url, result);
  return result;
}

/**
 * Build a full public URL for a bare filename inside a known media folder.
 *
 * Usage:
 *   mediaUrl('temple', 'arch.jpg')   → '/media/images/temple/arch.jpg'
 *   mediaUrl('audio',  'bansuri.mp3') → '/media/audio/bansuri.mp3'
 *
 * If the value is already an absolute path or URL, it is returned as-is.
 */
export function mediaUrl(folder, filename) {
  if (!filename) return '';
  // Already a rooted path or external URL — return unchanged
  if (filename.startsWith('/') || filename.startsWith('http')) return filename;
  const base = MEDIA_PATHS[folder] ?? `/media/${folder}`;
  return `${base}/${filename}`;
}

/**
 * Generate a unique filename that avoids collisions.
 * Prepends an ISO-date slug and a short random hex suffix.
 *
 * Example: "temple arch.jpg" → "2025_09_28_temple_arch_a3f2.jpg"
 */
export function uniqueFilename(originalName) {
  const now   = new Date();
  const date  = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
  const ext   = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')) : '';
  const stem  = originalName
    .slice(0, originalName.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48); // cap stem length
  const rand  = Math.random().toString(16).slice(2, 6);
  return `${date}_${stem}_${rand}${ext}`;
}

/**
 * Format bytes into a human-readable string.
 * Used in AudioPlayer and VideoPlayer metadata displays.
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k     = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i     = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format seconds into MM:SS or HH:MM:SS display string.
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Clears the internal resolution cache.
 * Useful during hot-reload in development.
 */
export function clearMediaCache() {
  _cache.clear();
}
