import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import VenueDatesWidget from "./VenueDatesWidget";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Venue() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.from(".venue-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
            y: 32,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });

          gsap.from(visualRef.current, {
            scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
            y: 36,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.1,
          });
        },
        "(max-width: 767px)": () => {
          gsap.from(".venue-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });

          gsap.from(visualRef.current, {
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.08,
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section id="venue" ref={sectionRef}>
      <div className="venue-header">
        <SectionHeader
          eyebrow="Venue"
          title={
            <>
              A villa in <span className="hh-title-accent">Whitefield.</span>
            </>
          }
          description="Pool, terrace, and room to focus. On-site for both nights."
        />
      </div>

      <div
        ref={visualRef}
        className="mt-8 grid items-stretch gap-6 sm:mt-10 lg:grid-cols-2 lg:gap-8"
      >
        <div className="h-full min-h-64 overflow-hidden rounded-2xl border border-white/10 lg:min-h-0">
          <img
            src="/house.png"
            alt="Venue in Whitefield"
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <VenueDatesWidget className="h-full" />
      </div>
    </Section>
  );
}
