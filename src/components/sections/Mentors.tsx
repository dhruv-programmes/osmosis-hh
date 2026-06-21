import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import ChromaGrid, { type ChromaItem } from "@/components/ui/chroma-grid";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { media } from "@/lib/breakpoints";

const mentors: ChromaItem[] = [
  {
    image: "/assets/mentors/mentor-1.png",
    title: "Mike romoff",
    subtitle: "EX- CRO , REDDIT",
    borderColor: "#EF4444",
    gradient: "linear-gradient(145deg, #EF4444, #000)",
  },
  // {
  //   image: "/assets/mentors/mentor-2.png",
  //   title: "Cuy Sheffield",
  //   subtitle: "Head of Crypto Visa Labs",
  //   borderColor: "#10B981",
  //   gradient: "linear-gradient(180deg, #10B981, #000)",
  // },
  {
    image: "/assets/mentors/mentor-3.png",
    title: "James kaplan",
    subtitle: "CTO of McKinsey and Co Tech",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
  },
];

function useSpotlightRadius() {
  const [radius, setRadius] = useState(280);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setRadius(Math.min(280, Math.max(140, vw * 0.4)));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return radius;
}

export default function Mentors() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRadius = useSpotlightRadius();

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

      <div className="relative">
        <ChromaGrid
          items={mentors}
          radius={spotlightRadius}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>
    </Section>
  );
}
