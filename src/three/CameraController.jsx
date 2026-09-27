import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioEngine';

/**
 * Cinematic Camera Controller with Divine Shivling Orbit
 * Transitions smoothly from:
 * 1. Wide frontal view approaching the archway
 * 2. Gliding beneath the suspended bell through open gates
 * 3. Entering the sacred sanctum and beginning a slow, majestic orbit around the Shivling!
 */
export default function CameraController({
  scrollProgress = 0,
  entranceProgress = 0,
}) {
  const currentPos = useRef(new THREE.Vector3(0, 2.6, 9.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.5, 0));
  const trauma = useRef(0);

  // Subscribe to bell strikes for camera vibration
  useEffect(() => {
    const unsub = soundEngine.onBellStrike((force) => {
      trauma.current = Math.min(trauma.current + 0.55 * force, 1.0);
    });
    return unsub;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const pointer = state.pointer;

    // Decay trauma shake
    trauma.current = Math.max(0, trauma.current - dt * 2.6);
    const shakeIntensity = trauma.current * trauma.current * 0.12;
    const shakeX = Math.sin(t * 52) * shakeIntensity;
    const shakeY = Math.cos(t * 46) * shakeIntensity * 0.7;

    // Organic idle sway
    const idleY = Math.sin(t * 0.5) * 0.05;
    const idleX = Math.cos(t * 0.35) * 0.04;

    const effectiveProgress = Math.min(Math.max(scrollProgress, entranceProgress), 1);
    const mouseX = pointer.x * 0.6;
    const mouseY = pointer.y * 0.25;

    // Target positions based on journey phase:
    // Shivling location: [0, 1.35, -4.5]
    const shivlingPos = new THREE.Vector3(0, 1.35, -4.5);

    let targetX, targetY, targetZ;
    let lookX, lookY, lookZ;

    if (effectiveProgress < 0.65) {
      // Approach & Pass Through Gate Phase
      // Linear glide toward and under arch
      const p = effectiveProgress / 0.65; // [0, 1]
      targetZ = THREE.MathUtils.lerp(9.5, -0.8, p);
      targetY = THREE.MathUtils.lerp(2.6, 1.85, p) + idleY + mouseY + shakeY;
      targetX = idleX + mouseX * (1.0 - p * 0.5) + shakeX;

      lookX = mouseX * 0.3;
      lookY = THREE.MathUtils.lerp(2.5, 1.5, p);
      lookZ = THREE.MathUtils.lerp(0, -4.5, p);
    } else {
      // Sanctum Reveal & Slow Majestic Orbit around Shivling
      const orbitBlend = (effectiveProgress - 0.65) / 0.35; // [0, 1]

      // Slow continuous cinematic orbit angle around Shivling
      const orbitSpeed = 0.075;
      const angle = t * orbitSpeed + (1.0 - orbitBlend) * 0.4;
      const orbitRadius = THREE.MathUtils.lerp(3.8, 4.4, Math.sin(t * 0.1) * 0.5 + 0.5);

      const orbitX = shivlingPos.x + Math.sin(angle) * orbitRadius;
      const orbitZ = shivlingPos.z + Math.cos(angle) * orbitRadius;
      const orbitY = shivlingPos.y + 0.45 + Math.sin(t * 0.3) * 0.15;

      // Blend from pass-through position to circular orbit
      targetX = THREE.MathUtils.lerp(-0.3 + idleX, orbitX, orbitBlend) + shakeX + mouseX * 0.2;
      targetY = THREE.MathUtils.lerp(1.85, orbitY, orbitBlend) + shakeY + mouseY * 0.2;
      targetZ = THREE.MathUtils.lerp(-1.0, orbitZ, orbitBlend);

      // Camera looks directly at the heart of the Shivling & Naag Devta
      lookX = THREE.MathUtils.lerp(0, shivlingPos.x, orbitBlend);
      lookY = THREE.MathUtils.lerp(1.5, shivlingPos.y + 0.1, orbitBlend);
      lookZ = THREE.MathUtils.lerp(-4.5, shivlingPos.z, orbitBlend);
    }

    // Award-winning smooth Lerp damping (no sudden cuts)
    const lerpSpeed = 3.2 * dt;
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, lerpSpeed);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, lerpSpeed);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, lerpSpeed);

    currentLookAt.current.x = THREE.MathUtils.lerp(currentLookAt.current.x, lookX, lerpSpeed);
    currentLookAt.current.y = THREE.MathUtils.lerp(currentLookAt.current.y, lookY, lerpSpeed);
    currentLookAt.current.z = THREE.MathUtils.lerp(currentLookAt.current.z, lookZ, lerpSpeed);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
