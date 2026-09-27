import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { soundEngine } from '../utils/audioEngine';
import { devotionalPlaylist } from '../data/playlistData';

/**
 * Divine Temple Entrance Sequence Orchestrator
 * Coordinates the 5 distinct synchronized phases:
 * Phase 1 – Sacred Silence (approach & subtle shimmer)
 * Phase 2 – Gate Opening (heavy stone/brass physics & light pour)
 * Phase 3 – Temple Bell Resonance (3 timed strikes, camera vibration, soundwaves)
 * Phase 4 – Divine Atmosphere (conch shell, 3-5s fade-in of devotional track)
 * Phase 5 – Camera Passing Through (gliding beneath bell onto marble mandapa)
 */
export function useTempleEntrance() {
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [entrancePhase, setEntrancePhase] = useState(0); // 0 = idle, 1..5
  const [entranceProgress, setEntranceProgress] = useState(0); // [0, 1]
  const timelineRef = useRef(null);

  const startCinematicEntrance = useCallback(() => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    setEntrancePhase(1);

    soundEngine.init();

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const stateObj = { progress: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsPlayingSequence(false);
        setEntrancePhase(0);
        // Scroll smoothly to pseudo 360 section once arrived
        const darshanSection = document.getElementById('panoramic-darshan');
        if (darshanSection) {
          darshanSection.scrollIntoView({ behavior: 'smooth' });
        }
      },
    });

    timelineRef.current = tl;

    // ================= PHASE 1: SACRED SILENCE (0.0s - 2.5s) =================
    // Camera slowly approaches the gate; gentle breeze
    tl.to(stateObj, {
      progress: 0.12,
      duration: 2.5,
      ease: 'power1.out',
      onStart: () => {
        setEntrancePhase(1);
      },
      onUpdate: () => {
        setEntranceProgress(stateObj.progress);
      },
    });

    // ================= PHASE 2: GATE OPENING (2.5s - 5.5s) =================
    // Heavy ancient doors creak open; golden dust bursts from seam
    tl.to(stateObj, {
      progress: 0.38,
      duration: 3.0,
      ease: 'power2.inOut',
      onStart: () => {
        setEntrancePhase(2);
        soundEngine.playGateOpeningSound();
      },
      onUpdate: () => {
        setEntranceProgress(stateObj.progress);
      },
    });

    // ================= PHASE 3: TEMPLE BELL STRIKES (3.2s - 6.0s) =================
    // Staggered bell strikes synchronized with gate swing
    tl.call(() => {
      setEntrancePhase(3);
      // Bell Strike 1 (Powerful fundamental)
      soundEngine.ringTempleBell(1.0, 1.0);
    }, null, 3.2);

    tl.call(() => {
      // Bell Strike 2 (Slight rebound harmonic)
      soundEngine.ringTempleBell(0.85, 1.02);
    }, null, 4.4);

    tl.call(() => {
      // Bell Strike 3 (Pure golden decay)
      soundEngine.ringTempleBell(0.7, 0.98);
    }, null, 5.6);

    // ================= PHASE 4: BELL FINISHES -> DEVOTIONAL MUSIC 4s FADE-IN (5.8s) =================
    // Exactly when bell sequence finishes:
    // 1. Resonate sacred Conch Shell (Shankhadhwani)
    // 2. Smoothly start devotional background music with 3.5s - 4.5s fade-in!
    tl.call(() => {
      setEntrancePhase(4);
      soundEngine.playShankh(0.9, 4.2);

      // Start current devotional track with 4s graceful fade-in
      const targetTrack = soundEngine.currentTrack || devotionalPlaylist[0];
      soundEngine.fadeInAfterEntrance(4.0);
      soundEngine.playTrack(targetTrack, 4.0);
    }, null, 5.8);

    // ================= PHASE 5: CAMERA PASS-THROUGH (6.5s - 10.5s) =================
    // Camera glides smoothly beneath bell, passing through gates into marble mandapa
    tl.to(stateObj, {
      progress: 0.85,
      duration: 4.0,
      ease: 'power2.out',
      onStart: () => {
        setEntrancePhase(5);
      },
      onUpdate: () => {
        setEntranceProgress(stateObj.progress);
      },
    }, 6.5);

    // Final subtle drift settling into the ashram
    tl.to(stateObj, {
      progress: 1.0,
      duration: 1.5,
      ease: 'power1.inOut',
      onUpdate: () => {
        setEntranceProgress(stateObj.progress);
      },
    }, 10.5);

  }, [isPlayingSequence]);

  const cancelCinematicEntrance = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    setIsPlayingSequence(false);
    setEntrancePhase(0);
    setEntranceProgress(0);
  }, []);

  return {
    isPlayingSequence,
    entrancePhase,
    entranceProgress,
    startCinematicEntrance,
    cancelCinematicEntrance,
  };
}
