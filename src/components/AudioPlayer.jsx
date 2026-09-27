import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Repeat1,
  Shuffle,
  ChevronDown,
  ChevronUp,
  ListMusic,
  Sparkles,
} from 'lucide-react';
import { devotionalPlaylist } from '../data/playlistData';
import { soundEngine } from '../utils/audioEngine';

export default function AudioPlayer({ isEntering = false }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [equalizerBands, setEqualizerBands] = useState([20, 45, 75, 55, 80, 40, 65, 30]);
  const [progressRatio, setProgressRatio] = useState(0);

  const currentTrack = devotionalPlaylist[currentTrackIndex] || devotionalPlaylist[0];

  useEffect(() => {
    try {
      const savedIndex = localStorage.getItem('mandir_track_index');
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10);
        if (idx >= 0 && idx < devotionalPlaylist.length) {
          setCurrentTrackIndex(idx);
        }
      }
      const savedLoop = localStorage.getItem('mandir_audio_loop');
      if (savedLoop !== null) setIsLooping(savedLoop === 'true');
      const savedShuffle = localStorage.getItem('mandir_audio_shuffle');
      if (savedShuffle !== null) setIsShuffling(savedShuffle === 'true');
    } catch {}
  }, []);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    soundEngine.onTrackEnded(() => {
      if (isLooping) {
        soundEngine.seekTo(0);
        soundEngine.playTrack(currentTrack);
      } else {
        handleNextTrack();
      }
    });
  }, [isLooping, currentTrackIndex]);

  // Live animated equalizer loop from Web Audio Analyser
  useEffect(() => {
    let animId;
    const updateEqualizer = () => {
      if (isPlaying && !isMuted) {
        const data = soundEngine.getEqualizerData();
        setEqualizerBands(data);
        if (soundEngine.duration > 0) {
          setProgressRatio(Math.min(soundEngine.currentTime / soundEngine.duration, 1));
        }
      } else {
        setEqualizerBands([8, 12, 10, 14, 8, 12, 10, 8]);
      }
      animId = requestAnimationFrame(updateEqualizer);
    };
    animId = requestAnimationFrame(updateEqualizer);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isMuted]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          handleToggleMute();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNextTrack();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevTrack();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => Math.min(1.0, +(v + 0.05).toFixed(2)));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => Math.max(0.0, +(v - 0.05).toFixed(2)));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, currentTrackIndex, isShuffling]);

  const togglePlay = () => {
    if (isPlaying) {
      soundEngine.pauseTrack();
      setIsPlaying(false);
    } else {
      soundEngine.playTrack(currentTrack, 1.5);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    let nextIdx;
    if (isShuffling) {
      nextIdx = Math.floor(Math.random() * devotionalPlaylist.length);
    } else {
      nextIdx = (currentTrackIndex + 1) % devotionalPlaylist.length;
    }
    setCurrentTrackIndex(nextIdx);
    localStorage.setItem('mandir_track_index', String(nextIdx));
    const nextTrack = devotionalPlaylist[nextIdx];
    soundEngine.playTrack(nextTrack, 2.0);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + devotionalPlaylist.length) % devotionalPlaylist.length;
    setCurrentTrackIndex(prevIdx);
    localStorage.setItem('mandir_track_index', String(prevIdx));
    const prevTrack = devotionalPlaylist[prevIdx];
    soundEngine.playTrack(prevTrack, 2.0);
    setIsPlaying(true);
  };

  const handleSelectTrack = (idx) => {
    setCurrentTrackIndex(idx);
    localStorage.setItem('mandir_track_index', String(idx));
    const track = devotionalPlaylist[idx];
    soundEngine.playTrack(track, 1.8);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const toggleLoop = () => {
    setIsLooping((prev) => {
      const next = !prev;
      localStorage.setItem('mandir_audio_loop', String(next));
      return next;
    });
  };

  const toggleShuffle = () => {
    setIsShuffling((prev) => {
      const next = !prev;
      localStorage.setItem('mandir_audio_shuffle', String(next));
      return next;
    });
  };

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    soundEngine.seekTo(ratio);
    setProgressRatio(ratio);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <AnimatePresence mode="wait">
        {/* ================= EXPANDED LUXURY PLAYER ================= */}
        {isExpanded ? (
          <motion.div
            key="expanded-player"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-80 sm:w-96 rounded-3xl glass-panel-dark border border-gold-400/50 shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.2)] p-5 relative overflow-hidden backdrop-blur-2xl"
          >
            {/* Ornate Gold Corners */}
            <div className="ornate-corner-tl" />
            <div className="ornate-corner-tr" />
            <div className="ornate-corner-bl" />
            <div className="ornate-corner-br" />

            {/* Header: Title & Minimize Toggle */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="font-cinzel text-xs font-bold text-gold-300 tracking-wider">
                  TEMPLE AMBIENCE
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  title="View Soundscapes"
                  className={`p-1.5 rounded-lg transition-colors ${
                    showPlaylist
                      ? 'bg-gold-500/20 text-gold-300'
                      : 'text-sacred-ivory/60 hover:text-gold-300'
                  }`}
                >
                  <ListMusic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  title="Minimize Player"
                  className="p-1.5 rounded-lg text-sacred-ivory/60 hover:text-gold-300 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Track Info & Rotating Sacred Artwork */}
            <div className="flex items-center gap-4 mb-4">
              {/* Circular Rotating Album Medallion */}
              <div className="relative w-16 h-16 shrink-0">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                  className="w-full h-full rounded-full border-2 border-gold-400 bg-gradient-to-tr from-navy-950 via-navy-900 to-gold-950/60 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                >
                  <span>{currentTrack.symbol}</span>
                </motion.div>
                <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-navy-950 border border-gold-400" />
              </div>

              {/* Title & Category */}
              <div className="flex-grow overflow-hidden">
                <span className="font-sanskrit text-xs text-gold-400 block truncate">
                  {currentTrack.hindi}
                </span>
                <h4 className="font-cinzel text-sm font-bold text-gold-gradient truncate">
                  {currentTrack.title}
                </h4>
                <span className="font-marcellus text-[10px] text-sacred-amber uppercase tracking-wider block mt-0.5">
                  {currentTrack.category} • {currentTrack.tag}
                </span>
              </div>
            </div>

            {/* Animated Equalizer Frequency Visualizer Bars */}
            <div className="flex items-end justify-center gap-1.5 h-10 mb-4 px-2 bg-navy-950/70 rounded-xl border border-gold-500/20 py-1.5">
              {equalizerBands.map((val, i) => {
                const heightPct = Math.max(12, Math.min(100, (val / 255) * 100));
                return (
                  <div
                    key={i}
                    className="w-2.5 bg-gradient-to-t from-sacred-saffron via-gold-400 to-sacred-amber rounded-t-sm shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all duration-75"
                    style={{ height: `${heightPct}%` }}
                  />
                );
              })}
            </div>

            {/* Scrubber Progress Bar */}
            <div className="mb-4">
              <div
                onClick={handleScrubberClick}
                className="w-full h-1.5 bg-navy-900 rounded-full cursor-pointer relative overflow-hidden group border border-white/5"
              >
                <div
                  className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-sacred-amber rounded-full shadow-[0_0_8px_#D4AF37]"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-cinzel text-sacred-ivory/50 mt-1">
                <span>00:{Math.floor(progressRatio * 60).toString().padStart(2, '0')}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Master Controls */}
            <div className="flex items-center justify-between mb-4 px-3">
              <button
                onClick={toggleShuffle}
                title={isShuffling ? "Disable Shuffle" : "Enable Shuffle"}
                className={`p-2 rounded-full transition-colors ${
                  isShuffling ? "text-gold-300 bg-gold-500/20" : "text-sacred-ivory/50 hover:text-gold-300"
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevTrack}
                title="Previous Track (ArrowLeft)"
                className="p-2 rounded-full text-sacred-ivory/80 hover:text-gold-300 hover:scale-110 active:scale-95 transition-all"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-600 to-sacred-amber border-2 border-gold-300 text-navy-950 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-navy-950" />
                ) : (
                  <Play className="w-5 h-5 fill-navy-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                title="Next Track (ArrowRight)"
                className="p-2 rounded-full text-sacred-ivory/80 hover:text-gold-300 hover:scale-110 active:scale-95 transition-all"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleLoop}
                title={isLooping ? "Disable Loop" : "Enable Loop"}
                className={`p-2 rounded-full transition-colors ${
                  isLooping ? "text-gold-300 bg-gold-500/20" : "text-sacred-ivory/50 hover:text-gold-300"
                }`}
              >
                {isLooping ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Volume Slider & Mute */}
            <div className="flex items-center gap-3 px-2 pt-2 border-t border-gold-500/20">
              <button
                onClick={handleToggleMute}
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
                className="text-gold-400 hover:text-gold-200 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1.5 bg-navy-900 rounded-lg appearance-none cursor-pointer accent-gold-400"
              />

              <span className="font-cinzel text-[10px] text-gold-300/80 w-8 text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Soundscape Dropdown Drawer */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-3 border-t border-gold-500/20 max-h-48 overflow-y-auto space-y-1.5 pr-1"
                >
                  <span className="font-cinzel text-[10px] text-sacred-amber uppercase tracking-wider block mb-1">
                    Select Divine Instrumental Soundscape:
                  </span>
                  {devotionalPlaylist.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectTrack(idx)}
                      className={`p-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        idx === currentTrackIndex
                          ? 'bg-gold-500/20 border border-gold-400/50 text-gold-200'
                          : 'bg-navy-950/50 hover:bg-gold-500/10 text-sacred-ivory/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-sm shrink-0">{item.symbol}</span>
                        <div className="truncate">
                          <span className="font-cinzel font-semibold block truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-sanskrit text-gold-400/80">
                            {item.hindi}
                          </span>
                        </div>
                      </div>
                      <span className="font-cinzel text-[10px] text-sacred-ivory/50 shrink-0 ml-2">
                        {item.duration}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ================= MINIMIZED FLOATING PILL ================= */
          <motion.div
            key="minimized-pill"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsExpanded(true)}
            className="group cursor-pointer rounded-full glass-panel-dark border border-gold-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.25)] px-4 py-2 flex items-center gap-3 backdrop-blur-2xl hover:border-gold-300 transition-all hover:scale-105"
          >
            {/* Spinning Mini Artwork */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-8 h-8 rounded-full border border-gold-400 bg-gradient-to-tr from-navy-950 to-gold-900/60 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            >
              <span>{currentTrack.symbol}</span>
            </motion.div>

            {/* Track Info */}
            <div className="max-w-[130px] sm:max-w-[180px] overflow-hidden text-left">
              <span className="font-cinzel text-xs font-bold text-gold-gradient block truncate">
                {currentTrack.title}
              </span>
              <span className="font-marcellus text-[10px] text-sacred-amber uppercase tracking-wider block truncate">
                {currentTrack.category}
              </span>
            </div>

            {/* Mini Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-4 px-1">
              {equalizerBands.slice(0, 4).map((val, i) => (
                <div
                  key={i}
                  className="w-1 bg-gold-400 rounded-t-sm"
                  style={{ height: `${Math.max(20, Math.min(100, (val / 255) * 100))}%` }}
                />
              ))}
            </div>

            {/* Quick Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              title={isPlaying ? "Pause" : "Play"}
              className="p-1.5 rounded-full bg-gold-500 text-navy-950 hover:brightness-110 shadow-md"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            {/* Expand Indicator */}
            <ChevronUp className="w-4 h-4 text-gold-400 group-hover:-translate-y-0.5 transition-transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
