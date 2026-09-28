import JSZip from 'jszip';

const CONTENT_KEYS = [
  'temple',
  'home',
  'contact',
  'festivals',
  'gallery',
  'videos',
  'music',
  'maps',
  'social',
  'images',
  'theme',
  'animations',
];

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
const AUDIO_EXTENSIONS = /\.mp3$/i;
const VIDEO_EXTENSIONS = /\.mp4$/i;

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function generateTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

export function dataUrlToUint8Array(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL format');
  }
  const mimeType = match[1];
  const base64 = match[2];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return {
    bytes,
    mimeType,
  };
}

function getMediaFolder(filename) {
  if (IMAGE_EXTENSIONS.test(filename)) {
    return 'public/media/images/custom';
  }
  if (AUDIO_EXTENSIONS.test(filename)) {
    return 'public/media/audio/custom';
  }
  if (VIDEO_EXTENSIONS.test(filename)) {
    return 'public/media/video/custom';
  }
  return 'public/media/documents/custom';
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportContentToZip(contentObj, mediaObj) {
  const zip = new JSZip();

  for (const key of CONTENT_KEYS) {
    if (contentObj[key] !== undefined) {
      const jsonData = JSON.stringify(contentObj[key], null, 2);
      zip.file(`content/${key}.json`, jsonData);
    }
  }

  for (const [filename, dataUrl] of Object.entries(mediaObj)) {
    const folder = getMediaFolder(filename);
    const { bytes } = dataUrlToUint8Array(dataUrl);
    zip.file(`${folder}/${filename}`, bytes);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const timestamp = generateTimestamp();
  const zipFilename = `mandir-content-${timestamp}.zip`;
  triggerDownload(blob, zipFilename);
}

export async function importContentFromZip(file) {
  const zip = await JSZip.loadAsync(file);
  const content = {};
  const media = {};

  const contentFiles = zip.folder('content');
  if (contentFiles) {
    await Promise.all(
      Object.entries(contentFiles.files).map(async ([path, zipEntry]) => {
        if (zipEntry.dir) return;
        const relativePath = path.replace('content/', '');
        if (!relativePath.endsWith('.json')) return;
        const key = relativePath.slice(0, -5);
        const jsonStr = await zipEntry.async('string');
        content[key] = JSON.parse(jsonStr);
      })
    );
  }

  const mediaFolder = zip.folder('public/media');
  if (mediaFolder) {
    await Promise.all(
      Object.entries(mediaFolder.files).map(async ([path, zipEntry]) => {
        if (zipEntry.dir) return;
        const relativePath = path.replace(/^public\//, '');
        const filename = path.split('/').pop();
        const ext = filename.includes('.') ? filename.slice(filename.lastIndexOf('.') + 1).toLowerCase() : '';
        let mimeType;
        if (['jpg', 'jpeg'].includes(ext)) mimeType = 'image/jpeg';
        else if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'gif') mimeType = 'image/gif';
        else if (ext === 'webp') mimeType = 'image/webp';
        else if (ext === 'svg') mimeType = 'image/svg+xml';
        else if (ext === 'mp3') mimeType = 'audio/mpeg';
        else if (ext === 'mp4') mimeType = 'video/mp4';
        else mimeType = 'application/octet-stream';
        const uint8 = await zipEntry.async('uint8array');
        let binaryStr = '';
        for (let i = 0; i < uint8.length; i++) {
          binaryStr += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binaryStr);
        media[relativePath] = `data:${mimeType};base64,${base64}`;
      })
    );
  }

  return { content, media };
}
