import {
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useEffect, useState } from "react";
import { MISSION_COPY } from "@/lib/missionCopy";
import {
  getStatsCountTrigger,
  useTextRevealProgress,
} from "@/components/ui/text-reveal";
import CountUp from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

const stats = [
  { to: 16, label: "Elite Builders" },
  { to: 5, label: "Tracks And Events" },
  { to: 3, label: "Keynote Speakers" },
  { to: 10, label: "Venture Capitalist" },
] as const;

/** Start count-up when "COMES" begins revealing (last two words: COMES NEXT). */
const COUNT_START = getStatsCountTrigger(MISSION_COPY, "COMES");
const COUNT_DURATION = 1.5;
const COUNT_STAGGER = 0.12;

const geist = "font-[family-name:'Geist_Variable',system-ui,sans-serif]";

const valueClass = cn(
  geist,
  "text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-white",
);

export function MissionStats() {
  const progress = useTextRevealProgress();
  const reduceMotion = useReducedMotion();

  if (!progress) return null;

  return (
    <MissionStatsAnimated progress={progress} reduceMotion={reduceMotion ?? false} />
  );
}

function MissionStatsAnimated({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const [countActive, setCountActive] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setCountActive(true);
      return;
    }
    if (progress.get() >= COUNT_START) {
      setCountActive(true);
    }
  }, [progress, reduceMotion]);

  useMotionValueEvent(progress, "change", (p) => {
    if (p >= COUNT_START) {
      setCountActive(true);
    }
  });

  return (
    <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <p
            className={cn(
              valueClass,
              "inline-flex items-baseline justify-center gap-0",
            )}
          >
            {reduceMotion ? (
              <>
                {stat.to}
                <span>+</span>
              </>
            ) : (
              <>
                <CountUp
                  to={stat.to}
                  duration={COUNT_DURATION}
                  delay={index * COUNT_STAGGER}
                  startWhen={countActive}
                  waitForInView={false}
                />
                <span>+</span>
              </>
            )}
          </p>
          <p
            className={cn(
              geist,
              "mt-1.5 text-[0.8125rem] font-semibold text-zinc-400 sm:mt-2 sm:text-sm",
            )}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
