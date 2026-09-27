/**
 * Custom Shaders for Divine Temple Atmospherics
 */

// Shimmering Divine Gold Shader
export const GoldShimmerShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorGlow;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel rim glow
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

      // Shimmer wave across UV
      float wave = sin(vUv.y * 12.0 - uTime * 2.5) * 0.5 + 0.5;
      float sparkle = pow(wave, 4.0) * 0.4;

      vec3 gold = mix(uColorBase, uColorGlow, fresnel + sparkle);
      gl_FragColor = vec4(gold, 1.0);
    }
  `
};

// Incense Smoke Shader
export const IncenseSmokeShader = {
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vAlpha;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Gentle serpentine drift
      float sway = sin(uTime * 1.5 + position.y * 3.0) * 0.15;
      float drift = cos(uTime * 1.1 + position.y * 2.0) * 0.1;
      pos.x += sway * (uv.y);
      pos.z += drift * (uv.y);

      // Expand as it rises
      pos.x *= (1.0 + uv.y * 1.2);
      pos.z *= (1.0 + uv.y * 1.2);

      vAlpha = (1.0 - uv.y) * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vAlpha;

    void main() {
      // Soft radial fading
      float distFromCenter = abs(vUv.x - 0.5) * 2.0;
      float alpha = smoothstep(1.0, 0.0, distFromCenter) * vAlpha;
      vec3 smokeColor = mix(vec3(0.95, 0.90, 0.82), vec3(0.7, 0.75, 0.85), vUv.y);
      gl_FragColor = vec4(smokeColor, alpha * 0.35);
    }
  `
};

// Sacred Diya Flame Shader
export const DiyaFlameShader = {
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;
      // Flame teardrop jitter
      float jitter = sin(uTime * 12.0 + position.y * 8.0) * 0.05 * uv.y;
      pos.x += jitter;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5, 0.2);
      float dist = distance(vUv, center);
      
      // Core white-gold, body saffron, tip reddish
      vec3 core = vec3(1.0, 0.95, 0.7);
      vec3 flame = vec3(1.0, 0.45, 0.05);
      vec3 edge = vec3(0.9, 0.15, 0.0);

      float t = smoothstep(0.45, 0.0, dist);
      vec3 col = mix(edge, flame, smoothstep(0.4, 0.15, dist));
      col = mix(col, core, smoothstep(0.18, 0.02, dist));

      float alpha = smoothstep(0.5, 0.1, dist) * (1.0 - vUv.y * 0.4);
      gl_FragColor = vec4(col, alpha);
    }
  `
};
