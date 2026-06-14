import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePixelDustCanvas } from "../../pixel/PixelDustContext";

export default function BackgroundScene() {
  const { canvas } = usePixelDustCanvas();
  const { viewport } = useThree();
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const texture = useMemo(() => {
    if (!canvas) return null;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    textureRef.current = t;
    return t;
  }, [canvas]);

  useFrame(() => {
    if (textureRef.current) textureRef.current.needsUpdate = true;
  });

  if (!texture) {
    return (
      <mesh position={[0, 0, -5]} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#080809" />
      </mesh>
    );
  }

  return (
    <group>
      <mesh position={[0, 0, -6]} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#080809" />
      </mesh>
      <mesh position={[0, 0, -5]} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
