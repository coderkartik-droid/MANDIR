/**
 * contentLoader.js
 *
 * Loads CMS-managed Markdown files from the content/ directory using
 * Vite's import.meta.glob with the ?raw query (returns file text).
 * Frontmatter is parsed with gray-matter (already a devDependency).
 *
 * All functions are synchronous — glob eagerly imports every .md file
 * at build time so there are no async waterfalls at runtime.
 *
 * API surface (unchanged from previous version so sections need no edits):
 *   getItem(collectionKey, slug?)  → single frontmatter object
 *   getList(collectionKey)         → array sorted by .order
 *   loadAllContent()               → { [collectionKey]: {...} }
 */

import matter from 'gray-matter';

// ─── Eager glob imports (Vite resolves at build time) ─────────────────────────
// Each returns { './path/to/file.md': '<raw string content>', … }

const templeInfoFiles       = import.meta.glob('../../content/temple-info/*.md',       { eager: true, query: '?raw', import: 'default' });
const homePageFiles         = import.meta.glob('../../content/home-page/*.md',         { eager: true, query: '?raw', import: 'default' });
const contactInfoFiles      = import.meta.glob('../../content/contact-info/*.md',      { eager: true, query: '?raw', import: 'default' });
const festivalsFiles        = import.meta.glob('../../content/festivals/*.md',         { eager: true, query: '?raw', import: 'default' });
const galleryFiles          = import.meta.glob('../../content/gallery/*.md',           { eager: true, query: '?raw', import: 'default' });
const videosFiles           = import.meta.glob('../../content/videos/*.md',            { eager: true, query: '?raw', import: 'default' });
const musicPlaylistFiles    = import.meta.glob('../../content/music-playlist/*.md',    { eager: true, query: '?raw', import: 'default' });
const mapsFiles             = import.meta.glob('../../content/maps/*.md',              { eager: true, query: '?raw', import: 'default' });
const socialLinksFiles      = import.meta.glob('../../content/social-links/*.md',      { eager: true, query: '?raw', import: 'default' });
const imagesFiles           = import.meta.glob('../../content/images/*.md',            { eager: true, query: '?raw', import: 'default' });
const themeColorsFiles      = import.meta.glob('../../content/theme-colors/*.md',      { eager: true, query: '?raw', import: 'default' });
const animationFiles        = import.meta.glob('../../content/animation-settings/*.md',{ eager: true, query: '?raw', import: 'default' });

// ─── Map of collection key → glob result ──────────────────────────────────────
const COLLECTIONS = {
  templeInfo:        templeInfoFiles,
  homePage:          homePageFiles,
  contactInfo:       contactInfoFiles,
  festivals:         festivalsFiles,
  gallery:           galleryFiles,
  videos:            videosFiles,
  musicPlaylist:     musicPlaylistFiles,
  maps:              mapsFiles,
  socialLinks:       socialLinksFiles,
  images:            imagesFiles,
  themeColors:       themeColorsFiles,
  animationSettings: animationFiles,
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Derive the slug from a glob path like '../../content/gallery/temple-arch.md'
 * → 'temple-arch'
 */
function slugFromPath(path) {
  return path.replace(/^.*\/([^/]+)\.md$/, '$1');
}

/**
 * Parse every file in a glob map into { [slug]: frontmatterData }.
 * The markdown body is available as ._body if needed.
 */
function parseCollection(globMap) {
  const result = {};
  for (const [path, rawContent] of Object.entries(globMap)) {
    if (!rawContent) continue;
    try {
      const { data, content } = matter(rawContent);
      const slug = slugFromPath(path);
      result[slug] = { ...data, _body: content, _slug: slug };
    } catch (err) {
      console.warn(`[contentLoader] Failed to parse ${path}:`, err);
    }
  }
  return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Load every collection and return the full content map.
 * Shape: { templeInfo: { index: {...} }, festivals: { mahashivratri: {...} }, … }
 */
export function loadAllContent() {
  const result = {};
  for (const [key, globMap] of Object.entries(COLLECTIONS)) {
    result[key] = parseCollection(globMap);
  }
  return result;
}

/**
 * Return all items in a collection as a flat object keyed by slug.
 */
export function getContent(collectionKey) {
  const globMap = COLLECTIONS[collectionKey];
  if (!globMap) {
    console.warn(`[contentLoader] Unknown collection: "${collectionKey}"`);
    return {};
  }
  return parseCollection(globMap);
}

/**
 * Return a single item from a collection by slug (defaults to 'index').
 * Returns {} if not found so callers can safely spread / access properties.
 */
export function getItem(collectionKey, slug = 'index') {
  const collection = getContent(collectionKey);
  return collection[slug] ?? {};
}

/**
 * Return all items in a collection as an array, sorted ascending by .order.
 * Items without .order are placed at the end.
 */
export function getList(collectionKey) {
  const collection = getContent(collectionKey);
  return Object.values(collection).sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    return ao - bo;
  });
}

export default { loadAllContent, getContent, getItem, getList };
