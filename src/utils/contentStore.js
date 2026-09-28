/**
 * contentStore.js — in-memory content store fed by the FastAPI backend.
 *
 * The whole site reads content through the synchronous getters in
 * contentLoader.js, which are backed by this store. The store is filled
 * once at startup (initContent) and can be re-fetched after an admin
 * save (reload). React components subscribe through useSyncExternalStore
 * so the UI refreshes automatically — no page reload.
 */

import { api } from './api';

/** Backend JSON file name → site collection key. */
export const SECTION_TO_COLLECTION = {
  temple: 'templeInfo',
  home: 'homePage',
  contact: 'contactInfo',
  maps: 'maps',
  social: 'socialLinks',
  images: 'images',
  theme: 'themeColors',
  animations: 'animationSettings',
  festivals: 'festivals',
  gallery: 'gallery',
  videos: 'videos',
  music: 'musicPlaylist',
};

const LIST_SECTIONS = new Set(['festivals', 'gallery', 'videos', 'music']);

let rawBySection = {};
let collections = {};
let version = 0;
let loadError = null;
const listeners = new Set();

function parseSingleton(jsonData) {
  return { index: { ...(jsonData || {}), _slug: 'index' } };
}

function parseList(jsonData) {
  const result = {};
  const items = (jsonData && jsonData.items) || [];
  items.forEach((item, idx) => {
    const slug = item.id !== undefined && item.id !== null && item.id !== '' ? String(item.id) : `item_${idx}`;
    result[slug] = { ...item, _slug: slug };
  });
  return result;
}

function buildCollections(raw) {
  const next = {};
  Object.entries(SECTION_TO_COLLECTION).forEach(([section, collectionKey]) => {
    const data = raw[section];
    next[collectionKey] = LIST_SECTIONS.has(section) ? parseList(data) : parseSingleton(data);
  });
  return next;
}

function emit() {
  version += 1;
  listeners.forEach((fn) => fn());
}

export async function initContent() {
  try {
    const data = await api.getAllContent();
    rawBySection = data || {};
    collections = buildCollections(rawBySection);
    loadError = null;
  } catch (err) {
    loadError = err;
    console.error('[contentStore] Failed to load content from backend:', err.message);
  }
  emit();
  return { ok: !loadError, error: loadError };
}

/** Re-fetch everything from the backend (used after an admin save). */
export const reload = initContent;

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getVersion() {
  return version;
}

export function getLoadError() {
  return loadError;
}

export function isReady() {
  return version > 0;
}

export function getCollection(collectionKey) {
  return collections[collectionKey] || {};
}

export function getRawSection(section) {
  return rawBySection[section] ?? null;
}

export function getAllRaw() {
  return rawBySection;
}

export default {
  initContent,
  reload,
  subscribe,
  getVersion,
  getCollection,
  getRawSection,
  getAllRaw,
};
