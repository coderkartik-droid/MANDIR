import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, X, Eye, Layers } from 'lucide-react';
import { galleryItems as defaultGalleryItems } from '../data/templeData';
import { getList } from '../utils/contentLoader';
import { subscribe as subscribeToContent, getVersion as getContentVersion } from '../utils/contentStore';
import { soundEngine } from '../utils/audioEngine';
import LazyImage from '../components/LazyImage';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');
  const [galleryItems, setGalleryItems] = useState(defaultGalleryItems);
  const contentVersion = useSyncExternalStore(subscribeToContent, getContentVersion);

  useEffect(() => {
    const cmsGallery = getList('gallery');
    if (cmsGallery.length > 0) {
      // Ensure every item has a numeric id (use order as fallback)
      setGalleryItems(
        cmsGallery.map((item, idx) => ({
          ...item,
          id: item.id ?? item.order ?? idx + 1,
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
        }))
      );
    }
  }, [contentVersion]);

  const categories = ['All', 'Architecture', 'Sacred Nature', 'Heritage'];

  const filteredItems = filter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  return (
    <section id="gallery" className="relative py-36 sm:py-44 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-cinzel text-xs tracking-widest mb-3">
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            <span>AUTHENTIC TEMPLE ARCHIVE</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient tracking-wide mb-3">
            Sacred Darshan Gallery
          </h2>

          <p className="font-marcellus text-sm sm:text-base text-sacred-ivory/80 leading-relaxed">
            Experience the divine visual heritage captured directly at Ashram Jhadheena. Each frame reveals architectural majesty, centuries of sacred nature, and serene silence.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                soundEngine.ringTempleBell(0.2, 1.3);
              }}
              className={`px-5 py-2 rounded-full font-cinzel text-xs tracking-wider transition-all ${
                filter === cat
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-navy-900/60 border border-gold-500/20 text-sacred-ivory/70 hover:text-gold-300 hover:border-gold-400/40'
              }`}
            >
              {cat === 'All' ? 'All Sacred Frames' : cat}
            </button>
          ))}
        </div>

        {/* 3D Floating Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-gold-500/30 hover:border-gold-400/80 transition-all duration-500 shadow-2xl hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] flex flex-col"
              >
                {/* Image Container with 3D Depth & Hover Zoom */}
                <div
                  className="relative h-80 sm:h-96 w-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedImage(item);
                    soundEngine.ringTempleBell(0.4, 1.15);
                  }}
                >
                  <LazyImage
                    src={item.src}
                    alt={item.title}
                    aspectRatio={item.aspect}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out filter brightness-95 group-hover:brightness-105"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-gold-400/40 font-cinzel text-[10px] tracking-widest text-gold-300 uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Floating Action Button */}
                  <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-3 rounded-full bg-gold-500 text-navy-950 shadow-[0_0_15px_#FFD700] flex items-center justify-center">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-6 bg-navy-950/50 backdrop-blur-md border-t border-gold-500/20 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="font-marcellus text-xs text-sacred-amber tracking-wider block mb-1">
                      {item.subTitle}
                    </span>
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-ivory group-hover:text-gold-300 transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="font-marcellus text-xs sm:text-sm text-sacred-ivory/70 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Feature Highlights Pills */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {item.highlights.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-marcellus px-2.5 py-0.5 rounded-full bg-navy-900 border border-gold-500/20 text-gold-300/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-navy-900/80 border border-gold-500/40 text-gold-300 hover:text-white transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Lightbox Content Container */}
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
              >
                <div className="relative rounded-2xl overflow-hidden border border-gold-500/50 shadow-[0_0_60px_rgba(212,175,55,0.3)] max-h-[70vh]">
                  <LazyImage
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    priority
                    className="w-full h-full object-contain max-h-[70vh]"
                  />
                </div>

                {/* Description below image */}
                <div className="mt-4 text-center max-w-2xl px-4">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                    {selectedImage.title}
                  </h3>
                  <p className="font-marcellus text-sm text-sacred-ivory/80 mt-1">
                    {selectedImage.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
