import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import TempleBell3D from './TempleBell3D';
import SoundwaveRipples from './SoundwaveRipples';

/**
 * The Iconic Royal Navy & Gold Archway (Swarna Dwar)
 * Enhanced with:
 * - Heavy ancient gate doors with golden studs, filigree borders, and brass handles
 * - Golden seam burst particles when the doors crack open
 * - Volumetric light portal emerging through the threshold
 * - Bell soundwave shockwave rings & falling sparks
 */
export default function RoyalArchway({
  position = [0, 0, 0],
  onRingBell = null,
  scrollProgress = 0,
  entranceProgress = 0, // Explicit cinematic entrance override [0, 1]
  timeMode = 'evening',
  isRain = false,
}) {
  const archGroup = useRef();
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const glowLightRef = useRef();
  const lightShaftRef = useRef();
  const gateSparksRef = useRef();

  // Effective progress: blends scrollProgress or explicit entrance sequence
  const effectiveProgress = Math.max(scrollProgress, entranceProgress);

  // Gate seam golden dust particles
  const sparkCount = 60;
  const sparkPos = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = Math.random() * 3.8 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return pos;
  }, [sparkCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Warm mystical lamp flickering
    if (glowLightRef.current) {
      const baseIntensity = timeMode === 'night' ? 2.5 : timeMode === 'evening' ? 2.0 : 1.2;
      const rainBoost = isRain ? 1.5 : 1.0;
      glowLightRef.current.intensity =
        (baseIntensity + Math.sin(t * 7.5) * 0.25 + Math.cos(t * 13.0) * 0.2) * rainBoost;
    }

    // Heavy Gate Opening Physics
    // Phase 2: Opens smoothly with ancient weight
    // Map effectiveProgress (0.05 -> 0.45) to open angle (0 -> Math.PI * 0.52)
    const openFactor = THREE.MathUtils.clamp((effectiveProgress - 0.08) * 3.0, 0, 1);
    const targetAngle = openFactor * (Math.PI * 0.52);

    if (leftDoorRef.current && rightDoorRef.current) {
      // Smooth heavy inertia interpolation
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        -targetAngle,
        dt * 2.8
      );
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        targetAngle,
        dt * 2.8
      );
    }

    // Volumetric Light Shaft through the opening
    if (lightShaftRef.current) {
      const shaftIntensity = THREE.MathUtils.clamp(openFactor * 1.4, 0, 1);
      lightShaftRef.current.material.opacity = shaftIntensity * (timeMode === 'night' ? 0.08 : 0.22);
      lightShaftRef.current.scale.x = 1.0 + openFactor * 1.5;
    }

    // Seam particles drift out as doors open
    if (gateSparksRef.current) {
      const positions = gateSparksRef.current.geometry.attributes.position.array;
      const visible = openFactor > 0.05 && openFactor < 0.95;
      gateSparksRef.current.material.opacity = visible ? Math.sin(openFactor * Math.PI) * 0.9 : 0;

      for (let i = 0; i < sparkCount; i++) {
        positions[i * 3 + 1] += dt * 0.3;
        positions[i * 3 + 2] += dt * 0.6; // move forward through door
        if (positions[i * 3 + 1] > 4.0) {
          positions[i * 3 + 1] = 0.5;
          positions[i * 3 + 2] = 0;
        }
      }
      gateSparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const navyColor = '#0F1E3D';
  const navyDark = '#081226';
  const goldColor = '#D4AF37';
  const goldBright = '#FFD700';

  return (
    <group ref={archGroup} position={position}>
      {/* ================= MAIN NAVY ARCH STRUCTURE ================= */}

      {/* Left Pillar */}
      <mesh position={[-2.3, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 5.0, 0.7]} />
        <meshStandardMaterial color={navyColor} roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[2.3, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 5.0, 0.7]} />
        <meshStandardMaterial color={navyColor} roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Top Lintel Beam */}
      <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 0.8, 0.7]} />
        <meshStandardMaterial color={navyColor} roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Top Crown Parapet */}
      <mesh position={[0, 5.35, 0]} castShadow>
        <boxGeometry args={[5.9, 0.3, 0.85]} />
        <meshStandardMaterial color={navyDark} roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Curved Inner Arch Spandrel */}
      <mesh position={[0, 4.25, 0]} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.7, 2.4, 32, 1, 0, Math.PI]} />
        <meshStandardMaterial
          color={navyColor}
          side={THREE.DoubleSide}
          roughness={0.35}
          metalness={0.25}
        />
      </mesh>

      {/* ================= GOLDEN CARVINGS & FILIGREE RELIEF ================= */}

      {/* Outer Golden Border Moulding - Left Column */}
      <mesh position={[-2.7, 2.5, 0.36]}>
        <boxGeometry args={[0.08, 4.9, 0.05]} />
        <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[-1.9, 2.5, 0.36]}>
        <boxGeometry args={[0.08, 4.9, 0.05]} />
        <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Outer Golden Border Moulding - Right Column */}
      <mesh position={[2.7, 2.5, 0.36]}>
        <boxGeometry args={[0.08, 4.9, 0.05]} />
        <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} />
      </mesh>
      <mesh position={[1.9, 2.5, 0.36]}>
        <boxGeometry args={[0.08, 4.9, 0.05]} />
        <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Outer Golden Border Moulding - Top Lintel */}
      <mesh position={[0, 5.15, 0.36]}>
        <boxGeometry args={[5.4, 0.08, 0.05]} />
        <meshStandardMaterial color={goldBright} metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 4.45, 0.36]}>
        <boxGeometry args={[5.4, 0.08, 0.05]} />
        <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} />
      </mesh>

      {/* Intricate Golden Carved Rosettes / Medallions on Left Pillar */}
      {[-1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((y, idx) => (
        <group key={`gold-left-${idx}`} position={[-2.3, y, 0.36]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.32, 0.32, 0.04]} />
            <meshStandardMaterial color={goldBright} metalness={0.95} roughness={0.18} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#FFF5D0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Intricate Golden Carved Rosettes / Medallions on Right Pillar */}
      {[-1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((y, idx) => (
        <group key={`gold-right-${idx}`} position={[2.3, y, 0.36]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.32, 0.32, 0.04]} />
            <meshStandardMaterial color={goldBright} metalness={0.95} roughness={0.18} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#FFF5D0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Golden Floral Filigree Along Top Arch Lintel */}
      {[-1.8, -1.0, -0.2, 0.6, 1.4, 2.2].map((x, idx) => (
        <group key={`gold-top-${idx}`} position={[x, 4.8, 0.36]}>
          <mesh rotation={[0, 0, idx % 2 === 0 ? 0 : Math.PI / 4]}>
            <torusGeometry args={[0.18, 0.035, 8, 16]} />
            <meshStandardMaterial color={goldBright} metalness={0.92} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Golden Arched Inner Trim (Filigree Curve) */}
      <mesh position={[0, 4.25, 0.36]}>
        <torusGeometry args={[1.85, 0.06, 12, 48, Math.PI]} />
        <meshStandardMaterial color={goldBright} metalness={0.96} roughness={0.15} />
      </mesh>

      {/* Base Plinths */}
      <mesh position={[-2.3, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.0]} />
        <meshStandardMaterial color="#D1CDC7" roughness={0.8} />
      </mesh>
      <mesh position={[2.3, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.0]} />
        <meshStandardMaterial color="#D1CDC7" roughness={0.8} />
      </mesh>

      {/* ================= INTERACTIVE SUSPENDED TEMPLE BELL ================= */}
      <TempleBell3D
        position={[0, 3.8, 0]}
        scale={1.35}
        onRing={onRingBell}
        interactive={true}
      />

      {/* ================= SOUNDWAVE SHOCKWAVE RINGS ================= */}
      <SoundwaveRipples bellPosition={[0, 3.2, 0]} />

      {/* ================= HEAVY ANCIENT CEREMONIAL GATES ================= */}
      {/* Left Gate Wing */}
      <group ref={leftDoorRef} position={[-1.85, 2.0, 0]}>
        {/* Main Solid Navy Panel */}
        <mesh position={[0.9, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 3.8, 0.08]} />
          <meshStandardMaterial
            color="#081022"
            metalness={0.65}
            roughness={0.4}
          />
        </mesh>
        {/* Golden Carved Raised Border on Gate */}
        <mesh position={[0.9, 0, 0.045]}>
          <boxGeometry args={[1.65, 3.65, 0.02]} />
          <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} wireframe={false} />
        </mesh>
        <mesh position={[0.9, 0, 0.056]}>
          <boxGeometry args={[1.5, 3.5, 0.01]} />
          <meshStandardMaterial color="#0A1630" roughness={0.5} />
        </mesh>
        {/* Brass Lotus Studs */}
        {[-0.4, 0.4].map((ox) =>
          [-1.2, -0.4, 0.4, 1.2].map((oy) => (
            <mesh key={`stud-l-${ox}-${oy}`} position={[0.9 + ox, oy, 0.07]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color={goldBright} metalness={0.95} roughness={0.2} />
            </mesh>
          ))
        )}
        {/* Sacred Heavy Brass Handle / Ring Knocker */}
        <group position={[1.6, 0, 0.09]}>
          <mesh>
            <torusGeometry args={[0.07, 0.018, 8, 16]} />
            <meshStandardMaterial color={goldBright} metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Right Gate Wing */}
      <group ref={rightDoorRef} position={[1.85, 2.0, 0]}>
        {/* Main Solid Navy Panel */}
        <mesh position={[-0.9, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 3.8, 0.08]} />
          <meshStandardMaterial
            color="#081022"
            metalness={0.65}
            roughness={0.4}
          />
        </mesh>
        {/* Golden Carved Raised Border on Gate */}
        <mesh position={[-0.9, 0, 0.045]}>
          <boxGeometry args={[1.65, 3.65, 0.02]} />
          <meshStandardMaterial color={goldColor} metalness={0.88} roughness={0.25} />
        </mesh>
        <mesh position={[-0.9, 0, 0.056]}>
          <boxGeometry args={[1.5, 3.5, 0.01]} />
          <meshStandardMaterial color="#0A1630" roughness={0.5} />
        </mesh>
        {/* Brass Lotus Studs */}
        {[-0.4, 0.4].map((ox) =>
          [-1.2, -0.4, 0.4, 1.2].map((oy) => (
            <mesh key={`stud-r-${ox}-${oy}`} position={[-0.9 + ox, oy, 0.07]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color={goldBright} metalness={0.95} roughness={0.2} />
            </mesh>
          ))
        )}
        {/* Sacred Heavy Brass Handle / Ring Knocker */}
        <group position={[-1.6, 0, 0.09]}>
          <mesh>
            <torusGeometry args={[0.07, 0.018, 8, 16]} />
            <meshStandardMaterial color={goldBright} metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Gate Seam Burst Particles (Gold Dust Emerging from Opening Crack) */}
      <points ref={gateSparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sparkCount}
            array={sparkPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#FFD700"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Volumetric Light Portal Emerging through Doorway */}
      <mesh ref={lightShaftRef} position={[0, 2.0, -1.5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.8, 4.0]} />
        <meshBasicMaterial
          color="#FFF2BD"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ================= ILLUMINATING TEMPLE DIYAS ================= */}
      <group position={[-2.3, 1.8, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#B38F24" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshBasicMaterial color="#FF9E2C" />
        </mesh>
      </group>

      <group position={[2.3, 1.8, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#B38F24" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshBasicMaterial color="#FF9E2C" />
        </mesh>
      </group>

      {/* Dynamic Warm Lamp Glow Light */}
      <pointLight
        ref={glowLightRef}
        position={[0, 3.2, 0.6]}
        color="#FF9E2C"
        intensity={2.2}
        distance={9}
        decay={2}
      />
    </group>
  );
}
