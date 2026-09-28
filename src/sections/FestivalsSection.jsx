import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, ChevronRight, Moon, Flame, Heart, Shield } from 'lucide-react';
import { festivalList } from '../data/templeData';
import { soundEngine } from '../utils/audioEngine';

export default function FestivalsSection() {
  const [selectedFestival, setSelectedFestival] = useState(festivalList[0]);

  return (
    <section id="festivals" className="relative py-36 sm:py-44 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-cinzel text-xs tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>SACRED CELEBRATIONS & MAHA PUJAS</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-3">
            Festivals & Holy Observances
          </h2>

          <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/80 leading-relaxed">
            Witness the divine fervor that illuminates Ashram Jhadheena during our sacred annual festivals. Vedic chants echo, sacred havans burn with fragrant ghee, and thousands partake in divine prasad.
          </p>
        </div>

        {/* Interactive Festival Layout (Split Cards & Deep Detail Stage) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Festival Selection Cards (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            {festivalList.map((fest) => {
              const isSelected = selectedFestival.id === fest.id;

              return (
                <div
                  key={fest.id}
                  onClick={() => {
                    setSelectedFestival(fest);
                    soundEngine.ringTempleBell(0.35, 1.25);
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group backdrop-blur-md ${
                    isSelected
                      ? 'bg-navy-950/60 border-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                      : 'bg-navy-950/35 border-gold-500/20 hover:border-gold-500/50 hover:bg-navy-950/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sanskrit text-sm text-gold-400">
                      {fest.hindi}
                    </span>
                    <span className="text-[11px] font-cinzel text-sacred-amber px-2.5 py-0.5 rounded-full bg-sacred-amber/10 border border-sacred-amber/30">
                      {fest.month}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-ivory group-hover:text-gold-300 transition-colors">
                    {fest.name}
                  </h3>

                  <p className="font-marcellus text-xs text-sacred-ivory/70 mt-1">
                    {fest.tag}
                  </p>

                  {/* Active Indicator Arrow */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-festival-pill"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center font-bold"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Festival Deep Detail Stage (Right Column) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFestival.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="parchment-card rounded-2xl p-8 sm:p-10 border border-gold-500/40 relative shadow-2xl"
              >
                <div className="ornate-corner-tl" />
                <div className="ornate-corner-tr" />
                <div className="ornate-corner-bl" />
                <div className="ornate-corner-br" />

                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sacred-saffron/15 border border-sacred-saffron/40 text-sacred-saffron text-xs font-cinzel uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedFestival.tag}</span>
                </div>

                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient mb-2">
                  {selectedFestival.name}
                </h3>
                <h4 className="font-sanskrit text-lg text-gold-400 mb-6">
                  {selectedFestival.hindi} ({selectedFestival.month})
                </h4>

                <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/90 leading-relaxed mb-8">
                  {selectedFestival.description}
                </p>

                {/* Rituals & Sacred Ceremonies Grid */}
                <div className="mb-8">
                  <h5 className="font-cinzel text-xs text-gold-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-sacred-saffron" />
                    <span>Consecrated Rituals & Observances</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedFestival.rituals.map((ritual, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-navy-900/80 border border-gold-500/20 flex items-center gap-3 text-xs sm:text-sm font-marcellus text-sacred-ivory/90"
                      >
                        <div className="w-2 h-2 rounded-full bg-sacred-saffron shadow-[0_0_8px_#FF7A00]" />
                        <span>{ritual}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Join Ceremony */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/10 via-sacred-saffron/10 to-transparent border border-gold-500/30 flex items-center justify-between">
                  <div>
                    <p className="font-cinzel text-xs text-gold-300 font-bold">
                      Planning to Attend?
                    </p>
                    <p className="font-marcellus text-xs text-sacred-ivory/70">
                      Special accommodation and free Mahaprasad arrangements are provided for all yatris.
                    </p>
                  </div>
                  <a
                    href="#visit"
                    className="shrink-0 px-4 py-2 rounded-lg bg-gold-500 text-navy-950 font-cinzel text-xs font-bold hover:brightness-110 transition-all"
                  >
                    VISIT INFO
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
