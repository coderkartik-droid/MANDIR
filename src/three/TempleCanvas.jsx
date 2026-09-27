import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import RoyalArchway from './RoyalArchway';
import AncientTree from './AncientTree';
import MarbleCourtyard from './MarbleCourtyard';
import ShivlingSanctum from './ShivlingSanctum';
import TempleSanctum from './TempleSanctum';
import WeatherParticles from './WeatherParticles';
import TempleEnvironment from './TempleEnvironment';
import CameraController from './CameraController';

/**
 * 3D Temple Scene Canvas
 * Centers the sacred 3D Shivling, Naag Devta, and Jalabhishek
 */
export default function TempleCanvas({
  timeMode = 'evening',
  isRain = false,
  scrollProgress = 0,
  entranceProgress = 0,
  onRingBell = null,
}) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0">
      <Canvas
        shadows
        dpr={[1, Math.min(window.devicePixelRatio || 1, 1.75)]}
        camera={{ position: [0, 2.6, 9.5], fov: 52, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <Suspense fallback={null}>
          {/* Dynamic Sky, Lighting & Volumetric God Rays */}
          <TempleEnvironment timeMode={timeMode} isRain={isRain} />

          {/* Smooth Scroll & Parallax Camera Controller with Shivling Orbit */}
          <CameraController
            scrollProgress={scrollProgress}
            entranceProgress={entranceProgress}
          />

          {/* Sacred Courtyard Walkway */}
          <MarbleCourtyard isRain={isRain} timeMode={timeMode} />
          
          {/* Grand Royal Navy & Gold Archway */}
          <RoyalArchway
            position={[0, 0, 0]}
            onRingBell={onRingBell}
            scrollProgress={scrollProgress}
            entranceProgress={entranceProgress}
            timeMode={timeMode}
            isRain={isRain}
          />

          {/* Centered Sacred 3D Shivling with Naag Devta & Milk Jalabhishek */}
          <ShivlingSanctum
            position={[0, 0, -4.5]}
            scale={1.05}
            timeMode={timeMode}
            isRain={isRain}
          />

          {/* Ancient Kalpavriksha Sacred Tree */}
          <AncientTree position={[-6.8, 0, -3.8]} scale={1.05} />

          {/* Background Temple Sanctum Hall */}
          <TempleSanctum position={[0, 0, -18]} isRain={isRain} timeMode={timeMode} />

          {/* Golden Dust, Rain Streaks, Petals & Birds */}
          <WeatherParticles isRain={isRain} timeMode={timeMode} />
        </Suspense>
      </Canvas>
    </div>
  );
}
