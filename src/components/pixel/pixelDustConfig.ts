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
