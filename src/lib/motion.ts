export const spring = {
  smooth: { type: "spring" as const, stiffness: 260, damping: 32 },
  snappy: { type: "spring" as const, stiffness: 420, damping: 28 },
  float: { type: "spring" as const, stiffness: 120, damping: 18 },
};

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};
