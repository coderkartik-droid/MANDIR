import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, Shield, Compass } from 'lucide-react';

/**
 * Dedicated 360° Shivling Darshan & Pradakshina Section
 * Spans 260vh of scroll height so devotees have ample time to admire
 * the black stone Shivling, protective Naag Devta, and drop-by-drop milk Jalabhishek.
 * Uses spacious, ethereal typography that never obscures the 3D background.
 */
export default function ShivlingSection({ scrollProgress = 0 }) {
  // Map overall scroll progress [0.22, 0.65] to local circumambulation angle
  const minP = 0.22;
  const maxP = 0.65;
  const rawRatio = (scrollProgress - minP) / (maxP - minP);
  const orbitRatio = Math.max(0, Math.min(1, rawRatio));
  const currentAngle = Math.round(orbitRatio * 360);

  // Ethereal milestones corresponding to orbit angles
  const milestones = [
    {
      range: [0, 90],
      sanskrit: "ॐ नमः शिवाय",
      title: "The Sanctum Sanctorum (गर्भगृह)",
      desc: "Entering into the divine presence of the Krishna Shila Shivling adorned with sacred Tripundra bhasma.",
      icon: <Sparkles className="w-4 h-4 text-gold-400" />,
      angleLabel: "Frontal Darshan",
    },
    {
      range: [90, 180],
      sanskrit: "नागेन्द्रहाराय त्रिलोचनाय",
      title: "Guardian Naag Devta (नाग देवता)",
      desc: "Revering the divine golden cobra wrapping serenely around the Lingam, hood opened in maternal protection.",
      icon: <Shield className="w-4 h-4 text-sacred-amber" />,
      angleLabel: "Eastern Profile",
    },
    {
      range: [180, 270],
      sanskrit: "क्षीराभिषेकोत्सव",
      title: "Continuous Jalabhishek (क्षीराभिषेक)",
      desc: "Pure milk falling drop-by-drop from the suspended brass urn, creating sacred ripples upon impact.",
      icon: <Droplets className="w-4 h-4 text-blue-300" />,
      angleLabel: "Rear & God Rays",
    },
    {
      range: [270, 360],
      sanskrit: "प्रदक्षिणा पूर्ण",
      title: "Sacred Pradakshina Complete",
      desc: "Full 360° holy circumambulation finished. Peace, grace, and eternal stillness absorb into the soul.",
      icon: <Compass className="w-4 h-4 text-gold-300" />,
      angleLabel: "Gomukhi Spout",
    },
  ];

  const activeMilestone =
    milestones.find((m) => currentAngle >= m.range[0] && currentAngle <= m.range[1]) ||
    milestones[0];

  return (
    <section
      id="shivling-darshan"
      className="relative w-full min-h-[260vh] pointer-events-none select-none"
    >
      {/* Pinned Viewport Overlay (Sticky Fullscreen Frame) */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 pointer-events-none z-10">
        {/* Top Header Badge */}
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto pt-16 sm:pt-20">
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-navy-950/40 border border-gold-500/30 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-cinzel text-xs font-bold text-gold-300 tracking-widest uppercase">
              360° Holy Pradakshina (पवित्र प्रदक्षिणा)
            </span>
          </div>

          {/* Real-time Circumambulation Compass Dial */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-navy-950/40 border border-gold-500/30 backdrop-blur-md shadow-lg text-xs font-cinzel text-gold-200">
            <Compass className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
            <span>{currentAngle}° • {activeMilestone.angleLabel}</span>
          </div>
        </div>

        {/* Center Area Remains 100% Completely Transparent & Clear to admire the 3D Shivling! */}
        <div className="my-auto pointer-events-none" />

        {/* Bottom Ethereal Annotation Bar (Slim, transparent, never blocking the Lingam) */}
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="px-6 py-4 rounded-2xl bg-navy-950/45 backdrop-blur-xl border border-gold-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-center relative overflow-hidden"
            >
              {/* Subtle top golden accent shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

              <div className="flex items-center justify-center gap-2 text-xs font-sanskrit text-gold-300 mb-1">
                {activeMilestone.icon}
                <span>{activeMilestone.sanskrit}</span>
              </div>

              <h3 className="font-cinzel text-base sm:text-lg font-bold text-gold-gradient tracking-wide">
                {activeMilestone.title}
              </h3>

              <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/80 max-w-xl mx-auto mt-1 leading-relaxed">
                {activeMilestone.desc}
              </p>

              {/* Progress Bar indicating Pradakshina Completion */}
              <div className="mt-3 max-w-xs mx-auto w-full h-1 bg-navy-900 rounded-full overflow-hidden border border-gold-500/20">
                <div
                  className="h-full bg-gradient-to-r from-sacred-saffron via-gold-400 to-emerald-400 transition-all duration-150"
                  style={{ width: `${Math.round(orbitRatio * 100)}%` }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
