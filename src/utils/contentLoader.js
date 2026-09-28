/**
 * contentLoader.js — synchronous content access for site components.
 *
 * Data comes from the FastAPI backend via contentStore (filled at startup).
 * The exported function signatures are unchanged, so sections keep working
 * exactly as before — they just read live, admin-editable content now.
 */

import { getCollection, getRawSection, SECTION_TO_COLLECTION } from './contentStore';

const COLLECTION_TO_SECTION = Object.fromEntries(
  Object.entries(SECTION_TO_COLLECTION).map(([section, key]) => [key, section])
);

export function loadAllContent() {
  const result = {};
  Object.values(SECTION_TO_COLLECTION).forEach((collectionKey) => {
    result[collectionKey] = getCollection(collectionKey);
  });
  return result;
}

export function getContent(collectionKey) {
  return getCollection(collectionKey);
}

export function getItem(collectionKey, slug = 'index') {
  const collection = getCollection(collectionKey);
  return collection[slug] ?? {};
}

export function getList(collectionKey) {
  const collection = getCollection(collectionKey);
  return Object.values(collection).sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    return ao - bo;
  });
}

export function getRawJson(collectionKey) {
  const section = COLLECTION_TO_SECTION[collectionKey];
  return section ? getRawSection(section) : null;
}

export default { loadAllContent, getContent, getItem, getList, getRawJson };
