import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import Grainient from "../Grainient";
import Section from "../Section";
import { registerGrainient } from "../grainientConfig";
import { gsap } from "@/lib/gsap";
import { spring } from "@/lib/motion";

export default function RegisterCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section id="register" ref={sectionRef}>
      <div className="cta-panel relative overflow-hidden rounded-2xl border border-white/[0.07]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Grainient {...registerGrainient} className="size-full" />
          <div className="absolute inset-0 bg-hh-bg/55" />
        </div>

        <div className="cta-content relative z-10 mx-auto max-w-xl px-5 py-10 text-center sm:px-8 sm:py-14 md:py-16">
          <p className="hh-eyebrow mb-4">Register</p>
          <h2 className="hh-title mb-5">
            Grab your <span className="hh-title-accent">pass.</span>
          </h2>
          <p className="hh-body mb-8 text-pretty">
            Limited spots for builders ready to ship over 48 hours in Whitefield.
            Send a short note about what you are building.
          </p>

          <motion.a
            href="mailto:hello@osmosis.dev?subject=Osmosis%20Hacker%20House"
            className="touch-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 sm:w-auto"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 40px rgba(255,255,255,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
          >
            Send application
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </motion.a>
        </div>
      </div>
    </Section>
  );
}
