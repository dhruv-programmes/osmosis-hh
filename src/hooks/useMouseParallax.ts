import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useMouseParallax(strength = 1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 26 });
  const springY = useSpring(y, { stiffness: 120, damping: 26 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * strength);
      y.set((e.clientY / window.innerHeight - 0.5) * strength);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, strength]);

  return { x: springX, y: springY };
}
