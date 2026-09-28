import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Info, Compass, Sparkles, MapPin } from 'lucide-react';
import { pseudo360Hotspots } from '../data/templeData';
import { soundEngine } from '../utils/audioEngine';

export default function Pseudo360Section() {
  const [activeSpot, setActiveSpot] = useState(pseudo360Hotspots[0]);
  const [selectedHotspotInfo, setSelectedHotspotInfo] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = Math.min(Math.max(e.clientX - dragStart.x, -160), 160);
    const newY = Math.min(Math.max(e.clientY - dragStart.y, -80), 80);
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = Math.min(Math.max(e.touches[0].clientX - dragStart.x, -160), 160);
    const newY = Math.min(Math.max(e.touches[0].clientY - dragStart.y, -80), 80);
    setPan({ x: newX, y: newY });
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <section id="panoramic-darshan" className="relative py-36 sm:py-44 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header with Generous Breathing Room */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-950/40 border border-gold-500/25 text-gold-300 font-cinzel text-xs tracking-widest mb-4 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>AUTHENTIC ASHRAM DARSHAN</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-4">
            Pseudo 360° Temple Exploration
          </h2>

          <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/75 leading-relaxed">
            Drag to pan horizontally across the sacred precinct. Touch consecrated markers to reveal architectural traditions.
          </p>
        </div>

        {/* Viewpoint Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {pseudo360Hotspots.map((spot) => {
            const isActive = activeSpot.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => {
                  setActiveSpot(spot);
                  resetView();
                  soundEngine.ringTempleBell(0.3, 1.2);
                }}
                className={`px-4 py-2 rounded-full font-cinzel text-xs tracking-wider transition-all flex items-center gap-2 backdrop-blur-md ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-600 to-sacred-amber text-navy-950 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-navy-950/40 border border-gold-500/20 text-sacred-ivory/70 hover:text-gold-200 hover:border-gold-400/40'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-navy-950' : 'text-gold-400'}`} />
                <span>{spot.title}</span>
              </button>
            );
          })}
        </div>

        {/* Master 360 Viewer Canvas Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[450px] sm:h-[540px] rounded-3xl overflow-hidden border border-gold-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.85)] select-none cursor-grab active:cursor-grabbing bg-navy-950/60 backdrop-blur-sm"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Panoramic Layer */}
          <div
            className="w-full h-full relative will-change-transform transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            }}
          >
            <img
              src={activeSpot.image}
              alt={activeSpot.title}
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105 pointer-events-none"
              draggable="false"
            />

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/30 pointer-events-none" />

            {/* Interactive Hotspot Marker on Photo */}
            <div
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${activeSpot.coords.x}%`, top: `${activeSpot.coords.y}%` }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspotInfo(activeSpot);
                  soundEngine.ringTempleBell(0.6, 1.1);
                }}
                className="group relative flex items-center justify-center p-3"
              >
                <div className="absolute w-12 h-12 rounded-full border-2 border-gold-400 animate-ping opacity-60 pointer-events-none" />
                <div className="relative w-8 h-8 rounded-full bg-gold-500 border-2 border-white shadow-[0_0_20px_#FFD700] flex items-center justify-center text-navy-950 font-bold transition-transform group-hover:scale-125">
                  <Sparkles className="w-4 h-4 text-navy-950" />
                </div>
                <div className="absolute top-10 whitespace-nowrap px-3 py-1 rounded-full bg-navy-950/85 backdrop-blur-md border border-gold-400/50 text-[11px] font-cinzel text-gold-200 tracking-wider shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                  {activeSpot.hindi}
                </div>
              </button>
            </div>
          </div>

          {/* Viewer Floating HUD Controls */}
          <div className="absolute bottom-5 left-5 right-5 z-30 flex items-center justify-between pointer-events-auto">
            {/* Viewpoint Info Badge */}
            <div className="px-4 py-2 rounded-2xl bg-navy-950/75 backdrop-blur-xl border border-gold-500/25 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="font-cinzel text-xs sm:text-sm text-gold-300 font-bold">
                  {activeSpot.title}
                </p>
                <p className="text-[10px] text-sacred-ivory/70 font-marcellus">
                  {activeSpot.hindi}
                </p>
              </div>
            </div>

            {/* Navigation Button Controls */}
            <div className="flex items-center gap-1.5 bg-navy-950/75 backdrop-blur-xl border border-gold-500/25 p-1.5 rounded-2xl shadow-lg">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
                title="Zoom In"
                className="p-2 rounded-xl hover:bg-gold-500/20 text-gold-300 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.9))}
                title="Zoom Out"
                className="p-2 rounded-xl hover:bg-gold-500/20 text-gold-300 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                title="Reset Angle"
                className="p-2 rounded-xl hover:bg-gold-500/20 text-gold-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedHotspotInfo(activeSpot)}
                title="View Architectural Details"
                className="p-2 rounded-xl hover:bg-gold-500/20 text-gold-300 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="p-2 rounded-xl hover:bg-gold-500/20 text-gold-300 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Hotspot Insight Modal Dialog */}
        <AnimatePresence>
          {selectedHotspotInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedHotspotInfo(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-lg w-full bg-navy-950/90 border border-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.3)] text-sacred-ivory backdrop-blur-2xl"
              >
                <div className="ornate-corner-tl" />
                <div className="ornate-corner-tr" />
                <div className="ornate-corner-bl" />
                <div className="ornate-corner-br" />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="font-sanskrit text-gold-400 text-xs">
                      {selectedHotspotInfo.hindi}
                    </span>
                    <h3 className="font-cinzel text-xl font-bold text-gold-gradient">
                      {selectedHotspotInfo.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedHotspotInfo(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-sacred-ivory/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/85 leading-relaxed mb-6">
                  {selectedHotspotInfo.description}
                </p>

                <div className="space-y-2 mb-6">
                  {selectedHotspotInfo.facts.map((fact, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-marcellus text-sacred-ivory/80">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedHotspotInfo(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-sacred-amber text-navy-950 font-cinzel text-xs font-bold tracking-widest hover:brightness-110 transition-all uppercase"
                >
                  CONTINUE EXPLORATION
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
