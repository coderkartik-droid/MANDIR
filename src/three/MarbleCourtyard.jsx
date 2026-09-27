import React from 'react';
import * as THREE from 'three';

/**
 * Sacred Courtyard & Marble Mandapa Walkway
 * Incorporates:
 * - White polished marble aisle extending through the archway
 * - Outer terracotta ashram pavers
 * - Red brick-clad pillars bordering the sanctum walkway
 * - Dynamic wet reflection response during Rain Mode
 */
export default function MarbleCourtyard({
  isRain = false,
  timeMode = 'evening',
}) {
  const marbleRoughness = isRain ? 0.08 : 0.28;
  const marbleMetalness = isRain ? 0.35 : 0.12;

  return (
    <group position={[0, 0, 0]}>
      {/* ================= PRIMARY MARBLE AISLE ================= */}
      {/* Extends from foreground (z = 6) through archway to sanctum (z = -22) */}
      <mesh position={[0, -0.01, -7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.2, 30]} />
        <meshStandardMaterial
          color={isRain ? "#E2DFD8" : "#FAF8F5"}
          roughness={marbleRoughness}
          metalness={marbleMetalness}
        />
      </mesh>

      {/* Marble Tile Seam Inlays (subtle grey grid lines) */}
      {[-18, -14, -10, -6, -2, 2, 6].map((zPos, idx) => (
        <mesh key={`seam-${idx}`} position={[0, 0.005, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.1, 0.03]} />
          <meshBasicMaterial color="#C5BEB3" />
        </mesh>
      ))}

      {/* Center Saffron & Gold Marble Rangoli / Mandala Inlay */}
      <mesh position={[0, 0.008, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.9, 32]} />
        <meshBasicMaterial color="#FF9E2C" />
      </mesh>
      <mesh position={[0, 0.009, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 24]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>

      {/* ================= OUTER ASHRAM GROUND & PAVERS ================= */}
      {/* Terracotta / Earth Courtyard Surrounding the Marble Aisle */}
      <mesh position={[0, -0.05, -7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 38]} />
        <meshStandardMaterial
          color={isRain ? "#422818" : "#805238"}
          roughness={isRain ? 0.45 : 0.88}
        />
      </mesh>

      {/* Left Courtyard Sandy Soil & Tree Bed */}
      <mesh position={[-12, -0.04, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 28]} />
        <meshStandardMaterial color={isRain ? "#382D20" : "#685845"} roughness={0.92} />
      </mesh>

      {/* ================= BRICK PILLARS FLANKING MANDAPA ================= */}
      {/* Distinctive reddish brick columns seen in photo media_1790507916515.jpg */}
      {[
        [-2.7, -4.5],
        [2.7, -4.5],
        [-2.7, -9.5],
        [2.7, -9.5],
        [-2.7, -14.5],
        [2.7, -14.5],
      ].map(([x, z], idx) => (
        <group key={`mandapa-col-${idx}`} position={[x, 0, z]}>
          {/* Main Red Brick Column */}
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.65, 4.4, 0.65]} />
            <meshStandardMaterial
              color="#8C3825"
              roughness={0.85}
            />
          </mesh>
          {/* White Plinth Base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.85, 0.4, 0.85]} />
            <meshStandardMaterial color="#E8E4DD" roughness={0.7} />
          </mesh>
          {/* White Capital Top */}
          <mesh position={[0, 4.3, 0]} castShadow>
            <boxGeometry args={[0.85, 0.3, 0.85]} />
            <meshStandardMaterial color="#E8E4DD" roughness={0.7} />
          </mesh>
          {/* Small Brass Oil Diya on each pillar */}
          <group position={[x > 0 ? -0.38 : 0.38, 1.8, 0]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.04, 0.06, 12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <coneGeometry args={[0.025, 0.07, 8]} />
              <meshBasicMaterial color="#FF9E2C" />
            </mesh>
          </group>
        </group>
      ))}

      {/* Row of White Miniature Shrines (as seen on the right in porch photo) */}
      {[
        [3.8, -4.0],
        [4.8, -5.2],
        [5.8, -6.4],
        [6.8, -7.6],
      ].map(([x, z], idx) => (
        <group key={`shrine-${idx}`} position={[x, 0, z]}>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color="#FAF8F4" roughness={0.7} />
          </mesh>
          {/* Domed Shikhar roof */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <coneGeometry args={[0.48, 0.55, 4]} rotation={[0, Math.PI / 4, 0]} />
            <meshStandardMaterial color="#FAF8F4" roughness={0.65} />
          </mesh>
          {/* Small Gold Kalash pin */}
          <mesh position={[0, 1.15, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
