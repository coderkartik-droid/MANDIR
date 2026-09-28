import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import TempleCanvas from './three/TempleCanvas';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import EntranceHUD from './components/EntranceHUD';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';

import HeroSection from './sections/HeroSection';
import ShivlingSection from './sections/ShivlingSection';
import Pseudo360Section from './sections/Pseudo360Section';
import StorySection from './sections/StorySection';
import GallerySection from './sections/GallerySection';
import FestivalsSection from './sections/FestivalsSection';
import VirtualAartiSection from './sections/VirtualAartiSection';
import VisitSection from './sections/VisitSection';

import { useTempleEntrance } from './hooks/useTempleEntrance';
import { soundEngine } from './utils/audioEngine';
import { Bell } from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeMode, setTimeMode] = useState('evening');
  const [isRain, setIsRain] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [bellRungCount, setBellRungCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Synchronized 5-Phase Temple Entrance Orchestrator
  const {
    isPlayingSequence,
    entrancePhase,
    entranceProgress,
    startCinematicEntrance,
    cancelCinematicEntrance,
  } = useTempleEntrance();

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Ambient Audio Toggle (from Navbar)
  const toggleAudio = () => {
    const active = soundEngine.toggleAmbient();
    setIsAudioPlaying(active);
  };

  // Rain Mode Toggle
  const toggleRain = () => {
    setIsRain((prev) => {
      const next = !prev;
      if (next) {
        soundEngine.startRainSound();
      } else {
        soundEngine.stopRainSound();
      }
      return next;
    });
  };

  // Time Mode Change
  const handleTimeModeChange = (mode) => {
    setTimeMode(mode);
    soundEngine.setTimeMode(mode);
  };

  // Master Bell Ring Trigger
  const handleRingBell = () => {
    soundEngine.ringTempleBell(1.0, 1.0);
    setBellRungCount((c) => c + 1);
  };

  return (
    <div className="relative min-h-screen bg-navy-950 text-sacred-ivory font-sans selection:bg-gold-500 selection:text-navy-950">
      {/* Custom Sacred Golden Cursor */}
      <CustomCursor />

      {/* Cinematic Silhouette Loading Screen */}
      <LoadingScreen onLoaded={() => setIsLoaded(true)} />

      {/* Synchronized 5-Phase Cinematic Entrance HUD */}
      <EntranceHUD
        isActive={isPlayingSequence}
        currentPhase={entrancePhase}
        progress={entranceProgress}
        onCancel={cancelCinematicEntrance}
      />

      {/* Scroll Progress Indicator Bar */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-sacred-saffron via-gold-400 to-sacred-amber z-[100] shadow-[0_0_8px_#D4AF37]"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Persistent 3D Temple Canvas (World-class full-screen WebGL viewport) */}
      <TempleCanvas
        timeMode={timeMode}
        isRain={isRain}
        scrollProgress={scrollProgress}
        entranceProgress={entranceProgress}
        onRingBell={handleRingBell}
      />

      {/* Fixed Luxury Navigation Bar */}
      <Navbar
        isAudioPlaying={isAudioPlaying}
        toggleAudio={toggleAudio}
        isRain={isRain}
        toggleRain={toggleRain}
        timeMode={timeMode}
        setTimeMode={handleTimeModeChange}
        onRingBell={handleRingBell}
        onEnterTemple={startCinematicEntrance}
      />

      {/* Foreground Spiritual Content Layer */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          onRingBell={handleRingBell}
          onEnterTemple={startCinematicEntrance}
          bellRungCount={bellRungCount}
          isAudioPlaying={isAudioPlaying}
          toggleAudio={toggleAudio}
          isRain={isRain}
          toggleRain={toggleRain}
          timeMode={timeMode}
          setTimeMode={handleTimeModeChange}
        />

        {/* Dedicated 360° Shivling Darshan & Sacred Circumambulation (Pradakshina) */}
        <ShivlingSection scrollProgress={scrollProgress} />

        {/* Pseudo 360° Ashram Darshan */}
        <Pseudo360Section />

        {/* Story & Historical Chronicles */}
        <StorySection />

        {/* Sacred Photo Gallery */}
        <GallerySection />

        {/* Annual Holy Festivals */}
        <FestivalsSection />

        {/* Virtual Aarti & Diya Offering */}
        <VirtualAartiSection onRingBell={handleRingBell} />

        {/* Visit & Pilgrimage Guide */}
        <VisitSection />
      </main>

      {/* Floating Glassmorphism Devotional Audio Player */}
      <AudioPlayer isEntering={isPlayingSequence} />

      {/* Persistent Quick Floating Bell Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleRingBell}
          title="Ring Sacred Bell (घण्टानाद)"
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-gold-600 to-sacred-amber border-2 border-gold-300 text-navy-950 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all"
        >
          {/* Subtle Ring Ripple Wave */}
          <div className="absolute inset-0 rounded-full border-2 border-gold-400 animate-ping opacity-40 pointer-events-none" />
          <Bell className="w-6 h-6 text-navy-950 group-hover:rotate-12 transition-transform" />
          {bellRungCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-navy-950 border border-gold-400 text-gold-300 text-[10px] font-bold font-sans shadow-md">
              {bellRungCount}
            </span>
          )}
        </button>
      </div>

      {/* Luxury Spiritual Footer */}
      <Footer onRingBell={handleRingBell} />
    </div>
  );
}
