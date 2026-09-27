import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioEngine';

/**
 * Interactive Ashta-dhatu Brass Temple Bell (Ghanta)
 * Features damped harmonic oscillation physics, clapper movement,
 * and multi-harmonic acoustic bell strike on click.
 */
export default function TempleBell3D({
  position = [0, 2.5, 0],
  scale = 1.0,
  onRing = null,
  interactive = true,
}) {
  const bellGroupRef = useRef();
  const clapperRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Physics state
  const physics = useRef({
    angle: 0,
    velocity: 0,
    clapperAngle: 0,
    clapperVel: 0,
    spring: 38.0,
    damping: 3.2,
    lastRingTime: 0,
  });

  const triggerRing = (force = 1.2) => {
    physics.current.velocity += (Math.random() > 0.5 ? 1 : -1) * (0.8 + force * 0.4);
    physics.current.clapperVel += (Math.random() > 0.5 ? -1 : 1) * 1.5;
    physics.current.lastRingTime = performance.now();

    soundEngine.ringTempleBell(1.0, 0.98 + Math.random() * 0.05);

    if (onRing) {
      onRing();
    }
  };

  useFrame((state, delta) => {
    // Clamp delta to prevent physics explosion on tab switches
    const dt = Math.min(delta, 0.05);
    const p = physics.current;

    // Damped harmonic oscillation for main bell
    const accel = -p.spring * p.angle - p.damping * p.velocity;
    p.velocity += accel * dt;
    p.angle += p.velocity * dt;

    // Clapper physics with slight offset/lag
    const clapperAccel = -p.spring * 1.4 * p.clapperAngle - p.damping * 2.5 * p.clapperVel;
    p.clapperVel += clapperAccel * dt;
    p.clapperAngle += p.clapperVel * dt;

    // Subtle gentle ambient air breeze sway when resting
    const gentleBreeze = Math.sin(state.clock.elapsedTime * 1.2) * 0.015;

    if (bellGroupRef.current) {
      bellGroupRef.current.rotation.z = p.angle + gentleBreeze;
    }
    if (clapperRef.current) {
      clapperRef.current.rotation.z = p.clapperAngle * 0.6;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Hanging Chain / Sacred Mauli Thread & Garland */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 2.4, 8]} />
        <meshStandardMaterial
          color="#8B2500"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative Red & Gold Garland Ring */}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.045, 12, 24]} />
        <meshStandardMaterial color="#FF7A00" roughness={0.5} />
      </mesh>

      {/* Main Bell Body Pivot (Rotates around top ring) */}
      <group
        ref={bellGroupRef}
        position={[0, 0.2, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (interactive) triggerRing(1.5);
        }}
      >
        {/* Top Suspension Loop */}
        <mesh position={[0, 0.16, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.08, 0.025, 16, 24]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.92}
            roughness={0.25}
          />
        </mesh>

        {/* Bell Crown / Cap */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.12, 24]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* Bell Waist (Concave profile) */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.16, 0.38, 0.42, 32]} />
          <meshStandardMaterial
            color={hovered ? "#FFD700" : "#D4AF37"}
            metalness={0.92}
            roughness={0.22}
          />
        </mesh>

        {/* Bell Lip / Sound Rim (Heavier brass resonance ring) */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.38, 0.46, 0.12, 32]} />
          <meshStandardMaterial
            color="#E5B842"
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>

        {/* Ornate Engraved Ring Bands */}
        <mesh position={[0, -0.15, 0]}>
          <torusGeometry args={[0.22, 0.015, 8, 32]} />
          <meshStandardMaterial color="#FFF0C2" metalness={0.98} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <torusGeometry args={[0.40, 0.02, 8, 32]} />
          <meshStandardMaterial color="#FFF0C2" metalness={0.98} roughness={0.15} />
        </mesh>

        {/* Internal Hanging Clapper (Pendulum inside bell) */}
        <group ref={clapperRef} position={[0, 0, 0]}>
          {/* Clapper Stem */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.55, 8]} />
            <meshStandardMaterial color="#66521A" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Clapper Heavy Ball (Striker) */}
          <mesh position={[0, -0.58, 0]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#B38F24" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Pull Rope / Sacred String hanging down for devotees */}
          <mesh position={[0, -1.0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.8, 8]} />
            <meshStandardMaterial color="#C19A6B" roughness={0.8} />
          </mesh>
          {/* Bottom tassel */}
          <mesh position={[0, -1.42, 0]}>
            <coneGeometry args={[0.04, 0.1, 12]} />
            <meshStandardMaterial color="#FF4800" roughness={0.7} />
          </mesh>
        </group>

        {/* Divine Aura when hovered */}
        {hovered && (
          <pointLight
            position={[0, -0.3, 0]}
            color="#FFD700"
            intensity={1.5}
            distance={2}
          />
        )}
      </group>
    </group>
  );
}
