import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Temple Sanctum Sanctorum (Garbhagriha) & Yajna Shala
 * Recreates the inner temple structure seen in the reference photos:
 * - White Mandapa hall with brick pillars
 * - Inner sanctum chamber with glowing Akhand Jyoti (eternal flame)
 * - Golden temple Dhwaja (sacred flag) fluttering gently in the breeze
 * - Orange Yajna Shala pavilion in the courtyard background
 */
export default function TempleSanctum({
  position = [0, 0, -18],
  isRain = false,
  timeMode = 'evening',
}) {
  const flagRef = useRef();
  const innerLightRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Flag flutter
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(t * 3.5) * 0.2;
      flagRef.current.rotation.z = Math.cos(t * 2.8) * 0.08;
    }
    // Inner Akhand Jyoti flame flicker
    if (innerLightRef.current) {
      innerLightRef.current.intensity = 2.8 + Math.sin(t * 9.0) * 0.4 + Math.cos(t * 14.0) * 0.25;
    }
  });

  return (
    <group position={position}>
      {/* ================= MAIN SANCTUM HALL ================= */}
      {/* White Porch Roof Canopy */}
      <mesh position={[0, 4.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.45, 8.5]} />
        <meshStandardMaterial color="#F4EFE6" roughness={0.65} />
      </mesh>

      {/* Roof Parapet Trim */}
      <mesh position={[0, 5.0, 0]}>
        <boxGeometry args={[9.8, 0.35, 8.8]} />
        <meshStandardMaterial color="#E8E2D5" roughness={0.6} />
      </mesh>

      {/* Inner Chamber Back Wall */}
      <mesh position={[0, 2.3, -3.8]} castShadow receiveShadow>
        <boxGeometry args={[8.8, 4.4, 0.5]} />
        <meshStandardMaterial color="#FAF7F0" roughness={0.7} />
      </mesh>

      {/* Sanctum Grille Gate / Sacred Shrine Doorway */}
      <mesh position={[0, 1.8, -3.5]}>
        <boxGeometry args={[2.2, 3.4, 0.08]} />
        <meshStandardMaterial
          color="#0A1224"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Brass Grille Bars */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <mesh key={`grille-${i}`} position={[x, 1.8, -3.45]}>
          <cylinderGeometry args={[0.018, 0.018, 3.3, 8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.2} />
        </mesh>
      ))}

      {/* Golden Temple Shikhar / Crown Peak atop roof */}
      <mesh position={[0, 6.2, -1.8]} castShadow>
        <coneGeometry args={[1.2, 2.2, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#FAF7F0" roughness={0.5} />
      </mesh>

      {/* Golden Kalash on Shikhar Spire */}
      <mesh position={[0, 7.5, -1.8]}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Sacred Golden Flagpole */}
      <mesh position={[0, 8.2, -1.8]}>
        <cylinderGeometry args={[0.025, 0.025, 1.4, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} />
      </mesh>

      {/* Sacred Fluttering Saffron Dhwaja (Temple Flag) */}
      <group position={[0.3, 8.5, -1.8]} ref={flagRef}>
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.35, 0.85, 3]} />
          <meshStandardMaterial
            color="#FF7A00"
            side={THREE.DoubleSide}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Akhand Jyoti Divine Light emanating from Sanctum */}
      <pointLight
        ref={innerLightRef}
        position={[0, 1.8, -2.8]}
        color="#FFAE42"
        intensity={3.0}
        distance={12}
        decay={2}
      />

      {/* Inner Glowing Deity Silhouette / Sacred Glow */}
      <mesh position={[0, 1.7, -3.3]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#FFF0C2" />
      </mesh>

      {/* ================= YAJNA SHALA (ORANGE CANOPY PAVILION) ================= */}
      {/* As seen in background of courtyard photo media_1790507916369.jpg */}
      <group position={[-9.5, 0, 4.0]}>
        {/* Raised Platform */}
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[5.2, 0.7, 5.2]} />
          <meshStandardMaterial color="#D9D5CC" roughness={0.8} />
        </mesh>
        {/* Saffron Pillars */}
        {[
          [-2.2, -2.2],
          [2.2, -2.2],
          [-2.2, 2.2],
          [2.2, 2.2],
        ].map(([x, z], i) => (
          <mesh key={`yajna-col-${i}`} position={[x, 1.8, z]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 2.8, 16]} />
            <meshStandardMaterial color="#FF5722" roughness={0.55} />
          </mesh>
        ))}
        {/* Saffron Canopy Roof */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <coneGeometry args={[3.8, 1.4, 4]} rotation={[0, Math.PI / 4, 0]} />
          <meshStandardMaterial color="#FF6E40" roughness={0.6} />
        </mesh>
        {/* Small Hawan Kund Smoke Point */}
        <pointLight position={[0, 1.2, 0]} color="#FF9E2C" intensity={1.2} distance={5} />
      </group>
    </group>
  );
}
