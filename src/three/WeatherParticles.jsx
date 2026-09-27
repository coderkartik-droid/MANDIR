import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Atmospheric Particle Systems
 * - Golden sacred dust & fireflies
 * - Monsoon rainfall streaks (enabled when isRain = true)
 * - Drifting sacred flower petals (Marigold / Rose)
 * - Soaring birds in the sky
 */
export default function WeatherParticles({
  isRain = false,
  timeMode = 'evening',
}) {
  const dustRef = useRef();
  const rainRef = useRef();
  const petalsRef = useRef();
  const birdsRef = useRef();

  // 1. Golden Dust Motes & Fireflies (always active)
  const dustCount = 400;
  const [dustPositions, dustSpeeds] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const spd = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = Math.random() * 12 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32;

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      spd[i * 3 + 1] = 0.2 + Math.random() * 0.4;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return [pos, spd];
  }, [dustCount]);

  // 2. Monsoon Rain Particles
  const rainCount = 1800;
  const rainPositions = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [rainCount]);

  // 3. Floating Flower Petals (Marigold / Saffron)
  const petalCount = 80;
  const [petalPositions, petalRotations] = useMemo(() => {
    const pos = new Float32Array(petalCount * 3);
    const rot = new Float32Array(petalCount * 3);
    for (let i = 0; i < petalCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 14 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24;

      rot[i * 3 + 0] = Math.random() * Math.PI;
      rot[i * 3 + 1] = Math.random() * Math.PI;
      rot[i * 3 + 2] = Math.random() * Math.PI;
    }
    return [pos, rot];
  }, [petalCount]);

  // 4. Soaring Temple Birds
  const birdCount = 6;
  const birdData = useMemo(() => {
    return Array.from({ length: birdCount }, (_, i) => ({
      orbitRadius: 18 + i * 3,
      speed: 0.25 + i * 0.05,
      phase: (i / birdCount) * Math.PI * 2,
      altitude: 12 + (i % 3) * 1.8,
    }));
  }, [birdCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Update Dust Motes
    if (dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        pos[i * 3 + 0] += Math.sin(t * 0.8 + i) * 0.015;
        pos[i * 3 + 1] += dustSpeeds[i * 3 + 1] * dt * 0.6;
        pos[i * 3 + 2] += Math.cos(t * 0.6 + i) * 0.015;

        // Reset if too high
        if (pos[i * 3 + 1] > 13) {
          pos[i * 3 + 1] = 0.3;
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update Rain Streaks
    if (isRain && rainRef.current) {
      const pos = rainRef.current.geometry.attributes.position.array;
      for (let i = 0; i < rainCount; i++) {
        pos[i * 3 + 1] -= dt * 24; // fast downward velocity
        pos[i * 3 + 0] += dt * 2.2; // wind slant

        // Reset to top when hitting ground
        if (pos[i * 3 + 1] < 0) {
          pos[i * 3 + 1] = 18 + Math.random() * 4;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 36;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update Floating Petals
    if (petalsRef.current) {
      const pos = petalsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < petalCount; i++) {
        pos[i * 3 + 1] -= dt * (0.8 + Math.sin(t + i) * 0.2); // gentle flutter drop
        pos[i * 3 + 0] += Math.sin(t * 1.4 + i) * 0.03;
        pos[i * 3 + 2] += Math.cos(t * 1.2 + i) * 0.03;

        if (pos[i * 3 + 1] < 0.1) {
          pos[i * 3 + 1] = 12 + Math.random() * 4;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 20;
        }
      }
      petalsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update Temple Birds
    if (birdsRef.current) {
      birdsRef.current.children.forEach((bird, idx) => {
        const d = birdData[idx];
        const angle = t * d.speed + d.phase;
        bird.position.x = Math.cos(angle) * d.orbitRadius;
        bird.position.z = Math.sin(angle) * d.orbitRadius - 6;
        bird.position.y = d.altitude + Math.sin(t * 1.2 + idx) * 0.6;
        bird.rotation.y = -angle - Math.PI / 2;
        // Wing flapping
        if (bird.children[0] && bird.children[1]) {
          const flap = Math.sin(t * 9 + idx) * 0.4;
          bird.children[0].rotation.z = flap;
          bird.children[1].rotation.z = -flap;
        }
      });
    }
  });

  const dustColor = timeMode === 'night' ? '#FFF5D0' : '#FFD700';

  return (
    <group>
      {/* 1. Golden Dust Motes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={timeMode === 'night' ? 0.09 : 0.07}
          color={dustColor}
          transparent
          opacity={timeMode === 'night' ? 0.85 : 0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Monsoon Rain Particle System */}
      {isRain && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={rainCount}
              array={rainPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.12}
            color="#A8C4E8"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* 3. Sacred Marigold & Rose Petals */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={petalCount}
            array={petalPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#FFAE42"
          transparent
          opacity={0.8}
        />
      </points>

      {/* 4. Temple Birds Soaring in Distance */}
      <group ref={birdsRef}>
        {birdData.map((_, i) => (
          <group key={`bird-${i}`}>
            {/* Left Wing */}
            <mesh position={[-0.15, 0, 0]}>
              <boxGeometry args={[0.25, 0.02, 0.08]} />
              <meshBasicMaterial color="#1A1F2C" />
            </mesh>
            {/* Right Wing */}
            <mesh position={[0.15, 0, 0]}>
              <boxGeometry args={[0.25, 0.02, 0.08]} />
              <meshBasicMaterial color="#1A1F2C" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
