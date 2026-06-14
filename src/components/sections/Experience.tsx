import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import ScrollStack, { ScrollStackItem } from "../ScrollStack";
import SectionHeader from "../SectionHeader";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const pillars = [
  { title: "Build", body: "Ship what you're working on." },
  { title: "Meet", body: "Small group. No stage." },
  { title: "Ship", body: "Demo on day two." },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.from(".exp-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        "(max-width: 767px)": () => {
          gsap.from(".exp-header", {
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
    <section
      ref={sectionRef}
      id="experience"
      className="relative border-t border-white/[0.06]"
    >
      <div className="hh-container relative pt-[var(--section-py)]">
        <SectionHeader
          className="exp-header mx-auto mb-4 text-center sm:mb-6"
          align="center"
          eyebrow="Experience"
          title={
            <>
              Build for <span className="hh-title-accent">48 hours.</span>
            </>
          }
        />
      </div>

      <ScrollStack
        useWindowScroll
        itemDistance={48}
        itemStackDistance={18}
        baseScale={0.96}
        blurAmount={0}
        stackPosition="18%"
      >
        {pillars.map((pillar, i) => (
          <ScrollStackItem key={pillar.title}>
            <span className="mb-4 block font-serif text-lg text-white/70 sm:mb-5 sm:text-xl">
              0{i + 1}
            </span>
            <h3 className="mb-2 text-xl font-medium text-white sm:text-2xl">
              {pillar.title}
            </h3>
            <p className="text-[length:var(--text-body)] text-white/85">
              {pillar.body}
            </p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
