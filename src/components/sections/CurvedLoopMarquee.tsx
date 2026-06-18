import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import CurvedLoop from "@/components/ui/curved-loop";

const MARQUEE_TEXT =
  "Osmosis Hacker House — Whitefield, Bangalore — July 25–26 — ";

function useCurveAmount() {
  const [curveAmount, setCurveAmount] = useState(240);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setCurveAmount(Math.min(240, Math.max(120, vw * 0.24)));
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
      aria-hidden
      className="relative z-20 -mt-2 -mb-10 overflow-visible border-y border-white/[0.06] bg-transparent pb-0 sm:-mt-3 sm:-mb-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(129,186,44,0.06),transparent_70%)]" />

      <CurvedLoop
        marqueeText={MARQUEE_TEXT}
        speed={1.5}
        curveAmount={curveAmount}
        direction="left"
        interactive
        reducedMotion={reducedMotion}
        containerClassName="relative z-10"
        svgClassName="normal-case"
        className="fill-white/[0.36] font-[family-name:'Geist_Variable',system-ui,sans-serif] font-medium tracking-[0.02em]"
      />
    </section>
  );
}
