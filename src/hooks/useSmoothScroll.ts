import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { media } from "@/lib/breakpoints";
import {
  handleHashLinkClick,
  setLenisScrollHandler,
} from "@/lib/scrollToSection";

const scrollFrameCallbacks = new Set<(time: number) => void>();

export function subscribeScrollFrame(callback: (time: number) => void) {
  scrollFrameCallbacks.add(callback);
  return () => scrollFrameCallbacks.delete(callback);
}

function createDebouncedRefresh(delayMs = 150) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
      timeoutId = undefined;
    }, delayMs);
  };
}

export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia(media.maxMd).matches;
    const debouncedRefresh = createDebouncedRefresh();

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    const onTick = (time: number) => {
      scrollFrameCallbacks.forEach((callback) => callback(time * 1000));
    };

    document.addEventListener("click", handleHashLinkClick);

    if (reducedMotion || isMobile) {
      setLenisScrollHandler(null);

      let scrollTicking = false;
      const onNativeScroll = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
          ScrollTrigger.update();
          scrollTicking = false;
        });
      };

      gsap.ticker.add(onTick);
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      refresh();
      document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
      window.addEventListener("resize", debouncedRefresh);

      return () => {
        document.removeEventListener("click", handleHashLinkClick);
        gsap.ticker.remove(onTick);
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", debouncedRefresh);
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
      lerp: 0.14,
      syncTouch: false,
      syncTouchLerp: 0.1,
    });

    setLenisScrollHandler((target, options) => {
      lenis.scrollTo(target, options);
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onLenisTick = (time: number) => {
      lenis.raf(time * 1000);
      onTick(time);
    };

    gsap.ticker.add(onLenisTick);
    gsap.ticker.lagSmoothing(500, 33);

    refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", debouncedRefresh);

    return () => {
      document.removeEventListener("click", handleHashLinkClick);
      setLenisScrollHandler(null);
      gsap.ticker.remove(onLenisTick);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", debouncedRefresh);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      lenis.destroy();
    };
  }, []);
}
