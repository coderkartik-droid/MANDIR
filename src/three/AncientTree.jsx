import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The Ancient Sacred Mahavriksha (Banyan / Neem Tree)
 * Faithful to uploaded reference photos (temple_courtyard_tree.jpg, temple_porch_marble.jpg):
 * - Massive gnarled twisting trunk with whitewashed base (chuna coating)
 * - Monumental sprawling limbs traversing the courtyard
 * - Lush wind-swaying foliage canopies
 * - Circular stone meditation plinth (Chabutra)
 */
export default function AncientTree({
  position = [-6.5, 0, -4.0],
  scale = 1.0,
}) {
  const foliageGroupRef = useRef();

  // Gentle wind sway animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (foliageGroupRef.current) {
      // Wind rustle
      foliageGroupRef.current.rotation.z = Math.sin(t * 0.8) * 0.025;
      foliageGroupRef.current.rotation.x = Math.cos(t * 0.6) * 0.015;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Circular Stone Meditation Plinth (Chabutra at tree base) */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.8, 32]} />
        <meshStandardMaterial color="#E0DCD3" roughness={0.9} />
      </mesh>
      {/* Inner Raised Earth Mound */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[2.4, 2.5, 0.1, 24]} />
        <meshStandardMaterial color="#3D3025" roughness={0.95} />
      </mesh>

      {/* Whitewashed Lower Trunk (Traditional sacred ashram Chuna band) */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.5, 1.6, 16]} />
        <meshStandardMaterial color="#EDE9E3" roughness={0.85} />
      </mesh>

      {/* Main Massive Gnarled Bark Trunk */}
      <mesh position={[0.2, 3.4, 0]} rotation={[0.08, 0, -0.06]} castShadow>
        <cylinderGeometry args={[0.9, 1.1, 2.2, 16]} />
        <meshStandardMaterial color="#3A2818" roughness={0.92} />
      </mesh>

      {/* Upper Trunk Division */}
      <mesh position={[0.5, 5.0, 0.1]} rotation={[0.12, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.75, 0.9, 2.0, 14]} />
        <meshStandardMaterial color="#44301D" roughness={0.9} />
      </mesh>

      {/* Sprawling Massive Eastern Branch (Arching across ashram courtyard) */}
      <mesh position={[2.2, 6.2, 0.4]} rotation={[0.4, 0.2, -0.65]} castShadow>
        <cylinderGeometry args={[0.4, 0.7, 4.2, 12]} />
        <meshStandardMaterial color="#3A2818" roughness={0.9} />
      </mesh>

      {/* Secondary Sprawling Limb (Extending toward temple entrance) */}
      <mesh position={[4.2, 7.5, 0.8]} rotation={[0.2, 0.4, -0.4]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 3.8, 10]} />
        <meshStandardMaterial color="#3A2818" roughness={0.9} />
      </mesh>

      {/* Western Majestic Branch */}
      <mesh position={[-1.8, 6.5, -0.3]} rotation={[-0.3, -0.1, 0.7]} castShadow>
        <cylinderGeometry args={[0.38, 0.65, 3.6, 12]} />
        <meshStandardMaterial color="#3A2818" roughness={0.9} />
      </mesh>

      {/* Skyward Center Crown Branch */}
      <mesh position={[0.8, 7.2, -0.2]} rotation={[0.05, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.35, 0.55, 3.2, 12]} />
        <meshStandardMaterial color="#3A2818" roughness={0.9} />
      </mesh>

      {/* Hanging Aerial Roots (Prop roots characteristic of venerable banyan) */}
      {[
        [1.8, 3.8, 0.8, 4.2],
        [3.0, 4.2, 1.2, 5.0],
        [-1.2, 3.5, 0.4, 3.8],
        [0.6, 2.8, -1.0, 3.2],
      ].map(([x, y, z, len], i) => (
        <mesh key={`root-${i}`} position={[x, y, z]} rotation={[0.05 * (i % 2), 0, -0.04 * (i % 3)]}>
          <cylinderGeometry args={[0.04, 0.05, len, 8]} />
          <meshStandardMaterial color="#2E1F13" roughness={0.95} />
        </mesh>
      ))}

      {/* Sacred Saffron Mauli Protective Threads wrapped around trunk */}
      <mesh position={[0.2, 3.2, 0]} rotation={[0.08, 0, -0.06]}>
        <torusGeometry args={[1.08, 0.03, 8, 24]} />
        <meshStandardMaterial color="#FF4800" roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 3.35, 0]} rotation={[0.08, 0, -0.06]}>
        <torusGeometry args={[1.06, 0.025, 8, 24]} />
        <meshStandardMaterial color="#FFD700" roughness={0.6} />
      </mesh>

      {/* ================= CANOPY FOLIAGE CLUSTERS ================= */}
      <group ref={foliageGroupRef}>
        {/* Main Central Crown Leaves */}
        <mesh position={[1.0, 9.2, 0]} castShadow>
          <sphereGeometry args={[2.8, 14, 14]} />
          <meshStandardMaterial color="#1B422B" roughness={0.8} />
        </mesh>
        <mesh position={[0.4, 9.8, -0.8]} castShadow>
          <sphereGeometry args={[2.3, 12, 12]} />
          <meshStandardMaterial color="#225437" roughness={0.8} />
        </mesh>

        {/* Extended Eastern Canopy over courtyard */}
        <mesh position={[4.8, 8.8, 1.2]} castShadow>
          <sphereGeometry args={[2.5, 12, 12]} />
          <meshStandardMaterial color="#1F4C32" roughness={0.8} />
        </mesh>
        <mesh position={[6.2, 8.2, 1.8]} castShadow>
          <sphereGeometry args={[2.0, 10, 10]} />
          <meshStandardMaterial color="#26613F" roughness={0.8} />
        </mesh>

        {/* Western Canopy */}
        <mesh position={[-3.2, 8.5, -0.6]} castShadow>
          <sphereGeometry args={[2.4, 12, 12]} />
          <meshStandardMaterial color="#183D27" roughness={0.8} />
        </mesh>
        <mesh position={[-2.2, 9.4, 1.0]} castShadow>
          <sphereGeometry args={[1.9, 10, 10]} />
          <meshStandardMaterial color="#215235" roughness={0.8} />
        </mesh>
      </group>

      {/* Sacred Brass Diya resting on the Chabutra plinth */}
      <group position={[1.8, 0.85, 0.8]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.06, 0.08, 16]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <coneGeometry args={[0.035, 0.09, 8]} />
          <meshBasicMaterial color="#FF9E2C" />
        </mesh>
        <pointLight color="#FF9E2C" intensity={0.8} distance={2.5} />
      </group>
    </group>
  );
}
