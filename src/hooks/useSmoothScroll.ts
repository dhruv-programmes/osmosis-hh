import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const scrollFrameCallbacks = new Set<(time: number) => void>();

export function subscribeScrollFrame(callback: (time: number) => void) {
  scrollFrameCallbacks.add(callback);
  return () => scrollFrameCallbacks.delete(callback);
}

export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    const onTick = (time: number) => {
      scrollFrameCallbacks.forEach((callback) => callback(time * 1000));
    };

    if (reducedMotion) {
      gsap.ticker.add(onTick);
      refresh();
      document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);

      return () => {
        gsap.ticker.remove(onTick);
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
      lerp: 0.14,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onLenisTick = (time: number) => {
      lenis.raf(time * 1000);
      onTick(time);
    };

    gsap.ticker.add(onLenisTick);
    gsap.ticker.lagSmoothing(0);

    refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      gsap.ticker.remove(onLenisTick);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      lenis.destroy();
    };
  }, []);
}
