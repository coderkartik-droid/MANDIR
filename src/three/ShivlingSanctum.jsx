import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Divine 3D Shivling with Sacred Naag Devta & Drop-by-Drop Jalabhishek
 * Features:
 * - Highly polished wet black stone (Krishna Shila) Lingam with subtle reflections
 * - Sacred Tripundra (three white vibhuti stripes) & red Kumkum bindu
 * - Two-tier stone Peetham (Yoni base) with carved lotus trim and snan spout
 * - Majestic golden Naag Devta (Cobra) with flared hood, scales & soft glowing emerald eyes
 * - Traditional hanging brass/copper Abhishek Patra (urn)
 * - Realistic drop-by-drop milk falling physics with splash rings, wet ripples & impact glow
 */
export default function ShivlingSanctum({
  position = [0, 0, -4.5],
  scale = 1.0,
  timeMode = 'evening',
  isRain = false,
}) {
  const shivlingGroupRef = useRef();
  const naagHoodRef = useRef();
  const splashLightRef = useRef();
  const rippleMeshRef = useRef();

  // Jalabhishek Drop State
  const dropRef = useRef();
  const dropState = useRef({
    y: 3.4, // Spout exit height
    startY: 3.4,
    targetY: 1.45, // Apex of Shivling
    velocity: 0,
    gravity: 6.8,
    active: true,
    lastImpactTime: 0,
    splashProgress: 0,
  });

  // Splash ripple animation state
  const [splashKey, setSplashKey] = useState(0);

  // Milk droplet particles on impact
  const splashSparksRef = useRef([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.04);
    const d = dropState.current;

    // 1. Gentle divine Naag breathing & organic micro-sway
    if (naagHoodRef.current) {
      // Gentle rhythmic breath expansion
      const breath = 1.0 + Math.sin(t * 1.8) * 0.02;
      naagHoodRef.current.scale.set(breath, breath, 1.0);
      naagHoodRef.current.rotation.z = Math.sin(t * 1.2) * 0.015;
    }

    // 2. Drop-by-Drop Physics
    if (d.active) {
      d.velocity += d.gravity * dt;
      d.y -= d.velocity * dt;

      // Check impact on top of Shivling
      if (d.y <= d.targetY) {
        // Trigger impact splash & wet ripple
        d.y = d.startY;
        d.velocity = 0;
        d.lastImpactTime = t;
        d.splashProgress = 1.0;
        setSplashKey((k) => k + 1);

        // Flash splash glow for fraction of a second
        if (splashLightRef.current) {
          splashLightRef.current.intensity = 2.2;
        }
      }
    }

    // Update drop position
    if (dropRef.current) {
      dropRef.current.position.y = d.y;
      // Stretched teardrop shape as speed increases
      const stretch = Math.min(1.0 + d.velocity * 0.15, 2.0);
      dropRef.current.scale.set(1.0 / Math.sqrt(stretch), stretch, 1.0 / Math.sqrt(stretch));
    }

    // Decay splash light quickly
    if (splashLightRef.current && splashLightRef.current.intensity > 0.01) {
      splashLightRef.current.intensity = THREE.MathUtils.lerp(
        splashLightRef.current.intensity,
        0,
        dt * 8.0
      );
    }

    // Expand & fade wet impact ripple
    if (rippleMeshRef.current) {
      const timeSinceImpact = t - d.lastImpactTime;
      if (timeSinceImpact < 1.2) {
        const progress = timeSinceImpact / 1.2;
        rippleMeshRef.current.scale.set(1.0 + progress * 1.8, 1.0 + progress * 1.8, 1.0);
        rippleMeshRef.current.material.opacity = Math.max(0, (1.0 - progress) * 0.7);
      } else {
        rippleMeshRef.current.material.opacity = 0;
      }
    }
  });

  return (
    <group ref={shivlingGroupRef} position={position} scale={scale}>
      {/* ================= 1. PEDESTAL (PEETHAM / YONI BASE) ================= */}
      {/* Lower Stone Chabutra Tier */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 2.0, 0.4, 36]} />
        <meshStandardMaterial
          color="#16191F"
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Lotus Petal Relief Molding Band */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[1.72, 1.8, 0.12, 36]} />
        <meshStandardMaterial color="#222730" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Main Oval Yoni Peetham */}
      <mesh position={[0, 0.65, 0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 1.6, 0.35, 36]} />
        <meshStandardMaterial
          color="#0F1217"
          roughness={0.18}
          metalness={0.25}
        />
      </mesh>

      {/* Yoni Libation Spout / Snan Channel (Gomukhi) extending forward */}
      <mesh position={[0, 0.65, 1.6]} rotation={[0.04, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.3, 1.2]} />
        <meshStandardMaterial color="#0F1217" roughness={0.18} metalness={0.25} />
      </mesh>
      {/* Inner Drain Groove */}
      <mesh position={[0, 0.76, 1.6]} rotation={[0.04, 0, 0]}>
        <boxGeometry args={[0.26, 0.08, 1.15]} />
        <meshStandardMaterial color="#F4F2EC" roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Base Golden Rim Inlay */}
      <mesh position={[0, 0.82, 0.2]}>
        <torusGeometry args={[1.38, 0.025, 12, 48]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* ================= 2. BLACK STONE SHIVLING (KRISHNA SHILA) ================= */}
      {/* Main Cylindrical Shaft */}
      <mesh position={[0, 1.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.44, 0.72, 32]} />
        <meshStandardMaterial
          color="#090B0F"
          roughness={0.12} // Wet glossy polished stone
          metalness={0.22}
        />
      </mesh>

      {/* Hemispherical Crown Dome */}
      <mesh position={[0, 1.54, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#090B0F"
          roughness={0.10}
          metalness={0.25}
        />
      </mesh>

      {/* Sacred Tripundra (Three White Vibhuti Stripes on Front Face) */}
      <group position={[0, 1.32, 0.425]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[0.34, 0.016]} />
          <meshBasicMaterial color="#FAF8F5" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <planeGeometry args={[0.36, 0.016]} />
          <meshBasicMaterial color="#FAF8F5" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <planeGeometry args={[0.34, 0.016]} />
          <meshBasicMaterial color="#FAF8F5" side={THREE.DoubleSide} />
        </mesh>
        {/* Red Kumkum / Chandan Bindu at Center */}
        <mesh position={[0, 0.0, 0.002]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#DC2626" />
        </mesh>
      </group>

      {/* Wet Milk Impact Ripple on Top of Lingam */}
      <mesh
        ref={rippleMeshRef}
        position={[0, 1.95, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.04, 0.12, 24]} />
        <meshBasicMaterial color="#FFFEEB" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* ================= 3. PROTECTIVE NAAG DEVTA (SACRED COBRA) ================= */}
      {/* Lower Coils wrapping around Shivling Base */}
      <group position={[0, 0.88, 0]}>
        {/* Coil 1 (Bottom) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.075, 16, 48]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
        {/* Coil 2 (Middle) */}
        <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0.4]}>
          <torusGeometry args={[0.52, 0.07, 16, 48]} />
          <meshStandardMaterial color="#B89225" metalness={0.92} roughness={0.25} />
        </mesh>
        {/* Coil 3 (Upper) */}
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0.8]}>
          <torusGeometry args={[0.49, 0.065, 16, 48]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.22} />
        </mesh>
      </group>

      {/* Cobra Neck Rising Behind Shivling */}
      <mesh position={[0, 1.6, -0.42]} rotation={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.07, 0.7, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* Flared Protective Cobra Hood (Chhatra) Canopy above Lingam */}
      <group ref={naagHoodRef} position={[0, 2.15, -0.22]} rotation={[-0.25, 0, 0]}>
        {/* Main Expanded Hood Fan */}
        <mesh castShadow>
          <cylinderGeometry args={[0.48, 0.16, 0.65, 24, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            color="#E5B842"
            metalness={0.94}
            roughness={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Sacred Golden Naag Spine & Marking */}
        <mesh position={[0, 0.05, 0.08]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.16, 0.02, 12, 24]} />
          <meshStandardMaterial color="#FFF0C2" metalness={0.98} roughness={0.15} />
        </mesh>

        {/* Cobra Head Peak */}
        <mesh position={[0, 0.38, 0.12]} rotation={[0.4, 0, 0]} castShadow>
          <coneGeometry args={[0.12, 0.28, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.94} roughness={0.18} />
        </mesh>

        {/* Subtle Glowing Emerald Eyes (Serene & Divine) */}
        <mesh position={[-0.07, 0.36, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <mesh position={[0.07, 0.36, 0.18]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <pointLight position={[0, 0.36, 0.22]} color="#10B981" intensity={0.4} distance={0.8} />
      </group>

      {/* ================= 4. HANGING ABHISHEK PATRA (BRASS VESSEL) ================= */}
      <group position={[0, 3.8, 0]}>
        {/* Suspension Chains to Temple Ceiling */}
        {[-0.25, 0.25].map((x, i) => (
          <mesh key={`chain-${i}`} position={[x, 1.2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 2.4, 8]} />
            <meshStandardMaterial color="#B38F24" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}

        {/* Hanging Kalash Rim */}
        <mesh position={[0, 0.25, 0]}>
          <torusGeometry args={[0.32, 0.035, 12, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Brass Vessel Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.32, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.92}
            roughness={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Bottom Dropper Nozzle */}
        <mesh position={[0, -0.32, 0]}>
          <coneGeometry args={[0.05, 0.14, 16]} rotation={[Math.PI, 0, 0]} />
          <meshStandardMaterial color="#B38F24" metalness={0.95} />
        </mesh>
      </group>

      {/* ================= 5. DROP-BY-DROP MILK DROPLET ================= */}
      <mesh ref={dropRef} position={[0, 3.4, 0]}>
        <sphereGeometry args={[0.038, 14, 14]} />
        <meshStandardMaterial
          color="#FFFDF7"
          roughness={0.08}
          metalness={0.1}
          emissive="#FFF6D1"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Milk Drop Impact Glow Flash */}
      <pointLight
        ref={splashLightRef}
        position={[0, 1.98, 0]}
        color="#FFF6D1"
        intensity={0}
        distance={2.5}
        decay={2}
      />

      {/* Warm Golden Rim & Sanctuary Illumination */}
      <pointLight
        position={[0, 2.2, 1.4]}
        color="#FFAE42"
        intensity={2.8}
        distance={6.5}
        decay={2}
      />
      <pointLight
        position={[0, 2.4, -1.2]}
        color="#FFD700"
        intensity={2.0}
        distance={5.0}
        decay={2}
      />

      {/* Fresh Marigold & Bilva Patra Offerings at the Lingam Base */}
      {[-0.65, -0.3, 0.35, 0.7].map((ox, idx) => (
        <group key={`flower-${idx}`} position={[ox, 0.86, 0.6 + (idx % 2) * 0.2]}>
          {/* Marigold Bloom */}
          <mesh>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#FF7A00" : "#FBBF24"} roughness={0.7} />
          </mesh>
          {/* Bilva Leaf (Tri-foliate) */}
          <mesh position={[0.06, -0.02, 0.05]} rotation={[-Math.PI / 2, 0, 0.4]}>
            <circleGeometry args={[0.05, 8]} />
            <meshStandardMaterial color="#166534" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
