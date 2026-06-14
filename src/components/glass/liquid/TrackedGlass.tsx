/* eslint-disable react/no-unknown-property */
import { useFrame, useThree, type RootState } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  EDGE_GLASS_FRAGMENT,
  EDGE_GLASS_PRESETS,
  EDGE_GLASS_VERTEX,
} from "./edgeGlassShader";
import { useLiquidGlass } from "./context";

interface TrackedGlassProps {
  targetRef: RefObject<HTMLElement | null>;
  variant?: "panel" | "nav";
}

function domToWorld(
  rect: DOMRect,
  camera: THREE.Camera,
  viewport: RootState["viewport"],
  z: number,
) {
  const v = viewport.getCurrentViewport(camera as THREE.PerspectiveCamera, [0, 0, z]);
  const x = ((rect.left + rect.width / 2) / window.innerWidth - 0.5) * v.width;
  const y = -((rect.top + rect.height / 2) / window.innerHeight - 0.5) * v.height;
  const w = (rect.width / window.innerWidth) * v.width;
  const h = (rect.height / window.innerHeight) * v.height;
  return { x, y, z, w, h };
}

function pointerInRect(pointer: { x: number; y: number }, rect: DOMRect) {
  const px = (pointer.x + 1) * 0.5 * window.innerWidth;
  const py = (1 - pointer.y) * 0.5 * window.innerHeight;
  return px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
}

export function TrackedGlass({
  targetRef,
  variant = "panel",
}: TrackedGlassProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerMix = useRef(0);
  const { buffer } = useLiquidGlass();
  const { camera, pointer, size, viewport } = useThree();
  const preset = EDGE_GLASS_PRESETS[variant];

  const uniforms = useMemo(
    () => ({
      uBuffer: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uCornerRadius: { value: preset.cornerRadius },
      uClearInset: { value: preset.clearInset },
      uBendStrength: { value: preset.bendStrength },
      uChromatic: { value: preset.chromatic },
      uFresnel: { value: preset.fresnel },
      uTint: { value: preset.tint },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerMix: { value: 0 },
    }),
    [preset, size.height, size.width],
  );

  useFrame((_, delta) => {
    if (!mesh.current || !targetRef.current || !buffer) return;

    const rect = targetRef.current.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      mesh.current.visible = false;
      return;
    }

    mesh.current.visible = true;
    const { x, y, z, w, h } = domToWorld(rect, camera, viewport, preset.z);
    easing.damp3(mesh.current.position, [x, y, z], 0.2, delta);
    mesh.current.scale.set(w, h, preset.depth);

    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.uBuffer.value = buffer.texture;
      mat.uniforms.uResolution.value.set(size.width, size.height);
      mat.uniforms.uPointer.value.set(pointer.x * 0.5 + 0.5, pointer.y * -0.5 + 0.5);

      const targetMix = pointerInRect(pointer, rect) ? 0.55 : 0;
      pointerMix.current += (targetMix - pointerMix.current) * Math.min(1, delta * 8);
      mat.uniforms.uPointerMix.value = pointerMix.current;
    }
  });

  if (!buffer) return null;

  return (
    <mesh ref={mesh} renderOrder={10}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={false}
        uniforms={uniforms}
        vertexShader={EDGE_GLASS_VERTEX}
        fragmentShader={EDGE_GLASS_FRAGMENT}
      />
    </mesh>
  );
}
