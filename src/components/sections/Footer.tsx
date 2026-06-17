import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";

type SetterFn = (v: number | string) => void;

/** Same dispersed feather as ChromaGrid fadeRef — not a hard circle. */
const CHROMA_REVEAL_MASK =
  "radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.32) 88%, transparent 100%)";

const CHROMA_COLOR_BG =
  "linear-gradient(112deg, #EF4444 0%, #81ba2c 28%, #3B82F6 56%, #a8d95a 78%, #EF4444 100%)";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const colorTextRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hoveringRef = useRef(false);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const applySpot = useCallback(() => {
    setX.current?.(pos.current.x);
    setY.current?.(pos.current.y);
  }, []);

  const moveTo = useCallback(
    (x: number, y: number, duration = 0.45) => {
      gsap.to(pos.current, {
        x,
        y,
        duration,
        ease: "power3.out",
        onUpdate: applySpot,
        overwrite: true,
      });
    },
    [applySpot],
  );

  const startAutoAnimation = useCallback(() => {
    const el = spotlightRef.current;
    if (!el || reduceMotion) return;

    const { width, height } = el.getBoundingClientRect();

    timelineRef.current?.kill();
    gsap.killTweensOf(pos.current);

    const timeline = gsap
      .timeline({
        repeat: -1,
        defaults: { ease: "sine.inOut" },
        onUpdate: applySpot,
      })
      .to(pos.current, { x: width * 0.78, y: height * 0.42, duration: 2.6 })
      .to(pos.current, { x: width * 0.58, y: height * 0.68, duration: 2.2 })
      .to(pos.current, { x: width * 0.32, y: height * 0.36, duration: 2.4 })
      .to(pos.current, { x: width * 0.22, y: height * 0.54, duration: 2 });

    timelineRef.current = timeline;
  }, [applySpot, reduceMotion]);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el || reduceMotion) return;

    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;

    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width * 0.22, y: height * 0.54 };
    applySpot();
  }, [applySpot, reduceMotion]);

  useGSAP(
    () => {
      const el = spotlightRef.current;
      const colorEl = colorTextRef.current;
      if (!el || reduceMotion) return;

      pos.current = {
        x: el.getBoundingClientRect().width * 0.22,
        y: el.getBoundingClientRect().height * 0.54,
      };
      applySpot();

      if (colorEl) {
        gsap.to(colorEl, {
          backgroundPosition: "200% 50%",
          duration: 10,
          ease: "none",
          repeat: -1,
        });
      }

      startAutoAnimation();

      return () => {
        timelineRef.current?.kill();
        timelineRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [reduceMotion, applySpot, startAutoAnimation] },
  );

  const handlePointerEnter = () => {
    hoveringRef.current = true;
    timelineRef.current?.pause();
    gsap.killTweensOf(pos.current);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = spotlightRef.current;
    if (!el || !hoveringRef.current) return;

    const rect = el.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top, 0.35);
  };

  const handlePointerLeave = () => {
    hoveringRef.current = false;
    startAutoAnimation();
  };

  const wordmarkClass =
    "select-none text-center font-sans text-[clamp(4rem,19vw,13.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.045em]";

  const chromaVars = {
    "--r": "220px",
    "--x": "0px",
    "--y": "0px",
  } as CSSProperties;

  const chromaMaskStyle: CSSProperties = reduceMotion
    ? {}
    : {
        backgroundImage: CHROMA_COLOR_BG,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        maskImage: CHROMA_REVEAL_MASK,
        WebkitMaskImage: CHROMA_REVEAL_MASK,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      };

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden border-t border-white/[0.06] pb-[max(1.5rem,var(--safe-bottom))]"
    >
      <div
        ref={spotlightRef}
        className="relative min-h-[clamp(7rem,22vw,12rem)] overflow-hidden pt-10 sm:pt-12"
        style={chromaVars}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="pointer-events-none translate-y-[12%] sm:translate-y-[14%]">
          <div className="relative mx-auto w-full max-w-[100vw] px-[var(--section-px)]">
            {!reduceMotion ? (
              <div
                aria-hidden
                className="pointer-events-none absolute z-0"
                style={{
                  left: "var(--x)",
                  top: "var(--y)",
                  width: "var(--r)",
                  height: "var(--r)",
                  transform: "translate(-50%, -50%)",
                  background: CHROMA_COLOR_BG,
                  backgroundSize: "200% 100%",
                  maskImage: CHROMA_REVEAL_MASK,
                  WebkitMaskImage: CHROMA_REVEAL_MASK,
                  filter: "blur(28px)",
                  opacity: 0.55,
                }}
              />
            ) : null}

            <p className={`${wordmarkClass} relative z-10 grayscale`} aria-hidden>
              <span className="text-white/[0.12]">OSMOSIS</span>
            </p>

            <p
              ref={colorTextRef}
              className={`${wordmarkClass} absolute inset-x-[var(--section-px)] top-0 z-20 mx-auto`}
              style={chromaMaskStyle}
              aria-hidden
            >
              OSMOSIS
            </p>

            <h2 className="sr-only">OSMOSIS</h2>
          </div>
        </div>
      </div>
    </footer>
  );
}
