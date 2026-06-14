import { createContext, useContext } from "react";
import type * as THREE from "three";

export interface LiquidGlassContextValue {
  buffer: THREE.WebGLRenderTarget | null;
  scene: THREE.Scene | null;
}

export const LiquidGlassContext = createContext<LiquidGlassContextValue>({
  buffer: null,
  scene: null,
});

export function useLiquidGlass() {
  return useContext(LiquidGlassContext);
}
