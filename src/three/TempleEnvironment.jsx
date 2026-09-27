import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../utils/audioEngine';

/**
 * Dynamic Environment, Lighting, Sky, Fog & Weather
 * Handles:
 * - Morning, Evening, Night sky palettes & light intensity
 * - Rain storm clouds & increased fog
 * - Periodic lightning flashes with synchronized audio rumble
 */
export default function TempleEnvironment({
  timeMode = 'evening',
  isRain = false,
}) {
  const { scene } = useThree();
  const dirLightRef = useRef();
  const lightningLightRef = useRef();
  const nextLightningTime = useRef(performance.now() + 5000);

  // Lighting configurations for each time mode
  const config = {
    morning: {
      sky: '#9BB8D3',
      ambient: '#FFF0D6',
      ambientIntensity: 0.85,
      sun: '#FFF5E0',
      sunIntensity: 1.8,
      sunPos: [15, 18, 12],
      fogColor: '#BDD2E4',
      fogNear: 15,
      fogFar: 48,
    },
    evening: {
      sky: '#1E1B38',
      ambient: '#F0BA73',
      ambientIntensity: 0.65,
      sun: '#FFA442',
      sunIntensity: 2.2,
      sunPos: [8, 10, 8],
      fogColor: '#1A1B30',
      fogNear: 12,
      fogFar: 40,
    },
    night: {
      sky: '#040712',
      ambient: '#1A2952',
      ambientIntensity: 0.4,
      sun: '#466BA8',
      sunIntensity: 0.8,
      sunPos: [-10, 16, -6],
      fogColor: '#050A18',
      fogNear: 10,
      fogFar: 36,
    }
  };

  const current = config[timeMode] || config.evening;

  // Rain adjustments
  const rainSky = '#0D1420';
  const rainFogColor = '#0E1724';

  useEffect(() => {
    // Set scene background and fog
    const targetFogColor = isRain ? rainFogColor : current.fogColor;
    const targetNear = isRain ? 8 : current.fogNear;
    const targetFar = isRain ? 28 : current.fogFar;

    scene.fog = new THREE.Fog(targetFogColor, targetNear, targetFar);
    scene.background = new THREE.Color(isRain ? rainSky : current.sky);
  }, [timeMode, isRain, scene, current]);

  // Lightning system in Rain Mode
  useFrame((state) => {
    if (!isRain) {
      if (lightningLightRef.current) lightningLightRef.current.intensity = 0;
      return;
    }

    const now = performance.now();
    if (now > nextLightningTime.current) {
      // Trigger lightning flash
      if (lightningLightRef.current) {
        lightningLightRef.current.intensity = 6.0;
        // Schedule flash decay
        setTimeout(() => {
          if (lightningLightRef.current) lightningLightRef.current.intensity = 1.5;
        }, 60);
        setTimeout(() => {
          if (lightningLightRef.current) lightningLightRef.current.intensity = 4.5;
        }, 120);
        setTimeout(() => {
          if (lightningLightRef.current) lightningLightRef.current.intensity = 0;
        }, 220);
      }

      // Play soft thunder audio
      soundEngine.triggerThunder();

      // Next lightning in 8 to 18 seconds
      nextLightningTime.current = now + 8000 + Math.random() * 10000;
    }
  });

  return (
    <>
      {/* Ambient Fill */}
      <ambientLight
        color={isRain ? '#1B263B' : current.ambient}
        intensity={isRain ? 0.35 : current.ambientIntensity}
      />

      {/* Primary Celestial Sun / Moon Light with Soft Shadows */}
      <directionalLight
        ref={dirLightRef}
        position={current.sunPos}
        color={isRain ? '#6A8CAF' : current.sun}
        intensity={isRain ? 0.8 : current.sunIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />

      {/* Hemisphere Ground Bounce Light */}
      <hemisphereLight
        args={[
          isRain ? '#2C3E50' : current.sky,
          isRain ? '#141E28' : '#2D1F15',
          0.4
        ]}
      />

      {/* Dramatic Lightning Flash Light (Active during Rain) */}
      <directionalLight
        ref={lightningLightRef}
        position={[0, 25, 5]}
        color="#E6F2FF"
        intensity={0}
      />

      {/* Subtle God Rays Light Cylinder */}
      <mesh position={[1.5, 6, -3]} rotation={[0.4, 0, -0.3]}>
        <cylinderGeometry args={[0.3, 3.2, 14, 16, 1, true]} />
        <meshBasicMaterial
          color={isRain ? "#88A6C7" : "#FFDF9E"}
          transparent
          opacity={isRain ? 0.05 : 0.09}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
