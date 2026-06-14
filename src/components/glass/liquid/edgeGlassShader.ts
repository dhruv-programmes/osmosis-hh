export const EDGE_GLASS_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const EDGE_GLASS_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uBuffer;
  uniform vec2 uResolution;
  uniform float uCornerRadius;
  uniform float uClearInset;
  uniform float uBendStrength;
  uniform float uChromatic;
  uniform float uFresnel;
  uniform float uTint;
  uniform vec2 uPointer;
  uniform float uPointerMix;

  varying vec2 vUv;

  float sdRoundedBox(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  void main() {
    vec2 p = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    vec2 aspectP = vec2(p.x * aspect, p.y);
    vec2 halfSize = vec2(0.5 * aspect, 0.5) - vec2(uCornerRadius);

    float d = sdRoundedBox(aspectP, halfSize, uCornerRadius);
    float insideDepth = max(-d, 0.0);
    float edgeMask = 1.0 - smoothstep(0.0, uClearInset, insideDepth);
    edgeMask = pow(edgeMask, 1.35);

    if (d > 0.002) discard;

    vec2 screenUv = gl_FragCoord.xy / uResolution;
    vec2 bendDir = normalize(aspectP + 1e-5) * edgeMask;

    vec2 pointerDelta = (uPointer - vUv) * uPointerMix * edgeMask * 0.35;
    vec2 offset = bendDir * uBendStrength + pointerDelta;

    vec3 centerCol = texture2D(uBuffer, screenUv).rgb;
    vec3 refractCol = vec3(
      texture2D(uBuffer, screenUv + offset * (1.0 + uChromatic)).r,
      texture2D(uBuffer, screenUv + offset).g,
      texture2D(uBuffer, screenUv + offset * (1.0 - uChromatic)).b
    );

    vec3 col = mix(centerCol, refractCol, edgeMask);

    float fresnel = pow(edgeMask, 1.6) * uFresnel;
    col += fresnel * vec3(1.0, 1.0, 1.0);
    col = mix(col, col * vec3(0.98, 1.0, 0.96), uTint * edgeMask);

    float alpha = mix(0.01, 0.22, edgeMask) + fresnel * 0.08;
    gl_FragColor = vec4(col, alpha);
  }
`;

export type EdgeGlassVariant = "panel" | "nav";

export const EDGE_GLASS_PRESETS: Record<
  EdgeGlassVariant,
  {
    cornerRadius: number;
    clearInset: number;
    bendStrength: number;
    chromatic: number;
    fresnel: number;
    tint: number;
    z: number;
    depth: number;
  }
> = {
  panel: {
    cornerRadius: 0.07,
    clearInset: 0.11,
    bendStrength: 0.014,
    chromatic: 0.45,
    fresnel: 0.28,
    tint: 0.12,
    z: 12,
    depth: 0.04,
  },
  nav: {
    cornerRadius: 0.48,
    clearInset: 0.055,
    bendStrength: 0.01,
    chromatic: 0.35,
    fresnel: 0.22,
    tint: 0.08,
    z: 14,
    depth: 0.03,
  },
};
