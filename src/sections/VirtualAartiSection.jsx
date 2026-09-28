import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Heart, Bell, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audioEngine';

export default function VirtualAartiSection({ onRingBell }) {
  const [isDiyaLit, setIsDiyaLit] = useState(false);
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteeWish, setDevoteeWish] = useState('');
  const [diyaCount, setDiyaCount] = useState(14820);
  const [showBlessingCard, setShowBlessingCard] = useState(false);

  const handleLightDiya = (e) => {
    e.preventDefault();
    setIsDiyaLit(true);
    setDiyaCount((c) => c + 1);

    // Audio chime
    soundEngine.ringTempleBell(1.0, 1.0);
    setTimeout(() => soundEngine.ringTempleBell(0.8, 1.2), 300);

    // Sacred golden flower petals confetti burst
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FFFFFF', '#D4AF37'],
      });
    } catch {}

    setShowBlessingCard(true);
  };

  const handleOfferFlowers = () => {
    soundEngine.ringTempleBell(0.5, 1.4);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF69B4', '#FFD700', '#FF7A00'],
      });
    } catch {}
  };

  return (
    <section id="virtual-aarti" className="relative py-36 sm:py-44 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-cinzel text-xs tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 text-sacred-saffron" />
            <span>SACRED DHYANA & VIRTUAL ARPANAM</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-3">
            Light a Virtual Diya & Offer Prayers
          </h2>

          <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/80 leading-relaxed">
            No matter where you are in the world, offer your heartfelt reverence to Shree Baba Sidhnath Ji. Kindle the sacred jyoti, offer fresh marigold petals, and receive divine blessings.
          </p>

          {/* Diya Counter Badge */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-cinzel text-gold-300/80 px-4 py-1.5 rounded-full bg-navy-900/80 border border-gold-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{diyaCount.toLocaleString()} Sacred Diyas Kindled by Devotees</span>
          </div>
        </div>

        {/* Master Offering Altar Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center glass-panel-gold rounded-3xl p-6 sm:p-10 border border-gold-500/40 relative shadow-2xl">
          {/* Altar Visualization (Left Side) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 text-center">
            {/* 3D-feeling Interactive Diya Lamp Graphic */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Flame Glow Radial Aura */}
              <div
                className={`absolute w-36 h-36 rounded-full transition-all duration-700 pointer-events-none ${
                  isDiyaLit
                    ? 'bg-sacred-amber/30 blur-2xl scale-125 animate-pulse'
                    : 'bg-sacred-amber/5 blur-xl scale-75'
                }`}
              />

              {/* Flame Animation */}
              <AnimatePresence>
                {isDiyaLit && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-4 w-12 h-20 origin-bottom"
                  >
                    <motion.div
                      animate={{
                        scaleY: [1, 1.15, 0.95, 1.1],
                        scaleX: [1, 0.9, 1.05, 0.95],
                        rotate: [-2, 3, -2],
                      }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                      className="w-full h-full bg-gradient-to-t from-sacred-flame via-sacred-amber to-gold-200 rounded-full blur-[1px] shadow-[0_0_25px_#FF7A00]"
                      style={{ clipPath: 'polygon(50% 0%, 90% 60%, 75% 100%, 25% 100%, 10% 60%)' }}
                    />
                    {/* Inner White-Gold Core */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-8 bg-white rounded-full blur-[0.5px]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Brass Diya Vessel SVG */}
              <svg viewBox="0 0 200 120" className="w-44 h-28 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                {/* Diya Base */}
                <ellipse cx="100" cy="95" rx="50" ry="12" fill="#B38F24" />
                <path
                  d="M30 65 Q100 110 170 65 Q150 45 100 50 Q50 45 30 65 Z"
                  fill="url(#diyaGoldGradient)"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <ellipse cx="100" cy="55" rx="60" ry="14" fill="#6E520D" />
                <ellipse cx="100" cy="56" rx="54" ry="10" fill={isDiyaLit ? "#FF9E2C" : "#4A370A"} />
                {/* Diya Wick Peak */}
                <path d="M100 48 L100 56" stroke={isDiyaLit ? "#FFFFFF" : "#1A1A1A"} strokeWidth="4" strokeLinecap="round" />

                <defs>
                  <linearGradient id="diyaGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0C2" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#6E520D" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Quick Ritual Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handleOfferFlowers}
                className="px-3.5 py-1.5 rounded-full bg-navy-900 border border-gold-500/30 text-gold-300 font-cinzel text-xs hover:bg-gold-500/10 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-sacred-amber" />
                <span>Offer Petals</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.ringTempleBell(1.0, 1.0);
                  if (onRingBell) onRingBell();
                }}
                className="px-3.5 py-1.5 rounded-full bg-navy-900 border border-gold-500/30 text-gold-300 font-cinzel text-xs hover:bg-gold-500/10 transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-gold-400" />
                <span>Ring Ghanta</span>
              </button>
            </div>
          </div>

          {/* Form & Devotional Sankalpa Input (Right Side) */}
          <div className="md:col-span-7">
            <form onSubmit={handleLightDiya} className="space-y-4">
              <div>
                <label className="block font-cinzel text-xs text-gold-300 tracking-wider uppercase mb-1.5">
                  Devotee Name (भक्त का नाम)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name or family gotra..."
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950/80 border border-gold-500/30 text-sacred-ivory placeholder-sacred-ivory/40 focus:outline-none focus:border-gold-400 font-marcellus text-sm"
                />
              </div>

              <div>
                <label className="block font-cinzel text-xs text-gold-300 tracking-wider uppercase mb-1.5">
                  Devotional Prayer / Sankalpa (मनोकामना / प्रार्थना)
                </label>
                <textarea
                  rows="3"
                  placeholder="Prayers for family health, peace, auspicious beginnings, or world harmony..."
                  value={devoteeWish}
                  onChange={(e) => setDevoteeWish(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950/80 border border-gold-500/30 text-sacred-ivory placeholder-sacred-ivory/40 focus:outline-none focus:border-gold-400 font-marcellus text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 via-sacred-amber to-sacred-flame text-navy-950 font-cinzel font-bold text-xs sm:text-sm tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 uppercase"
              >
                <Flame className="w-4 h-4 fill-navy-950" />
                <span>KINDLE DIVINE JYOTI & OFFER SANKALPA</span>
              </button>
            </form>
          </div>
        </div>

        {/* Divine Blessing Card Modal */}
        <AnimatePresence>
          {showBlessingCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowBlessingCard(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-lg w-full parchment-card rounded-3xl p-8 sm:p-10 border border-gold-400 text-center shadow-[0_0_50px_rgba(212,175,55,0.4)]"
              >
                <div className="ornate-corner-tl" />
                <div className="ornate-corner-tr" />
                <div className="ornate-corner-bl" />
                <div className="ornate-corner-br" />

                <div className="w-16 h-16 rounded-full bg-gold-500/20 border-2 border-gold-400 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_#FFD700]">
                  <Sparkles className="w-8 h-8 text-gold-400 animate-spin-slow" />
                </div>

                <span className="font-sanskrit text-lg text-gold-300 block mb-1">
                  ॐ सिद्धनाथाय नमः
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient mb-2">
                  Divine Blessing Bestowed
                </h3>

                <p className="font-marcellus text-sm text-sacred-ivory/90 leading-relaxed mb-4">
                  May Shree Baba Sidhnath Ji shower boundless peace, radiant health, and auspicious prosperity upon <strong>{devoteeName || 'Devotee'}</strong> and their family.
                </p>

                {devoteeWish && (
                  <div className="p-3 rounded-xl bg-navy-950/70 border border-gold-500/20 italic font-marcellus text-xs text-gold-200/90 mb-6">
                    "{devoteeWish}"
                  </div>
                )}

                <p className="font-cinzel text-xs text-sacred-amber tracking-widest uppercase mb-6">
                  "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                </p>

                <button
                  onClick={() => setShowBlessingCard(false)}
                  className="px-8 py-2.5 rounded-full bg-gold-500 text-navy-950 font-cinzel text-xs font-bold tracking-widest hover:brightness-110 transition-all"
                >
                   स्वीकार करें (RECEIVE ASHIRWAD)
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
