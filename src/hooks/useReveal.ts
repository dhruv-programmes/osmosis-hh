import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "@/lib/gsap";

interface RevealOptions {
  start?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  scale?: number;
  blur?: number;
}

export function useReveal(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  options: RevealOptions = {},
) {
  const {
    start = "top 72%",
    stagger = 0.1,
    y = 40,
    duration = 1,
    scale = 0.96,
    blur = 8,
  } = options;

  useGSAP(
    () => {
      gsap.from(selector, {
        scrollTrigger: {
          trigger: scope.current,
          start,
          toggleActions: "play none none reverse",
        },
        y,
        opacity: 0,
        scale,
        filter: `blur(${blur}px)`,
        duration,
        stagger,
        ease: "power3.out",
        clearProps: "filter",
      });
    },
    { scope },
  );
}

export function useLineReveal(
  scope: RefObject<HTMLElement | null>,
  selector: string,
) {
  useGSAP(
    () => {
      gsap.from(selector, {
        scrollTrigger: {
          trigger: scope.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        duration: 1.2,
        ease: "power2.inOut",
        transformOrigin: "left center",
      });
    },
    { scope },
  );
}
