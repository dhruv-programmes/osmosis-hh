import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import ChromaGrid, { type ChromaItem } from "@/components/ui/chroma-grid";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { media } from "@/lib/breakpoints";

const mentors: ChromaItem[] = [
  {
    image: "/assets/mentors/mentor-2-upscaled.png",
    title: "Cuy Sheffield",
    subtitle: "Head of Crypto Visa Labs",
  },
  {
    image: "/assets/mentors/mentor-3.png",
    title: "James Kaplan",
    subtitle: "CTO @ McKinsey Tech",
  },
];

export default function Mentors() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        [media.md]: () => {
          gsap.from(".mentors-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        [media.maxMd]: () => {
          gsap.from(".mentors-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section ref={sectionRef} id="mentors" scrim>
      <SectionHeader
        className="mentors-header mb-8 text-center sm:mb-10"
        align="center"
        eyebrow="Mentors"
        title={
          <>
            Learn from <span className="hh-title-accent">builders.</span>
          </>
        }
        description="Industry leaders on hand for feedback, direction, and the occasional hard truth."
      />

      <div className="relative mx-auto w-full max-w-6xl px-1 sm:px-2">
        <ChromaGrid items={mentors} />
      </div>
    </Section>
  );
}
