import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, CloudRain, Sun, Sunset, Moon, Bell, Menu, X, Sparkles, Compass } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

export default function Navbar({
  isAudioPlaying,
  toggleAudio,
  isRain,
  toggleRain,
  timeMode,
  setTimeMode,
  onRingBell,
  onEnterTemple,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('sanctuary');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Detect active section
      const sections = ['sanctuary', 'shivling-darshan', 'panoramic-darshan', 'history', 'gallery', 'festivals', 'virtual-aarti', 'visit'];
      const scrollPos = window.scrollY + 200;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'sanctuary', label: 'Sanctuary', href: '#sanctuary' },
    { id: 'shivling-darshan', label: 'Shivling Darshan', href: '#shivling-darshan' },
    { id: 'panoramic-darshan', label: '360° Darshan', href: '#panoramic-darshan' },
    { id: 'history', label: 'History', href: '#history' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'festivals', label: 'Festivals', href: '#festivals' },
    { id: 'virtual-aarti', label: 'Offer Diya', href: '#virtual-aarti' },
    { id: 'visit', label: 'Visit Guide', href: '#visit' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextTimeMode = () => {
    const modes = ['morning', 'evening', 'night'];
    const nextIdx = (modes.indexOf(timeMode) + 1) % modes.length;
    setTimeMode(modes[nextIdx]);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
          scrolled ? 'pt-3' : 'pt-5'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto rounded-full transition-all duration-500 flex items-center justify-between px-5 sm:px-7 py-2.5 sm:py-3 border ${
            scrolled
              ? 'bg-navy-950/75 backdrop-blur-2xl border-gold-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
              : 'bg-navy-950/45 backdrop-blur-md border-gold-500/20 shadow-lg'
          }`}
        >
          {/* Logo & Temple Title */}
          <a
            href="#sanctuary"
            onClick={(e) => handleNavClick(e, '#sanctuary')}
            className="flex items-center gap-3 group shrink-0"
          >
            {/* Rotating Sacred Om Emblem */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold-400/60 bg-gradient-to-tr from-navy-900 via-navy-850 to-gold-900/40 flex items-center justify-center text-gold-300 font-cinzel text-lg sm:text-xl font-bold shadow-[0_0_15px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform">
              <span className="relative z-10">ॐ</span>
              <div className="absolute inset-0 rounded-full border border-gold-400/30 animate-spin-slow opacity-60" />
            </div>

            <div className="flex flex-col">
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.18em] text-sacred-ivory font-bold group-hover:text-gold-200 transition-colors leading-tight">
                SHREE BABA SIDHNATH
              </span>
              <span className="font-marcellus text-[10px] sm:text-xs tracking-[0.22em] text-gold-400 font-medium">
                ASHRAM JHADHEENA
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with Animated Underline */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-marcellus text-xs tracking-wider transition-colors relative py-1 ${
                    isActive ? 'text-gold-300 font-semibold' : 'text-sacred-ivory/80 hover:text-gold-200'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sacred-saffron via-gold-400 to-sacred-amber rounded-full shadow-[0_0_8px_#D4AF37]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Quick Interactive Atmosphere Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Cinematic Entrance Trigger Button */}
            {onEnterTemple && (
              <button
                onClick={onEnterTemple}
                className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-sacred-amber text-navy-950 font-cinzel text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:scale-105 active:scale-95 transition-all items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Enter Temple</span>
              </button>
            )}

            {/* Quick Ring Bell Button */}
            <button
              onClick={onRingBell}
              title="Ring Temple Bell (घण्टानाद)"
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-gold-500/40 bg-navy-900/80 hover:bg-gold-500/20 text-gold-300 flex items-center gap-1.5 transition-all text-xs font-marcellus hover:scale-105 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 animate-bell-sway" />
              <span className="hidden md:inline">Ring</span>
            </button>

            {/* Rain Mode Toggle */}
            <button
              onClick={toggleRain}
              title={isRain ? 'Disable Monsoon Rain' : 'Enable Monsoon Rain Mode'}
              className={`p-2 rounded-full border transition-all ${
                isRain
                  ? 'border-blue-400 bg-blue-900/50 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.45)]'
                  : 'border-gold-500/30 bg-navy-900/60 text-sacred-ivory/70 hover:text-gold-300'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>

            {/* Day / Evening / Night Cycle Button */}
            <button
              onClick={nextTimeMode}
              title={`Time Cycle: ${timeMode.toUpperCase()}`}
              className="p-2 rounded-full border border-gold-500/30 bg-navy-900/60 text-sacred-ivory/80 hover:text-gold-300 hover:border-gold-400 transition-all flex items-center gap-1 text-xs"
            >
              {timeMode === 'morning' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
              {timeMode === 'evening' && <Sunset className="w-3.5 h-3.5 text-orange-400" />}
              {timeMode === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-300" />}
            </button>

            {/* Ambient Flute / Drone Audio Toggle */}
            <button
              onClick={toggleAudio}
              title={isAudioPlaying ? 'Mute Sacred Flute' : 'Play Sacred Flute & Drone'}
              className={`p-2 rounded-full border transition-all ${
                isAudioPlaying
                  ? 'border-gold-400 bg-gold-500/20 text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.45)]'
                  : 'border-gold-500/30 bg-navy-900/60 text-sacred-ivory/60 hover:text-gold-300'
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Drawer Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-full border border-gold-500/30 text-gold-300 bg-navy-900/60 ml-0.5"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 z-40 bg-navy-950/95 backdrop-blur-2xl border border-gold-500/40 rounded-3xl p-6 xl:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              {onEnterTemple && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onEnterTemple();
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold-600 to-sacred-amber text-navy-950 font-cinzel text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 mb-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Begin Cinematic Entrance Walkthrough</span>
                </button>
              )}

              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-marcellus text-sm text-sacred-ivory/90 hover:text-gold-300 py-1.5 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-gold-500 text-xs">›</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
