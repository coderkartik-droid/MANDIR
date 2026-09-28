/**
 * api.js — single place that talks to the FastAPI backend.
 *
 * Base URL resolution:
 *   • VITE_API_URL env var (optional override, e.g. a separate backend host)
 *   • Otherwise '' (same origin): the Vite dev server proxies /api to
 *     http://localhost:8000, and in production FastAPI serves the built
 *     frontend itself, so same-origin always works.
 */

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, options);
  } catch {
    throw new Error('Cannot reach the content server. Is the FastAPI backend running?');
  }
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body && body.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* keep default detail */
    }
    throw new Error(detail);
  }
  return response.json();
}

export const api = {
  health: () => request('/api/health'),

  getAllContent: () => request('/api/content'),

  getSection: (section) => request(`/api/content/${encodeURIComponent(section)}`),

  saveSection: (section, data) =>
    request(`/api/content/${encodeURIComponent(section)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  /** kind: 'image' | 'audio' | 'video' */
  uploadMedia: (kind, file) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/api/upload/${kind}`, { method: 'POST', body: form });
  },

  deleteMedia: (path) =>
    request(`/api/media?path=${encodeURIComponent(path)}`, { method: 'DELETE' }),
};

export default api;
