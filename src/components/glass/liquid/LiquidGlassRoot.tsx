/* eslint-disable react/no-unknown-property */
import { useFBO } from "@react-three/drei";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal as createDomPortal } from "react-dom";
import * as THREE from "three";
import BackgroundScene from "./BackgroundScene";
import GlassRenderer from "./GlassRenderer";
import { LiquidGlassContext } from "./context";

function TransmissionPipeline({ children = null }: { children?: ReactNode }) {
  const buffer = useFBO(2048, 2048, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
  });
  const [scene] = useState(() => new THREE.Scene());
  const { viewport } = useThree();

  useFrame(({ gl, camera }) => {
    gl.setRenderTarget(buffer);
    gl.setClearColor(0x080809, 1);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  const value = useMemo(() => ({ buffer, scene }), [buffer, scene]);

  return (
    <LiquidGlassContext.Provider value={value}>
      {createPortal(<BackgroundScene />, scene)}
      <mesh scale={[viewport.width, viewport.height, 1]} position={[0, 0, -8]} renderOrder={-1}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent opacity={0} />
      </mesh>
      <GlassRenderer />
      {children}
    </LiquidGlassContext.Provider>
  );
}

function LiquidGlassCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 14 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
    >
      <TransmissionPipeline />
    </Canvas>
  );
}

export default function LiquidGlassRoot() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setTimeout(() => setReady(true), 750);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted || !ready) return null;

  return createDomPortal(
    <div className="pointer-events-none fixed inset-0 z-[2]">
      <LiquidGlassCanvas />
    </div>,
    document.body,
  );
}
