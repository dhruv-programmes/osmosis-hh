import { useReducedMotion } from "motion/react";
import CurvedLoop from "@/components/ui/curved-loop";

const MARQUEE_TEXT =
  "Osmosis Hacker House — Whitefield, Bangalore — July 25–26 — ";

export default function CurvedLoopMarquee() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-hidden
      className="relative -mt-2 border-y border-white/[0.06] bg-hh-bg py-0.5 sm:-mt-3 sm:py-1"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(129,186,44,0.06),transparent_70%)]" />

      <CurvedLoop
        marqueeText={MARQUEE_TEXT}
        speed={1.5}
        curveAmount={240}
        direction="left"
        interactive
        reducedMotion={reducedMotion}
        containerClassName="relative z-10"
        svgClassName="aspect-[100/10] normal-case"
        className="fill-white/[0.36] font-[family-name:'Geist_Variable',system-ui,sans-serif] font-medium tracking-[0.02em]"
      />
    </section>
  );
}
