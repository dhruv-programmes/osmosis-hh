import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import CurvedLoop from "@/components/ui/curved-loop";

const MARQUEE_TEXT =
  "Osmosis Hacker House — Whitefield, Bangalore — July 25–26 — ";

function useCurveAmount() {
  const [curveAmount, setCurveAmount] = useState(88);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setCurveAmount(Math.min(88, Math.max(56, vw * 0.1)));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return curveAmount;
}

export default function CurvedLoopMarquee() {
  const reducedMotion = useReducedMotion() ?? false;
  const curveAmount = useCurveAmount();

  return (
    <section
      aria-label="Event location and dates"
      className="relative z-20 overflow-x-clip overflow-y-visible border-y border-white/[0.06] bg-transparent py-2 sm:py-3"
    >
      <p className="sr-only">
        Osmosis Hacker House, Whitefield Bangalore, July 25–26, 2026
      </p>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(129,186,44,0.06),transparent_70%)]" />

      <CurvedLoop
        marqueeText={MARQUEE_TEXT}
        speed={1.5}
        curveAmount={curveAmount}
        direction="left"
        interactive
        reducedMotion={reducedMotion}
        containerClassName="relative z-10"
        svgClassName="normal-case font-bold"
        className="fill-white/[0.5] font-[family-name:'Geist_Variable',system-ui,sans-serif] font-bold tracking-[0.02em] md:fill-white/[0.44]"
      />
    </section>
  );
}
