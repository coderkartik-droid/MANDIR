import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Temple Silhouette & Bell Loading Screen
 */
export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            if (onLoaded) onLoaded();
          }, 400);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100000] bg-navy-950 flex flex-col items-center justify-center select-none overflow-hidden px-6"
        >
          {/* Subtle Divine Background Halo */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />

          {/* Golden Arch / Temple Silhouette SVG */}
          <div className="relative mb-8 flex flex-col items-center">
            {/* Swinging Temple Bell Graphic */}
            <motion.div
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="origin-top w-20 h-24 mb-4 flex flex-col items-center"
            >
              {/* Cord */}
              <div className="w-1 h-8 bg-sacred-saffron" />
              {/* Bell Body */}
              <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                <path
                  d="M50 15 C55 15 58 20 60 28 L62 55 C65 65 78 72 82 78 C84 82 82 86 76 86 L24 86 C18 86 16 82 18 78 C22 72 35 65 38 55 L40 28 C42 20 45 15 50 15 Z"
                  fill="#D4AF37"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <circle cx="50" cy="88" r="6" fill="#FF9E2C" />
              </svg>
            </motion.div>

            {/* Sacred Om Symbol with Radiant Glow */}
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-5xl font-cinzel font-bold text-gold-gradient mb-3"
            >
              ॐ
            </motion.div>

            <h1 className="font-cinzel text-xl sm:text-2xl tracking-[0.25em] text-sacred-ivory font-semibold text-center">
              SHREE BABA SIDHNATH MANDIR
            </h1>
            <p className="font-marcellus text-sm tracking-[0.2em] text-gold-400/80 mt-1">
              ASHRAM JHADHEENA
            </p>
          </div>

          {/* Progress Bar with Royal Gold Accents */}
          <div className="w-64 sm:w-80 h-1.5 bg-navy-800 rounded-full overflow-hidden border border-gold-500/30 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-sacred-saffron rounded-full shadow-[0_0_12px_#D4AF37]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Percentage & Sacred Verse */}
          <div className="mt-4 flex flex-col items-center">
            <span className="font-cinzel text-xs tracking-widest text-gold-300">
              ENTERING SANCTUARY • {progress}%
            </span>
            <p className="text-xs text-sacred-ivory/50 font-marcellus mt-2 italic">
              "Peace • Spirituality • Mystery • Divine Energy"
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
