import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Flame, Clock } from 'lucide-react';
import { timelineEvents } from '../data/templeData';

export default function StorySection() {
  const [activeEvent, setActiveEvent] = useState(0);

  return (
    <section id="history" className="relative py-28 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      {/* Background Spiritual Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-cinzel text-xs tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span>SACRED HERITAGE & TAPASYA TRADITION</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-3">
            Chronicles of Shree Baba Sidhnath
          </h2>

          <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/80 leading-relaxed">
            Ascetic silence, miraculous divine interventions, and centuries of unceasing devotion. Explore the timeless evolution of Ashram Jhadheena from a serene meditation grove to a revered sanctuary.
          </p>
        </div>

        {/* Timeline Desktop & Mobile Layout */}
        <div className="relative">
          {/* Central Golden Spine Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-gold-500/10 via-gold-400/50 to-gold-500/10 shadow-[0_0_10px_rgba(212,175,55,0.3)]" />

          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((evt, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Card */}
                  <div className="w-full md:w-[46%]">
                    <div
                      onClick={() => setActiveEvent(idx)}
                      className={`parchment-card rounded-2xl p-6 sm:p-8 border transition-all duration-300 relative cursor-pointer group ${
                        activeEvent === idx
                          ? 'border-gold-400 shadow-[0_0_30px_rgba(212,175,55,0.25)]'
                          : 'border-gold-500/25 hover:border-gold-400/60'
                      }`}
                    >
                      {/* Ornate Corner Accents */}
                      <div className="ornate-corner-tl" />
                      <div className="ornate-corner-tr" />
                      <div className="ornate-corner-bl" />
                      <div className="ornate-corner-br" />

                      {/* Header Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-cinzel text-xs font-bold text-sacred-saffron tracking-widest uppercase">
                          {evt.era}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gold-300/80 font-cinzel">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{evt.year}</span>
                        </div>
                      </div>

                      {/* Sanskrit Title */}
                      <span className="font-sanskrit text-sm text-gold-400/90 block mb-1">
                        {evt.sanskritTitle}
                      </span>

                      {/* Main Title */}
                      <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient group-hover:text-gold-200 transition-colors mb-3">
                        {evt.title}
                      </h3>

                      {/* Description */}
                      <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/80 leading-relaxed mb-4">
                        {evt.description}
                      </p>

                      {/* Spiritual Significance Box */}
                      <div className="pt-3 border-t border-gold-500/20 flex items-start gap-2 text-xs font-marcellus text-gold-300/90">
                        <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span><strong>Significance:</strong> {evt.significance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Node / Medallion */}
                  <div className="my-4 md:my-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-navy-950 border-2 border-gold-400 flex items-center justify-center shadow-[0_0_15px_#D4AF37] group-hover:scale-110 transition-transform">
                      <Flame className="w-5 h-5 text-sacred-saffron" />
                    </div>
                  </div>

                  {/* Empty side for layout symmetry on desktop */}
                  <div className="hidden md:block md:w-[46%]" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Historical Quote Inscription */}
        <div className="mt-16 p-8 rounded-2xl glass-panel-gold border border-gold-400/40 text-center relative max-w-3xl mx-auto shadow-2xl">
          <p className="font-sanskrit text-xl sm:text-2xl text-gold-300 mb-2">
            "तपः स्वाध्यायेश्वरोपनिधानानि क्रियायोगः"
          </p>
          <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/80 italic">
            "Austerity, self-reflection, and total surrender to the Supreme Divine constitute the sacred path of the Siddhas."
          </p>
          <p className="font-cinzel text-xs text-gold-400 tracking-widest mt-3 uppercase">
            — Parampara Tradition of Ashram Jhadheena
          </p>
        </div>
      </div>
    </section>
  );
}
