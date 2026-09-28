import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioEngine';

/**
 * Cinematic Camera Controller with Extended 360° Shivling Circumambulation
 * Orchestrates:
 * 1. Phase 1 (0.00 -> 0.12): Approach the majestic Royal Archway
 * 2. Phase 2 (0.12 -> 0.22): Gate opening, glide beneath swinging bell
 * 3. Phase 3 (0.22 -> 0.65): Extended 360° Holy Pradakshina around the Shivling:
 *    - Frontal darshan of Krishna Shila stone & Tripundra
 *    - Left profile revealing Naag Devta golden coils & ancient tree
 *    - Rear elevated angle through the flared cobra hood with god rays
 *    - Right profile capturing the Gomukhi spout & draining milk
 *    - Completion of circumambulation with elevated frontal three-quarter perspective
 * 4. Phase 4 (0.65 -> 1.00): Gentle pull-back to wide courtyard framing
 */
export default function CameraController({
  scrollProgress = 0,
  entranceProgress = 0,
}) {
  const currentPos = useRef(new THREE.Vector3(0, 2.6, 9.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.5, 0));
  const trauma = useRef(0);

  // Subscribe to bell strikes for physical camera vibration
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
    const shakeIntensity = trauma.current * trauma.current * 0.11;
    const shakeX = Math.sin(t * 52) * shakeIntensity;
    const shakeY = Math.cos(t * 46) * shakeIntensity * 0.7;

    // Organic idle sway
    const idleY = Math.sin(t * 0.45) * 0.04;
    const idleX = Math.cos(t * 0.3) * 0.035;

    // Effective progress: blends scroll with automated entrance
    const p = Math.min(Math.max(scrollProgress, entranceProgress), 1);

    // Mouse parallax factor (gentle, never disruptive)
    const parallaxFactor = Math.max(0.12, 1.0 - p * 0.75);
    const mouseX = pointer.x * 0.45 * parallaxFactor;
    const mouseY = pointer.y * 0.2 * parallaxFactor;

    // Sacred Shivling center position
    const shivlingPos = new THREE.Vector3(0, 1.42, -4.5);

    let targetX, targetY, targetZ;
    let lookX, lookY, lookZ;

    if (p < 0.14) {
      // ================= PHASE 1: FRONT APPROACH TO ARCH =================
      const t1 = p / 0.14; // [0, 1]
      targetZ = THREE.MathUtils.lerp(9.5, 3.2, t1);
      targetY = THREE.MathUtils.lerp(2.6, 2.15, t1) + idleY + mouseY + shakeY;
      targetX = idleX + mouseX * 0.8 + shakeX;

      lookX = mouseX * 0.25;
      lookY = THREE.MathUtils.lerp(2.5, 2.1, t1);
      lookZ = THREE.MathUtils.lerp(0.0, -1.0, t1);
    } else if (p < 0.24) {
      // ================= PHASE 2: PASS BENEATH BELL & GATES =================
      const t2 = (p - 0.14) / 0.10; // [0, 1]
      targetZ = THREE.MathUtils.lerp(3.2, -1.0, t2);
      targetY = THREE.MathUtils.lerp(2.15, 1.75, t2) + idleY + mouseY + shakeY;
      targetX = idleX + mouseX * 0.4 + shakeX;

      lookX = mouseX * 0.2;
      lookY = THREE.MathUtils.lerp(2.1, 1.45, t2);
      lookZ = THREE.MathUtils.lerp(-1.0, -4.5, t2);
    } else if (p < 0.68) {
      // ================= PHASE 3: EXTENDED 360° SHIVLING ORBIT (PRADAKSHINA) =================
      // Normalized orbit progress across this extensive scroll span
      const tOrbit = (p - 0.24) / 0.44; // [0, 1]

      // Cubic smoothstep easing for silky acceleration and deceleration
      const smoothOrbit = tOrbit * tOrbit * (3 - 2 * tOrbit);

      // Full 360° angle + gentle ambient rotation drift so scene is never static
      const ambientDrift = Math.sin(t * 0.12) * 0.05;
      const angle = smoothOrbit * Math.PI * 2 + ambientDrift;

      // Dynamic cinematic radius (widens slightly on profiles, closes in on front/rear)
      const radius = 3.85 + Math.sin(angle * 2) * 0.35;

      // Elevation profile: starts eye-level (1.75), rises higher during rear angle (2.2), returns to 1.9
      const elevation = 1.75 + Math.sin(smoothOrbit * Math.PI) * 0.45 + Math.sin(t * 0.25) * 0.06;

      targetX = shivlingPos.x + Math.sin(angle) * radius + shakeX + mouseX * 0.25;
      targetZ = shivlingPos.z + Math.cos(angle) * radius;
      targetY = elevation + idleY + mouseY * 0.2 + shakeY;

      // Camera focal point tracks the Shivling apex and Naag Devta hood
      lookX = shivlingPos.x + mouseX * 0.1;
      lookY = shivlingPos.y + Math.sin(tOrbit * Math.PI) * 0.15;
      lookZ = shivlingPos.z;
    } else {
      // ================= PHASE 4: SETTLING INTO ASHRAM COURTYARD =================
      const t4 = (p - 0.68) / 0.32; // [0, 1]
      const smoothT4 = t4 * t4 * (3 - 2 * t4);

      // Wide elevated perspective framing the entire sacred precinct
      const finalX = -1.2 + idleX + mouseX * 0.5;
      const finalY = 2.45 + idleY + mouseY * 0.3;
      const finalZ = 1.2;

      // Starting from end of orbit:
      const startOrbitX = shivlingPos.x;
      const startOrbitY = 1.95;
      const startOrbitZ = shivlingPos.z + 3.85;

      targetX = THREE.MathUtils.lerp(startOrbitX, finalX, smoothT4) + shakeX;
      targetY = THREE.MathUtils.lerp(startOrbitY, finalY, smoothT4) + shakeY;
      targetZ = THREE.MathUtils.lerp(startOrbitZ, finalZ, smoothT4);

      lookX = THREE.MathUtils.lerp(0, 0.4, smoothT4);
      lookY = THREE.MathUtils.lerp(1.45, 1.75, smoothT4);
      lookZ = THREE.MathUtils.lerp(-4.5, -6.5, smoothT4);
    }

    // High-precision smooth Lerp damping (no sudden cuts, silky camera motion)
    const lerpSpeed = 2.8 * dt;
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
