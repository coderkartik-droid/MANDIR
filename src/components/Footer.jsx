import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Bell, ArrowUp, Phone, Mail, MapPin, Globe, Compass } from 'lucide-react';
import { templeInfo, visitGuidelines } from '../data/templeData';
import { soundEngine } from '../utils/audioEngine';

export default function Footer({ onRingBell }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundEngine.ringTempleBell(0.4, 1.3);
  };

  return (
    <footer className="relative bg-navy-950/80 backdrop-blur-xl border-t border-gold-500/25 pt-24 pb-14 px-4 sm:px-6 lg:px-8 z-10 text-sacred-ivory overflow-hidden">
      {/* Temple Silhouette Decorative Skyline */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none opacity-20 flex justify-center items-end overflow-hidden">
        <svg viewBox="0 0 1200 120" className="w-full h-16 fill-gold-400">
          <path d="M0,120 L0,90 Q150,85 200,60 L230,20 L260,60 Q300,85 450,90 L480,45 L520,0 L560,45 L600,90 Q750,85 800,55 L830,15 L860,55 Q900,85 1050,90 L1200,90 L1200,120 Z" />
        </svg>
      </div>

      {/* Golden Divider with Centered Kalash & Animated Diya Flames */}
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 mb-20 relative">
        <div className="h-[1.5px] flex-grow bg-gradient-to-r from-transparent via-gold-500/50 to-gold-400" />

        {/* Left Animated Diya */}
        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{ scaleY: [1, 1.25, 0.9, 1.15], scaleX: [1, 0.9, 1.1, 0.95] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-2.5 h-4 bg-gradient-to-t from-sacred-flame via-sacred-amber to-gold-200 rounded-full blur-[0.5px] shadow-[0_0_12px_#FF7A00]"
          />
          <div className="w-5 h-2 bg-gold-600 rounded-b-full border-t border-gold-400" />
        </div>

        {/* Center Sacred Emblem */}
        <div className="w-12 h-12 rounded-full border-2 border-gold-400 bg-navy-900/90 flex items-center justify-center text-gold-300 font-cinzel text-xl font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)]">
          ॐ
        </div>

        {/* Right Animated Diya */}
        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{ scaleY: [1.1, 0.95, 1.2, 1], scaleX: [0.95, 1.05, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-2.5 h-4 bg-gradient-to-t from-sacred-flame via-sacred-amber to-gold-200 rounded-full blur-[0.5px] shadow-[0_0_12px_#FF7A00]"
          />
          <div className="w-5 h-2 bg-gold-600 rounded-b-full border-t border-gold-400" />
        </div>

        <div className="h-[1.5px] flex-grow bg-gradient-to-l from-transparent via-gold-500/50 to-gold-400" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Mandir Summary & Inscription */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-sanskrit text-2xl sm:text-3xl text-gold-300 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
              {templeInfo.hindiName}
            </span>
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
            {templeInfo.name}
          </h3>
          <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/75 leading-relaxed max-w-sm">
            {templeInfo.description}
          </p>

          <div className="pt-2 text-xs font-marcellus text-gold-300/90 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <span>{visitGuidelines.address}</span>
          </div>

          {/* Social / Connect Icons */}
          <div className="flex items-center gap-3 pt-3">
            <a
              href="#sanctuary"
              title="YouTube Sacred Darshan"
              className="w-9 h-9 rounded-full bg-navy-900 border border-gold-500/30 text-gold-400 hover:text-white hover:bg-gold-500/20 hover:border-gold-400 flex items-center justify-center transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="#sanctuary"
              title="Instagram Community"
              className="w-9 h-9 rounded-full bg-navy-900 border border-gold-500/30 text-gold-400 hover:text-white hover:bg-gold-500/20 hover:border-gold-400 flex items-center justify-center transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="#sanctuary"
              title="Official Ashram Portal"
              className="w-9 h-9 rounded-full bg-navy-900 border border-gold-500/30 text-gold-400 hover:text-white hover:bg-gold-500/20 hover:border-gold-400 flex items-center justify-center transition-all shadow-md"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Sanctuary Navigation */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-cinzel text-xs sm:text-sm font-bold text-gold-400 uppercase tracking-widest mb-4">
            Sanctuary Portals
          </h4>
          <ul className="space-y-2.5 text-xs font-marcellus text-sacred-ivory/70">
            <li>
              <a href="#sanctuary" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> 3D Temple Sanctuary
              </a>
            </li>
            <li>
              <a href="#shivling-darshan" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> 360° Holy Shivling Darshan
              </a>
            </li>
            <li>
              <a href="#panoramic-darshan" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> Pseudo 360° Ashram Darshan
              </a>
            </li>
            <li>
              <a href="#history" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> Siddha Heritage & Chronicles
              </a>
            </li>
            <li>
              <a href="#gallery" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> Sacred Photo Gallery
              </a>
            </li>
            <li>
              <a href="#festivals" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> Holy Festivals & Observances
              </a>
            </li>
            <li>
              <a href="#virtual-aarti" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> Kindle a Diya & Offer Prayers
              </a>
            </li>
            <li>
              <a href="#visit" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span className="text-gold-500">✦</span> Aarti Timings & Pilgrim Route
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info & Vedic Shlokas */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-cinzel text-xs sm:text-sm font-bold text-gold-400 uppercase tracking-widest mb-4">
            Vedic Inscription
          </h4>

          <div className="p-5 rounded-2xl bg-navy-950/50 border border-gold-500/25 text-center shadow-lg backdrop-blur-md">
            <p className="font-sanskrit text-sm sm:text-base text-gold-300 mb-1.5">
              ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।<br />
              पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥
            </p>
            <p className="font-marcellus text-[11px] text-sacred-ivory/70 italic mt-2">
              "Om. That is whole; this is whole. From wholeness comes wholeness. Take wholeness from wholeness, wholeness remains."
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onRingBell}
              className="px-5 py-2.5 rounded-full bg-navy-900/80 border border-gold-500/40 text-gold-300 text-xs font-cinzel hover:bg-gold-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-md"
            >
              <Bell className="w-3.5 h-3.5 animate-bell-sway" />
              <span>Ring Temple Bell</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-navy-900/80 border border-gold-500/40 text-gold-300 hover:text-white hover:bg-gold-500/20 hover:scale-110 active:scale-95 transition-all shadow-md"
              title="Return to Sanctuary Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Creative Attribution */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-marcellus text-sacred-ivory/50 gap-4">
        <div>
          © {new Date().getFullYear()} Shree Baba Sidhnath Mandir Trust, Ashram Jhadheena. All rights reserved.
        </div>
        <div className="flex items-center gap-1.5 text-gold-400/90 font-cinzel tracking-wider text-[10px]">
          <span>BUILT FOR PEACE, SPIRITUALITY & DIVINE TRANSCENDENCE</span>
        </div>
      </div>
    </footer>
  );
}
