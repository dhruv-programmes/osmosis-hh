import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

interface ParallaxOptions {
  y?: number;
  x?: number;
  scale?: number;
  scrub?: number | boolean;
  trigger?: RefObject<HTMLElement | null>;
}

export function useParallax(
  ref: RefObject<HTMLElement | null>,
  {
    y = 0,
    x = 0,
    scale,
    scrub = 1.2,
    trigger,
  }: ParallaxOptions = {},
) {
  useGSAP(
    () => {
      if (!ref.current) return;

      const anim: gsap.TweenVars = {
        ease: "none",
        scrollTrigger: {
          trigger: trigger?.current ?? ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      };

      if (y) anim.y = y;
      if (x) anim.x = x;
      if (scale) anim.scale = scale;

      gsap.to(ref.current, anim);
    },
    { dependencies: [y, x, scale, scrub], scope: ref },
  );
}
