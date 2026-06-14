import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import GlassButton from "../GlassButton";
import Grainient from "../Grainient";
import { heroGrainient } from "../grainientConfig";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
      const meta = metaRef.current;
      const cta = ctaRef.current;
      const bg = bgRef.current;

      const revealAll = () => {
        gsap.set([...lines, meta, cta, bg], {
          clearProps: "transform,opacity,filter",
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
        });
      };

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        revealAll();
        return;
      }

      const fallback = window.setTimeout(revealAll, 2500);

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          window.clearTimeout(fallback);
          revealAll();
        },
      });

      tl.from(bg, { opacity: 0, duration: 1.4, ease: "power2.out" }, 0)
        .from(lines, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.15)
        .from(meta, { opacity: 0, y: 16, duration: 0.8 }, 0.55)
        .from(cta, { opacity: 0, y: 20, scale: 0.94, duration: 0.7 }, 0.75);

      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.to(contentRef.current, {
            y: -60,
            opacity: 0,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "60% top",
              scrub: 1,
            },
          });
        },
        "(max-width: 767px)": () => {
          gsap.to(contentRef.current, {
            y: -24,
            opacity: 0.35,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "50% top",
              scrub: 0.8,
            },
          });
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden pt-[calc(4.5rem+var(--safe-top))] pb-[max(2rem,var(--safe-bottom))]"
    >
      <div ref={bgRef} className="hero-bg absolute inset-0" aria-hidden>
        <Grainient {...heroGrainient} className="absolute inset-0" />
        <img
          src="/house.png"
          alt=""
          width={1920}
          height={1280}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.72] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/82 via-black/68 to-hh-bg" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-4xl flex-col items-center px-[var(--section-px)] text-center"
      >
        <h1 className="w-full font-serif leading-[0.92] tracking-tight drop-shadow-[0_4px_32px_rgba(0,0,0,0.6)]">
          <span className="hero-mask-line block overflow-hidden pb-1">
            <span
              ref={(el) => {
                lineRefs.current[0] = el;
              }}
              className="hero-line hero-line--display block text-white"
            >
              Osmosis
            </span>
          </span>
          <span className="hero-mask-line block overflow-hidden">
            <span
              ref={(el) => {
                lineRefs.current[1] = el;
              }}
              className="hero-line hero-line--sub block text-white/90"
            >
              Hacker House
            </span>
          </span>
        </h1>

        <p
          ref={metaRef}
          className="hero-meta mt-6 text-balance tracking-[0.18em] text-white/80 uppercase drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:mt-8 sm:tracking-[0.35em]"
        >
          July 11 – 12 · Whitefield
        </p>

        <div ref={ctaRef} className="hero-cta mt-8 sm:mt-10">
          <GlassButton primary href="#register" label="Apply" />
        </div>
      </div>
    </section>
  );
}
