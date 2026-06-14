/** Osmosis Hacker House palette for Grainient backgrounds */
export const GRAINIENT_COLORS = {
  accent: "#81ba2c",
  dark: "#080809",
  mutedGreen: "#1a2e14",
} as const;

/** Subtle animated base behind the hero venue photo */
export const heroGrainient = {
  color1: GRAINIENT_COLORS.accent,
  color2: GRAINIENT_COLORS.dark,
  color3: GRAINIENT_COLORS.mutedGreen,
  timeSpeed: 0.18,
  colorBalance: -0.08,
  warpStrength: 0.85,
  warpFrequency: 4,
  warpSpeed: 1.5,
  warpAmplitude: 60,
  blendSoftness: 0.08,
  rotationAmount: 420,
  noiseScale: 1.8,
  grainAmount: 0.06,
  grainScale: 2,
  grainAnimated: false,
  contrast: 1.35,
  gamma: 1,
  saturation: 0.85,
  zoom: 0.95,
} as const;

/** Accent glow behind the register CTA panel */
export const registerGrainient = {
  color1: GRAINIENT_COLORS.accent,
  color2: "#0c1209",
  color3: "#1c3316",
  timeSpeed: 0.25,
  colorBalance: 0,
  warpStrength: 1,
  warpFrequency: 5,
  warpSpeed: 2,
  warpAmplitude: 50,
  blendSoftness: 0.05,
  rotationAmount: 500,
  noiseScale: 2,
  grainAmount: 0.08,
  grainScale: 2,
  grainAnimated: false,
  contrast: 1.4,
  gamma: 1,
  saturation: 0.9,
  zoom: 0.9,
} as const;
