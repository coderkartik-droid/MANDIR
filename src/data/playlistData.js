/**
 * playlistData.js
 *
 * Loads the devotional music playlist from CMS-managed Markdown files
 * in content/music-playlist/. Falls back to built-in defaults if the
 * content folder is empty (e.g. during first-time setup).
 *
 * Each track object shape (matches AudioPlayer expectations):
 * {
 *   id, title, hindi, category, src, synthType?,
 *   duration, durationSec, symbol, tag, description, color, order
 * }
 */

import { getList } from '../utils/contentLoader';

// ─── Hardcoded defaults (used as fallback when CMS has no tracks) ─────────────
const DEFAULT_PLAYLIST = [
  {
    id: 'sanctum-bansuri',
    title: 'Sanctum Ambience (Bansuri & Tanpura)',
    hindi: 'दिव्य गर्भगृह बांसुरी एवं तानपुरा',
    category: 'Temple Ambience',
    src: '/audio/sanctum-ambience.mp3',
    synthType: 'bansuri-tanpura',
    duration: '12:40',
    durationSec: 760,
    symbol: '🪈',
    tag: 'Raga Bhairav Key of C#',
    description: 'Soul-stirring classical bamboo bansuri alaap accompanied by an acoustic four-string tanpura drone.',
    color: '#D4AF37',
    order: 1,
  },
  {
    id: 'santoor-dawn',
    title: 'Santoor at Dawn & Temple Birds',
    hindi: 'प्रभात संतूर एवं विहंग नाद',
    category: 'Divine Instrumental',
    src: '/audio/santoor-dawn.mp3',
    synthType: 'santoor',
    duration: '10:15',
    durationSec: 615,
    symbol: '🎼',
    tag: 'Cascading String Harmonic Arpeggios',
    description: 'Delicate 100-string hammered santoor melodies echoing through the morning mist with singing temple birds.',
    color: '#F59E0B',
    order: 2,
  },
  {
    id: 'veena-dhyana',
    title: 'Twilight Veena Meditation',
    hindi: 'संध्या वीणा ध्यान',
    category: 'Divine Instrumental',
    src: '/audio/veena-meditation.mp3',
    synthType: 'veena',
    duration: '14:20',
    durationSec: 860,
    symbol: '🪕',
    tag: 'Resonant Saraswati Veena Strings',
    description: 'Deep plucked acoustic veena sympathetic strings evoking profound meditative absorption and peace.',
    color: '#FF7A00',
    order: 3,
  },
  {
    id: 'monsoon-sanctum',
    title: 'Monsoon Rain & Distant Bells',
    hindi: 'वर्षा एवं दूरस्थ मन्दिर घण्टा घोष',
    category: 'Temple Ambience',
    src: '/audio/monsoon-sanctum.mp3',
    synthType: 'rain-bells',
    duration: '15:30',
    durationSec: 930,
    symbol: '🌧️',
    tag: 'Soothing Rainfall & Sacred Chimes',
    description: 'Gentle raindrops falling on ancient stone eaves blended with deep resonant Ashta-dhatu brass bells.',
    color: '#60A5FA',
    order: 4,
  },
  {
    id: 'brahma-muhurta',
    title: 'Brahma Muhurta Stillness & Flute',
    hindi: 'ब्रह्म मुहूर्त शांति एवं मन्द समीर',
    category: 'Divine Instrumental',
    src: '/audio/brahma-muhurta.mp3',
    synthType: 'brahma-muhurta',
    duration: '11:45',
    durationSec: 705,
    symbol: '🌅',
    tag: 'Dawn Meditation in Sacred Solitude',
    description: 'Soft morning breeze, distant conch shell overtone, and peaceful bansuri melodies before the sunrise.',
    color: '#FBBF24',
    order: 5,
  },
];

// ─── Load from CMS, fall back to defaults ────────────────────────────────────
function buildPlaylist() {
  try {
    const cmsTracks = getList('musicPlaylist');
    if (cmsTracks.length > 0) {
      return cmsTracks.map((track) => ({
        // Merge CMS data over defaults keyed by id, preserving synthType if absent
        ...DEFAULT_PLAYLIST.find((d) => d.id === track.id),
        ...track,
      }));
    }
  } catch (err) {
    console.warn('[playlistData] CMS load failed, using defaults:', err);
  }
  return DEFAULT_PLAYLIST;
}

export const devotionalPlaylist = buildPlaylist();
