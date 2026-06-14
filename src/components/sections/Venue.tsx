import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Venue() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.from(".venue-copy", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
            x: 40,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
          });

          gsap.from(imageRef.current, {
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
            clipPath: "inset(12% 12% 12% 12% round 24px)",
            scale: 1.08,
            duration: 1.4,
            ease: "power3.out",
            clearProps: "clipPath",
          });

          gsap.to(imageRef.current, {
            y: -30,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        },
        "(max-width: 767px)": () => {
          gsap.from(".venue-copy", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });

          gsap.from(imageRef.current, {
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section id="venue" ref={sectionRef}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div
          ref={imageRef}
          className="order-2 overflow-hidden rounded-2xl border border-white/10 will-change-transform lg:order-1"
        >
          <img
            src="/house.png"
            alt="Venue in Whitefield"
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover sm:aspect-4/5"
          />
        </div>

        <div className="venue-copy order-1 lg:order-2">
          <SectionHeader
            eyebrow="Venue"
            title={
              <>
                A villa in <span className="hh-title-accent">Whitefield.</span>
              </>
            }
            description="Pool, terrace, and room to focus. On-site for both nights."
          />

          <dl className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:mt-10 sm:grid-cols-2 sm:gap-6 sm:pt-8">
            <div>
              <dt className="hh-label mb-1">When</dt>
              <dd className="text-sm text-white/88">July 11 – 12</dd>
            </div>
            <div>
              <dt className="hh-label mb-1">Capacity</dt>
              <dd className="text-sm text-white/88">Limited spots</dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  );
}
