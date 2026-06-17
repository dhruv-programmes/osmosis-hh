import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      const el = spotlightRef.current;
      if (!el || reduceMotion) return;

      const spot = { x: 28, y: 52 };
      const spot2 = { x: 72, y: 38 };

      const apply = () => {
        el.style.setProperty("--spot-x", `${spot.x}%`);
        el.style.setProperty("--spot-y", `${spot.y}%`);
        el.style.setProperty("--spot-x2", `${spot2.x}%`);
        el.style.setProperty("--spot-y2", `${spot2.y}%`);
      };

      apply();

      gsap
        .timeline({
          repeat: -1,
          defaults: { ease: "sine.inOut" },
          onUpdate: apply,
        })
        .to(spot, { x: 68, y: 34, duration: 8 })
        .to(spot2, { x: 38, y: 62, duration: 7 }, "<")
        .to(spot, { x: 52, y: 68, duration: 7 })
        .to(spot2, { x: 82, y: 48, duration: 8 }, "<")
        .to(spot, { x: 22, y: 42, duration: 8 })
        .to(spot2, { x: 58, y: 28, duration: 7 }, "<");
    },
    { scope: rootRef, dependencies: [reduceMotion] },
  );

  const wordmarkClass =
    "select-none text-center font-sans text-[clamp(4rem,19vw,13.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.045em]";

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden border-t border-white/[0.06] pb-[max(1.5rem,var(--safe-bottom))]"
    >
      <div className="hh-container pt-10 sm:pt-12">
        <p className="text-center text-sm text-white/55 text-pretty">
          Osmosis Hacker House · Whitefield · July 11 – 12
        </p>
      </div>

      <div
        ref={spotlightRef}
        className="relative mt-8 overflow-hidden sm:mt-10"
        style={
          {
            "--spot-x": "50%",
            "--spot-y": "50%",
            "--spot-x2": "65%",
            "--spot-y2": "40%",
          } as CSSProperties
        }
      >
        <div className="pointer-events-none translate-y-[12%] sm:translate-y-[14%]">
          <div className="relative mx-auto w-full max-w-[100vw] px-[var(--section-px)]">
            <p className={wordmarkClass} aria-hidden>
              <span className="text-white/[0.045]">OSMOSIS</span>
            </p>

            <p
              className={`${wordmarkClass} absolute inset-x-[var(--section-px)] top-0 mx-auto bg-clip-text text-transparent`}
              style={{
                backgroundImage: `
                  radial-gradient(
                    ellipse 42% 58% at var(--spot-x) var(--spot-y),
                    rgba(255, 255, 255, 0.95) 0%,
                    rgba(255, 255, 255, 0.28) 28%,
                    transparent 62%
                  ),
                  radial-gradient(
                    ellipse 36% 48% at var(--spot-x2) var(--spot-y2),
                    rgba(129, 186, 44, 0.55) 0%,
                    rgba(129, 186, 44, 0.12) 32%,
                    transparent 58%
                  )
                `,
              }}
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
