import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioEngine';

/**
 * Soundwave Shockwave Rings & Golden Bell Sparks
 * Renders:
 * 1. Expanding circular golden shockwave rings radiating from the bell on strike
 * 2. Small glowing golden spark particles showering downward from the bell rim
 */
export default function SoundwaveRipples({ bellPosition = [0, 3.3, 0] }) {
  const [rings, setRings] = useState([]);
  const sparkGroupRef = useRef();

  // Sparks buffer
  const maxSparks = 120;
  const sparkData = useRef([]);

  useEffect(() => {
    // Listen for bell strikes from any source
    const unsubscribe = soundEngine.onBellStrike((force) => {
      // Add a new expanding ripple ring
      const newRing = {
        id: Math.random(),
        scale: 0.2,
        opacity: 0.9 * force,
        maxScale: 4.8 * force,
        speed: 3.2,
      };

      setRings((prev) => [...prev.slice(-4), newRing]);

      // Spawn golden sparks falling from bell
      const count = Math.floor(18 * force);
      for (let i = 0; i < count; i++) {
        sparkData.current.push({
          x: bellPosition[0] + (Math.random() - 0.5) * 0.5,
          y: bellPosition[1] - 0.4,
          z: bellPosition[2] + (Math.random() - 0.5) * 0.5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.6 - Math.random() * 1.2,
          vz: (Math.random() - 0.5) * 0.8,
          life: 1.0,
          size: 0.04 + Math.random() * 0.05,
        });
      }
    });

    return unsubscribe;
  }, [bellPosition]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // Update Rings
    setRings((prev) =>
      prev
        .map((r) => ({
          ...r,
          scale: r.scale + r.speed * dt,
          opacity: r.opacity - dt * 0.65,
        }))
        .filter((r) => r.opacity > 0.01 && r.scale < r.maxScale)
    );

    // Update Sparks
    const sparks = sparkData.current;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.z += s.vz * dt;
      s.vy -= dt * 2.0; // gravity
      s.life -= dt * 0.85;

      if (s.life <= 0 || s.y < 0.1) {
        sparks.splice(i, 1);
      }
    }
  });

  return (
    <group position={bellPosition}>
      {/* Expanding Soundwave Shockwave Rings */}
      {rings.map((ring) => (
        <group key={ring.id} rotation={[Math.PI / 2, 0, 0]}>
          <mesh scale={[ring.scale, ring.scale, ring.scale]}>
            <torusGeometry args={[1.0, 0.035, 12, 48]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={ring.opacity}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Secondary Fainter Shockwave Ring */}
          <mesh scale={[ring.scale * 0.85, ring.scale * 0.85, ring.scale * 0.85]}>
            <torusGeometry args={[1.0, 0.02, 12, 48]} />
            <meshBasicMaterial
              color="#FFAE42"
              transparent
              opacity={ring.opacity * 0.6}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Sparks Meshes */}
      {sparkData.current.map((s, idx) => (
        <mesh
          key={idx}
          position={[s.x - bellPosition[0], s.y - bellPosition[1], s.z - bellPosition[2]]}
        >
          <sphereGeometry args={[s.size, 6, 6]} />
          <meshBasicMaterial
            color="#FFF0C2"
            transparent
            opacity={s.life}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
