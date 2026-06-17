import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import SparklesLogoWall from "@/components/mvpblocks/sparkles-logo";
import ChromaGrid, { type ChromaItem } from "@/components/ui/chroma-grid";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const partnerLogos = [
  { name: "Covalent", src: "/assets/logos/covalent.png", href: "https://covalent.xyz" },
  { name: "Google", src: "/assets/logos/google.png", href: "https://google.com" },
  { name: "Clueso", src: "/assets/logos/clueso.png", href: "https://clueso.io" },
  { name: "Supabase", src: "/assets/logos/supabase.png", href: "https://supabase.com" },
];

const mentors: ChromaItem[] = [
  {
    image: "/assets/mentors/mentor-1.png",
    title: "Mike romoff",
    subtitle: "EX- CRO , REDDIT",
    borderColor: "#EF4444",
    gradient: "linear-gradient(145deg, #EF4444, #000)",
  },
  {
    image: "/assets/mentors/mentor-2.png",
    title: "Cuy Sheffield",
    subtitle: "head of crypto visa labs",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
  },
  {
    image: "/assets/mentors/mentor-3.png",
    title: "James kaplan",
    subtitle: "cto of McKinsey and co tech",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
  },
];

export default function Mentors() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.from(".mentors-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        "(max-width: 767px)": () => {
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

      <div className="relative min-h-[460px]">
        <ChromaGrid
          items={mentors}
          radius={280}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>

      <SparklesLogoWall
        className="mt-10 pb-8 sm:mt-14"
        logos={partnerLogos}
        headline={
          <>
            <span className="text-[#a8d95a]/90">Backed by builders.</span>
            <br />
            <span>From teams that ship.</span>
          </>
        }
      />
    </Section>
  );
}
