import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import SpotlightCard from "../SpotlightCard";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { media } from "@/lib/breakpoints";
import { cn } from "@/lib/utils";

type ScheduleItem = {
  start: string;
  end: string;
  title: string;
  description: string;
};

type ScheduleDay = {
  dayLabel: string;
  dateLabel: string;
  location: string;
  items: ScheduleItem[];
};

const scheduleDays: ScheduleDay[] = [
  {
    dayLabel: "Day 1",
    dateLabel: "July 25",
    location: "Whitefield",
    items: [
      {
        start: "14:00",
        end: "15:00",
        title: "Arrival",
        description: "Land at the house, drop your bag, and find your corner.",
      },
      {
        start: "16:00",
        end: "18:00",
        title: "Kickoff",
        description: "Opening circle, team formation, and the frame for the weekend.",
      },
      {
        start: "18:30",
        end: "21:00",
        title: "Evening",
        description: "Dinner, intros, and the first collisions between builders.",
      },
      {
        start: "22:00",
        end: "02:00",
        title: "Night build",
        description: "Heads-down hours with mentors nearby when you need a push.",
      },
    ],
  },
  {
    dayLabel: "Day 2",
    dateLabel: "July 26",
    location: "Whitefield",
    items: [
      {
        start: "09:00",
        end: "09:30",
        title: "Standup",
        description: "A quick pulse across teams before the final push.",
      },
      {
        start: "12:00",
        end: "13:00",
        title: "Lunch",
        description: "Refuel and trade notes around the table.",
      },
      {
        start: "15:00",
        end: "17:00",
        title: "Demo prep",
        description: "Rehearse, polish, and lock the story you are shipping.",
      },
      {
        start: "18:00",
        end: "20:00",
        title: "Showcase",
        description: "Demo to the room. Ship what you built in 48 hours.",
      },
    ],
  },
];

function ScheduleItemTile({
  item,
  className,
}: {
  item: ScheduleItem;
  className?: string;
}) {
  return (
    <li className={cn("min-w-0", className)}>
      <SpotlightCard
        liquid={false}
        spotlightColor="rgba(168, 217, 90, 0.14)"
        className={cn(
          "h-full rounded-[20px] bg-white/[0.045] ring-1 ring-white/[0.06]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        )}
      >
        <div className="flex min-h-[8rem] flex-col justify-between p-5 sm:min-h-[8.5rem] sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-[family-name:'Geist_Variable',system-ui,sans-serif] text-[1.0625rem] font-semibold tabular-nums tracking-[-0.01em] text-[#f5f5f7]">
              {item.start}
            </p>
            <p className="shrink-0 text-[11px] font-medium tabular-nums text-[#636366]">
              {item.end}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-[#f5f5f7]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-[#98989d]">
              {item.description}
            </p>
          </div>
        </div>
      </SpotlightCard>
    </li>
  );
}

function ScheduleDayWidget({
  day,
  className,
}: {
  day: ScheduleDay;
  className?: string;
}) {
  return (
    <SpotlightCard
      liquid={false}
      spotlightColor="rgba(129, 186, 44, 0.2)"
      className={cn(
        "exp-card overflow-hidden rounded-[28px] border border-white/[0.09]",
        "bg-[linear-gradient(165deg,rgba(44,44,46,0.92)_0%,rgba(28,28,30,0.96)_100%)]",
        "shadow-[0_12px_40px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.08)]",
        "backdrop-blur-2xl",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-6 pt-6 pb-5 sm:px-7 sm:pt-7">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[#8e8e93] uppercase">
            {day.dayLabel}
          </p>
          <h3 className="mt-0.5 font-[family-name:'Geist_Variable',system-ui,sans-serif] text-[clamp(1.5rem,5vw,2.125rem)] font-semibold tracking-[-0.045em] text-[#f5f5f7]">
            {day.dateLabel}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-white/[0.07] px-3 py-1 text-[11px] font-medium tracking-[0.01em] text-[#aeaeb2] ring-1 ring-white/[0.06]">
          {day.location}
        </span>
      </header>

      <ul className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2 sm:gap-3.5 sm:px-6 sm:pb-6">
        {day.items.map((item) => (
          <ScheduleItemTile key={item.title} item={item} />
        ))}
      </ul>
    </SpotlightCard>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        [media.md]: () => {
          gsap.from(".exp-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
            y: 32,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          });

          gsap.from(".exp-card", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
            y: 40,
            opacity: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
          });
        },
        [media.maxMd]: () => {
          gsap.from(".exp-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
            y: 20,
            opacity: 0,
            duration: 0.65,
            ease: "power3.out",
          });

          gsap.from(".exp-card", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section
      id="schedule"
      ref={sectionRef}
      className="relative z-10 border-t-0"
      innerClassName="!pt-[clamp(2.25rem,1.5rem+3vw,3.75rem)]"
    >
      <SectionHeader
        className="exp-header mx-auto max-w-2xl text-center"
        align="center"
        eyebrow="Schedule"
        title={
          <>
            48 hours can change{" "}
            <span className="hh-title-accent">your build.</span>
          </>
        }
        description="Where builders converge in Whitefield for two days of shipping."
      />

      <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-4">
        {scheduleDays.map((day) => (
          <ScheduleDayWidget key={day.dayLabel} day={day} />
        ))}
      </div>
    </Section>
  );
}
