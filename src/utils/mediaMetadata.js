/**
 * mediaMetadata.js
 *
 * Client-side media metadata extraction utilities.
 *
 * All functions are async and return a plain metadata object.
 * They work entirely with browser APIs (Web Audio API, HTMLVideoElement,
 * HTMLAudioElement, Canvas) — no Node.js / FFmpeg required.
 *
 * ─── Audio ───────────────────────────────────────────────────────────────────
 *   extractAudioMetadata(src)  → { duration, durationSec, fileSize, bitrate,
 *                                   format, sampleRate, channels }
 *
 * ─── Video ───────────────────────────────────────────────────────────────────
 *   extractVideoMetadata(src)  → { duration, durationSec, resolution, width,
 *                                   height, fileSize, format, thumbnailDataUrl }
 *
 * ─── Shared ──────────────────────────────────────────────────────────────────
 *   prefetchMetadata(items, type) → calls the right extractor for a list,
 *                                   returns an array of enriched items
 */

import { formatDuration, formatBytes } from './mediaUtils.js';

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** HEAD request to get content-length without downloading the whole file */
async function fetchFileSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'force-cache' });
    const len = res.headers.get('content-length');
    return len ? parseInt(len, 10) : null;
  } catch {
    return null;
  }
}

/** Derive MIME format label from URL extension */
function formatFromUrl(url) {
  const ext = (url || '').split('.').pop().toLowerCase();
  const map = {
    mp3: 'MP3', ogg: 'OGG', wav: 'WAV', flac: 'FLAC', aac: 'AAC',
    mp4: 'MP4', webm: 'WebM', mov: 'MOV', avi: 'AVI', mkv: 'MKV',
  };
  return map[ext] ?? ext.toUpperCase();
}

// ─── Audio metadata ───────────────────────────────────────────────────────────

/**
 * Extract metadata from an audio file URL using HTMLAudioElement + Web Audio API.
 *
 * Returns:
 * {
 *   durationSec:  number,   // raw seconds
 *   duration:     string,   // "MM:SS" display
 *   fileSize:     string,   // "X.X MB" display (from HEAD request)
 *   fileSizeBytes:number,
 *   bitrate:      string,   // estimated "XXX kbps"
 *   format:       string,   // "MP3"
 *   sampleRate:   number,   // Hz (from AudioContext, if available)
 *   channels:     number,   // 1 = mono, 2 = stereo
 * }
 */
export async function extractAudioMetadata(src) {
  if (!src) return null;

  const result = {
    durationSec:   0,
    duration:      '0:00',
    fileSize:      '',
    fileSizeBytes: 0,
    bitrate:       '',
    format:        formatFromUrl(src),
    sampleRate:    0,
    channels:      0,
  };

  // ── 1. Duration via HTMLAudioElement ────────────────────────────────────────
  try {
    const durationSec = await new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload  = 'metadata';
      audio.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => reject(new Error('timeout')), 8000);

      audio.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout);
        resolve(isFinite(audio.duration) ? audio.duration : 0);
      }, { once: true });

      audio.addEventListener('error', () => {
        clearTimeout(timeout);
        reject(new Error(audio.error?.message ?? 'load error'));
      }, { once: true });

      audio.src = src;
    });

    result.durationSec = Math.round(durationSec);
    result.duration    = formatDuration(durationSec);
  } catch {
    // Duration unavailable — leave defaults
  }

  // ── 2. File size via HEAD ────────────────────────────────────────────────────
  const bytes = await fetchFileSize(src);
  if (bytes) {
    result.fileSizeBytes = bytes;
    result.fileSize      = formatBytes(bytes);

    // Estimated bitrate = (fileSize in bits) / durationSec
    if (result.durationSec > 0) {
      const kbps = Math.round((bytes * 8) / result.durationSec / 1000);
      result.bitrate = `${kbps} kbps`;
    }
  }

  // ── 3. Sample rate + channels via Web Audio API (best-effort) ───────────────
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && bytes && bytes < 20 * 1024 * 1024) { // only for files < 20 MB
      const res    = await fetch(src, { cache: 'force-cache' });
      const buf    = await res.arrayBuffer();
      const ctx    = new AudioCtx();
      const decoded = await ctx.decodeAudioData(buf);
      result.sampleRate = decoded.sampleRate;
      result.channels   = decoded.numberOfChannels;
      await ctx.close();
    }
  } catch {
    // Web Audio decode failed — skip sampleRate/channels
  }

  return result;
}

// ─── Video metadata + thumbnail ───────────────────────────────────────────────

/**
 * Extract metadata from a video file URL using an off-screen HTMLVideoElement.
 * Captures the first decodable frame as a base64 PNG thumbnail via <canvas>.
 *
 * Returns:
 * {
 *   durationSec:      number,
 *   duration:         string,   // "MM:SS"
 *   width:            number,   // video width px
 *   height:           number,   // video height px
 *   resolution:       string,   // "1920×1080"
 *   fileSize:         string,   // "X.X MB"
 *   fileSizeBytes:    number,
 *   format:           string,   // "MP4"
 *   thumbnailDataUrl: string,   // data:image/png;base64,…  (or '')
 * }
 */
export async function extractVideoMetadata(src) {
  if (!src) return null;

  const result = {
    durationSec:      0,
    duration:         '0:00',
    width:            0,
    height:           0,
    resolution:       '',
    fileSize:         '',
    fileSizeBytes:    0,
    format:           formatFromUrl(src),
    thumbnailDataUrl: '',
  };

  // HEAD request first (non-blocking)
  const bytesPromise = fetchFileSize(src);

  // ── Off-screen video element ─────────────────────────────────────────────────
  try {
    await new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted        = true;
      video.preload      = 'metadata';
      video.crossOrigin  = 'anonymous';
      video.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;';
      document.body.appendChild(video);

      const cleanup = () => {
        try { document.body.removeChild(video); } catch {}
      };

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('timeout'));
      }, 12000);

      video.addEventListener('loadedmetadata', () => {
        result.durationSec = Math.round(isFinite(video.duration) ? video.duration : 0);
        result.duration    = formatDuration(video.duration);
        result.width       = video.videoWidth;
        result.height      = video.videoHeight;
        result.resolution  = video.videoWidth
          ? `${video.videoWidth}×${video.videoHeight}`
          : '';

        // Seek to 1s (or 10% through) to get a non-black frame
        video.currentTime = Math.min(1, video.duration * 0.1);
      }, { once: true });

      video.addEventListener('seeked', () => {
        // Capture thumbnail
        try {
          const canvas = document.createElement('canvas');
          // Thumbnail at most 640px wide
          const scale  = Math.min(1, 640 / (video.videoWidth || 640));
          canvas.width  = Math.round(video.videoWidth  * scale);
          canvas.height = Math.round(video.videoHeight * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          result.thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        } catch {
          // Cross-origin taint — thumbnail unavailable
        }

        clearTimeout(timeout);
        cleanup();
        resolve();
      }, { once: true });

      video.addEventListener('error', () => {
        clearTimeout(timeout);
        cleanup();
        reject(new Error(video.error?.message ?? 'load error'));
      }, { once: true });

      video.src = src;
    });
  } catch {
    // Video load failed — return partial result
  }

  const bytes = await bytesPromise;
  if (bytes) {
    result.fileSizeBytes = bytes;
    result.fileSize      = formatBytes(bytes);
  }

  return result;
}

// ─── Batch prefetch ───────────────────────────────────────────────────────────

/**
 * Enrich an array of track/video objects with metadata.
 * Runs extractions in parallel with a concurrency cap to avoid hammering
 * the server on initial load.
 *
 * @param {Array}  items      - Array of objects, each must have a `src` field
 * @param {'audio'|'video'} type
 * @param {number} concurrency - Max parallel fetches (default 3)
 * @returns {Promise<Array>}   - Same array with metadata fields merged in
 */
export async function prefetchMetadata(items, type = 'audio', concurrency = 3) {
  if (!items?.length) return items;

  const extractor = type === 'video' ? extractVideoMetadata : extractAudioMetadata;
  const results   = [...items];

  // Process in sliding-window batches
  for (let i = 0; i < results.length; i += concurrency) {
    const batch = results.slice(i, i + concurrency);
    const metas = await Promise.allSettled(
      batch.map((item) => extractor(item.src))
    );

    metas.forEach((outcome, j) => {
      if (outcome.status === 'fulfilled' && outcome.value) {
        results[i + j] = { ...results[i + j], ...outcome.value };
      }
    });
  }

  return results;
}
