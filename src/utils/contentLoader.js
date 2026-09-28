import templeJson from '../../content/temple.json';
import homeJson from '../../content/home.json';
import contactJson from '../../content/contact.json';
import festivalsJson from '../../content/festivals.json';
import galleryJson from '../../content/gallery.json';
import videosJson from '../../content/videos.json';
import musicJson from '../../content/music.json';
import mapsJson from '../../content/maps.json';
import socialJson from '../../content/social.json';
import imagesJson from '../../content/images.json';
import themeJson from '../../content/theme.json';
import animationsJson from '../../content/animations.json';

const SINGLETON_COLLECTIONS = {
  templeInfo: templeJson,
  homePage: homeJson,
  contactInfo: contactJson,
  maps: mapsJson,
  socialLinks: socialJson,
  images: imagesJson,
  themeColors: themeJson,
  animationSettings: animationsJson,
};

const LIST_COLLECTIONS = {
  festivals: festivalsJson,
  gallery: galleryJson,
  videos: videosJson,
  musicPlaylist: musicJson,
};

function parseSingleton(jsonData) {
  return { index: { ...jsonData, _slug: 'index' } };
}

function parseList(jsonData) {
  const result = {};
  const items = jsonData.items || [];
  items.forEach((item, idx) => {
    const slug = item.id ? String(item.id) : `item_${idx}`;
    result[slug] = { ...item, _slug: slug };
  });
  return result;
}

function parseCollection(collectionKey) {
  if (SINGLETON_COLLECTIONS[collectionKey] !== undefined) {
    return parseSingleton(SINGLETON_COLLECTIONS[collectionKey]);
  }
  if (LIST_COLLECTIONS[collectionKey] !== undefined) {
    return parseList(LIST_COLLECTIONS[collectionKey]);
  }
  console.warn(`[contentLoader] Unknown collection: "${collectionKey}"`);
  return {};
}

export function loadAllContent() {
  const result = {};
  Object.keys(SINGLETON_COLLECTIONS).forEach((key) => {
    result[key] = parseSingleton(SINGLETON_COLLECTIONS[key]);
  });
  Object.keys(LIST_COLLECTIONS).forEach((key) => {
    result[key] = parseList(LIST_COLLECTIONS[key]);
  });
  return result;
}

export function getContent(collectionKey) {
  return parseCollection(collectionKey);
}

export function getItem(collectionKey, slug = 'index') {
  const collection = getContent(collectionKey);
  return collection[slug] ?? {};
}

export function getList(collectionKey) {
  const collection = getContent(collectionKey);
  return Object.values(collection).sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    return ao - bo;
  });
}

export function getRawJson(collectionKey) {
  if (SINGLETON_COLLECTIONS[collectionKey] !== undefined) {
    return SINGLETON_COLLECTIONS[collectionKey];
  }
  if (LIST_COLLECTIONS[collectionKey] !== undefined) {
    return LIST_COLLECTIONS[collectionKey];
  }
  return null;
}

export default { loadAllContent, getContent, getItem, getList, getRawJson };
