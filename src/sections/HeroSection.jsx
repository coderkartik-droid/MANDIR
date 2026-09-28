import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sparkles, Volume2, CloudRain, ArrowDown, Compass, Play } from 'lucide-react';
import { templeInfo } from '../data/templeData';
import { getItem } from '../utils/contentLoader';
import { subscribe as subscribeToContent, getVersion as getContentVersion } from '../utils/contentStore';

export default function HeroSection({
  onRingBell,
  onEnterTemple,
  bellRungCount = 0,
  isAudioPlaying,
  toggleAudio,
  isRain,
  toggleRain,
  timeMode,
  setTimeMode,
}) {
  const [showBlessing, setShowBlessing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [editableContent, setEditableContent] = useState(null);
  const contentVersion = useSyncExternalStore(subscribeToContent, getContentVersion);

  useEffect(() => {
    const homePageData = getItem('homePage', 'index');
    const templeInfoData = getItem('templeInfo', 'index');
    setEditableContent({
      homePage: homePageData,
      templeInfo: templeInfoData,
    });
  }, [contentVersion]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRing = () => {
    onRingBell();
    setShowBlessing(true);
    setTimeout(() => setShowBlessing(false), 2600);
  };

  return (
    <section
      id="sanctuary"
      className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-32 pb-14 select-none pointer-events-none overflow-hidden"
    >
      {/* Dynamic Golden Glow Spot Behind Hero Text Following Mouse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-radial-gradient from-gold-500/15 via-sacred-saffron/8 to-transparent blur-[140px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`,
        }}
      />

      {/* Top Sacred Shlokas Pill Banner */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="pointer-events-auto flex flex-col items-center text-center mt-2 z-10"
      >
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-navy-950/75 border border-gold-400/40 backdrop-blur-xl shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
          <span className="font-sanskrit text-xs sm:text-sm text-gold-200 tracking-wider">
            {editableContent?.templeInfo?.mantra || templeInfo.mantra}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
        </div>
      </motion.div>

      {/* Main Massive Center Hero Typography */}
      <div className="pointer-events-auto text-center max-w-5xl mx-auto flex flex-col items-center my-auto z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
          }}
        >
          {/* Sanskrit Heading */}
          <motion.h2
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="font-sanskrit text-2xl sm:text-4xl md:text-5xl text-gold-300 drop-shadow-[0_4px_20px_rgba(212,175,55,0.6)] mb-3 tracking-wide"
          >
            {editableContent?.templeInfo?.hindiName || templeInfo.hindiName}
          </motion.h2>

          {/* Hollywood-level Cinematic English Title */}
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.06em] uppercase text-gold-gradient drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)] leading-[1.05]">
            {editableContent?.homePage?.heroTitle || "SHREE BABA SIDHNATH"}
          </h1>

          {/* Subtitle with Ornate Filigree Lines */}
          <div className="flex items-center justify-center gap-4 my-3 sm:my-4">
            <div className="h-[1.5px] w-14 sm:w-32 bg-gradient-to-r from-transparent via-gold-400 to-gold-400 shadow-[0_0_8px_#FFD700]" />
            <span className="font-marcellus text-sm sm:text-xl tracking-[0.35em] uppercase text-sacred-ivory font-semibold drop-shadow-md">
              {editableContent?.homePage?.heroSubtitle || "Ashram Jhadheena"}
            </span>
            <div className="h-[1.5px] w-14 sm:w-32 bg-gradient-to-l from-transparent via-gold-400 to-gold-400 shadow-[0_0_8px_#FFD700]" />
          </div>

          <p className="font-marcellus text-xs sm:text-base text-sacred-ivory/85 max-w-2xl mx-auto italic drop-shadow-lg px-4 leading-relaxed">
            "{editableContent?.homePage?.heroDescription || "Enter through the ancient Royal Navy & Gold Arch into centuries of unbroken Siddha meditation, sacred banyan shade, and divine silence."}"
          </p>
        </motion.div>

        {/* Master Interactive Action Hub */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4"
        >
          {/* Main Cinematic Entrance Sequence Trigger Button */}
          {onEnterTemple && (
            <button
              onClick={onEnterTemple}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-gold-600 via-gold-400 to-sacred-amber text-navy-950 font-cinzel font-black text-xs sm:text-sm tracking-widest shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:shadow-[0_0_55px_rgba(255,215,0,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
            >
              {/* Liquid gold shimmer highlight */}
              <div className="absolute inset-0 bg-white/30 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-in-out" />
              <Play className="w-4 h-4 fill-navy-950" />
              <span>{editableContent?.homePage?.buttonText || "ENTER SACRED TEMPLE (महाप्रवेश)"}</span>
            </button>
          )}

          {/* Interactive Bell Ringing Button */}
          <button
            onClick={handleRing}
            className="group px-6 py-4 rounded-full bg-navy-950/80 border border-gold-400/50 hover:border-gold-300 text-sacred-ivory font-cinzel text-xs sm:text-sm tracking-wider backdrop-blur-xl hover:bg-gold-500/15 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <Bell className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform" />
            <span>RING TEMPLE BELL</span>
            {bellRungCount > 0 && (
              <span className="bg-gold-500 text-navy-950 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans">
                {bellRungCount}
              </span>
            )}
          </button>

          {/* Rain Mode Quick Toggle */}
          <button
            onClick={toggleRain}
            className={`px-5 py-4 rounded-full border text-xs font-marcellus tracking-wider backdrop-blur-xl transition-all flex items-center gap-2 ${
              isRain
                ? 'bg-blue-950/85 border-blue-400 text-blue-200 shadow-[0_0_25px_rgba(96,165,250,0.4)]'
                : 'bg-navy-950/60 border-gold-500/30 text-sacred-ivory/80 hover:text-gold-300'
            }`}
          >
            <CloudRain className="w-4 h-4 text-blue-400" />
            <span>{isRain ? 'Monsoon Active' : 'Monsoon Rain'}</span>
          </button>
        </motion.div>

        {/* Bell Blessing Toast Notification */}
        <AnimatePresence>
          {showBlessing && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="mt-4 px-6 py-2.5 rounded-full bg-navy-950/90 border border-gold-400/70 text-gold-200 text-xs sm:text-sm font-marcellus shadow-[0_0_30px_rgba(212,175,55,0.45)] flex items-center gap-2 backdrop-blur-xl"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>घण्टानाद मंगलकारी • May the sacred vibration bring inner stillness!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bell-Shaped Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-auto flex flex-col items-center cursor-pointer group mt-4 z-10"
        onClick={onEnterTemple}
      >
        <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.3em] text-gold-300/80 uppercase group-hover:text-gold-200 transition-colors mb-2">
          Scroll Down Or Tap Bell To Enter
        </span>

        {/* Temple Bell Silhouette Scroll Shape */}
        <div className="w-7 h-11 rounded-full border border-gold-400/50 flex flex-col items-center justify-between p-1.5 group-hover:border-gold-300 transition-colors shadow-[0_0_12px_rgba(212,175,55,0.25)]">
          {/* Top Hanging Ring */}
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400/60" />
          {/* Clapper Bob */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-2 h-2.5 bg-gradient-to-b from-gold-300 to-sacred-amber rounded-full shadow-[0_0_8px_#FFD700]"
          />
          {/* Bottom Lip */}
          <div className="w-3.5 h-[1.5px] bg-gold-400/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
