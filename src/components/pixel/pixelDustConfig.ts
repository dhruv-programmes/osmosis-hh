export const PIXEL_DUST_DEFAULTS = {
  variant: "square" as const,
  pixelSize: 3,
  color: "#81ba2c",
  patternScale: 2,
  patternDensity: 2,
  pixelSizeJitter: 0.12,
  enableRipples: true,
  rippleSpeed: 0.3,
  rippleThickness: 0.1,
  rippleIntensityScale: 1.2,
  speed: 0.35,
  edgeFade: 0.22,
};

export const PIXEL_DUST_MOBILE = {
  ...PIXEL_DUST_DEFAULTS,
  pixelSize: 4,
  patternDensity: 1,
  enableRipples: false,
  speed: 0.22,
};

/** Denser diamond field for the stacking cards section */
export const PIXEL_DUST_STACKING = {
  variant: "diamond" as const,
  pixelSize: 2,
  color: "#a8d95a",
  patternScale: 2.6,
  patternDensity: 3,
  pixelSizeJitter: 0.2,
  enableRipples: true,
  rippleSpeed: 0.42,
  rippleThickness: 0.08,
  rippleIntensityScale: 0.85,
  speed: 0.48,
  edgeFade: 0.3,
};

export const PIXEL_DUST_STACKING_MOBILE = {
  ...PIXEL_DUST_STACKING,
  pixelSize: 4,
  patternDensity: 1,
  enableRipples: false,
  speed: 0.18,
};
