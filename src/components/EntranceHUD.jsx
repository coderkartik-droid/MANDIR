import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bell, Wind, Compass, Volume2, X } from 'lucide-react';

export default function EntranceHUD({
  isActive,
  currentPhase,
  progress,
  onCancel,
}) {
  const phaseTitles = {
    1: {
      en: "Phase 1: Sacred Silence",
      hi: "पवित्र मौन • Sacred stillness before the gates",
      icon: <Wind className="w-4 h-4 text-gold-300" />,
    },
    2: {
      en: "Phase 2: The Temple Gates Part",
      hi: "कपाट उद्घाटन • Ancient gates opening with heavy grace",
      icon: <Sparkles className="w-4 h-4 text-gold-400" />,
    },
    3: {
      en: "Phase 3: The Sacred Bell Resonates",
      hi: "घण्टानाद • Damped harmonic bell strikes & golden soundwaves",
      icon: <Bell className="w-4 h-4 text-sacred-amber animate-bell-sway" />,
    },
    4: {
      en: "Phase 4: Shankhadhwani & Instrumental Symphony",
      hi: "शंखनाद एवं दिव्य संगीत • Bansuri, Santoor & Tanpura in Key of C#",
      icon: <Volume2 className="w-4 h-4 text-sacred-saffron" />,
    },
    5: {
      en: "Phase 5: Sacred Shivling Reveal & Orbit",
      hi: "दिव्य शिवलिंग दर्शन • Continuous Milk Jalabhishek & Naag Devta",
      icon: <Sparkles className="w-4 h-4 text-gold-200" />,
    },
  };

  const current = phaseTitles[currentPhase] || phaseTitles[1];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between"
        >
          {/* Top Cinema Letterbox Bar */}
          <div className="w-full h-10 sm:h-14 bg-black/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-gold-500/20 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse shadow-[0_0_10px_#FFD700]" />
              <span className="font-cinzel text-xs sm:text-sm font-bold text-gold-gradient tracking-widest uppercase">
                Cinematic Entrance & Shivling Reveal
              </span>
            </div>

            {/* Skip Button */}
            <button
              onClick={onCancel}
              className="px-3 py-1 rounded-full bg-navy-900 border border-gold-500/30 text-sacred-ivory/70 hover:text-white font-cinzel text-[11px] flex items-center gap-1.5 transition-colors"
            >
              <span>Skip Walkthrough</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Dynamic Phase Toast Banner */}
          <div className="mx-auto my-auto pointer-events-none">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="px-6 py-3.5 rounded-2xl glass-panel-dark border border-gold-400/50 shadow-[0_0_35px_rgba(212,175,55,0.35)] flex items-center gap-3.5 text-center max-w-md mx-4"
            >
              <div className="p-2 rounded-xl bg-gold-500/20 border border-gold-400/40">
                {current.icon}
              </div>
              <div className="text-left">
                <span className="font-cinzel text-xs sm:text-sm font-bold text-gold-300 block">
                  {current.en}
                </span>
                <span className="font-marcellus text-[11px] sm:text-xs text-sacred-ivory/80">
                  {current.hi}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Cinema Letterbox Bar with Progress Meter */}
          <div className="w-full h-10 sm:h-14 bg-black/90 backdrop-blur-md flex flex-col justify-center px-6 border-t border-gold-500/20 pointer-events-auto">
            <div className="max-w-xl mx-auto w-full flex items-center gap-3">
              <span className="font-cinzel text-[10px] text-gold-400/80 tracking-widest shrink-0">
                SANCTUARY PROGRESS
              </span>
              <div className="flex-grow h-1 bg-navy-800 rounded-full overflow-hidden border border-gold-500/20">
                <div
                  className="h-full bg-gradient-to-r from-sacred-saffron via-gold-400 to-emerald-400 transition-all duration-100"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="font-cinzel text-[10px] text-gold-300 shrink-0 font-bold">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
