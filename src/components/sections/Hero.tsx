import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import GlassButton from "../GlassButton";
import Grainient from "../Grainient";
import Sponsors from "./Sponsors";
import { MorphingText } from "@/components/ui/morphing-text";
import { heroGrainient } from "../grainientConfig";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { media } from "@/lib/breakpoints";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      const cta = ctaRef.current;
      const bg = bgRef.current;

      if (!title || !cta || !bg) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        bg,
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: "power2.out" },
        0,
      )
        .fromTo(
          title,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.4,
        )
        .fromTo(
          cta,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          0.75,
        );

      ScrollTrigger.matchMedia({
        [media.md]: () => {
          gsap.to(contentRef.current, {
            y: -36,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "65% top",
              scrub: 1.2,
            },
          });
        },
        [media.maxMd]: () => {
          gsap.to(contentRef.current, {
            y: -20,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "55% top",
              scrub: 1,
            },
          });
        },
      });
    },
    { scope: containerRef, revertOnUpdate: false },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-svh flex-col overflow-hidden pt-[calc(7rem+var(--safe-top))] pb-0 sm:pt-[calc(7.5rem+var(--safe-top))]"
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
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-[var(--section-px)] text-center"
      >
        <h1 ref={titleRef} className="mt-4 w-full sm:mt-6">
          <MorphingText
            texts={["Osmosis", "Hacker House"]}
            className="font-serif h-auto min-h-[1.1em] w-full max-w-4xl text-[length:var(--text-display)] leading-[0.92] font-normal tracking-tight text-[#fafafa] drop-shadow-[0_4px_32px_rgba(0,0,0,0.6)]"
          />
        </h1>

        <div ref={ctaRef} className="hero-cta mt-8 sm:mt-10">
          <GlassButton href="#register" label="Apply" />
        </div>
      </div>

      <Sponsors className="relative z-10 mb-0 w-full shrink-0" />
    </section>
  );
}
