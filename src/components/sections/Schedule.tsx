import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import GlassPanel from "../glass/GlassPanel";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const schedule = [
  {
    day: "Day 1",
    date: "July 11",
    items: [
      { time: "14:00", title: "Arrival" },
      { time: "16:00", title: "Kickoff" },
      { time: "18:30", title: "Evening" },
      { time: "22:00", title: "Night build" },
    ],
  },
  {
    day: "Day 2",
    date: "July 12",
    items: [
      { time: "09:00", title: "Standup" },
      { time: "12:00", title: "Lunch" },
      { time: "15:00", title: "Demo prep" },
      { time: "18:00", title: "Showcase" },
    ],
  },
];

export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = {
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        ease: "power3.out" as const,
      };

      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.from(".sched-header", {
            ...trigger,
            y: 40,
            opacity: 0,
            duration: 1,
          });

          gsap.from(".sched-card", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
            y: 50,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
          });

          gsap.from(".sched-item", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
            x: -16,
            opacity: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.3,
          });
        },
        "(max-width: 767px)": () => {
          gsap.from(".sched-header", {
            ...trigger,
            y: 24,
            opacity: 0,
            duration: 0.7,
          });

          gsap.from(".sched-card", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
            y: 28,
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
    <Section id="schedule" ref={sectionRef}>
      <SectionHeader
        className="sched-header mx-auto text-center"
        align="center"
        eyebrow="Schedule"
        title={
          <>
            Two days. <span className="hh-title-accent">One flow.</span>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        {schedule.map((day) => (
          <GlassPanel key={day.day} className="sched-card p-5 sm:p-8">
            <div className="mb-6 border-b border-white/10 pb-4 sm:mb-8 sm:pb-5">
              <p className="hh-label">{day.day}</p>
              <h3 className="mt-1 font-serif text-xl text-white sm:text-2xl">
                {day.date}
              </h3>
            </div>

            <ul className="space-y-4 sm:space-y-5">
              {day.items.map((item) => (
                <li
                  key={item.title}
                  className="sched-item flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5"
                >
                  <span className="w-auto shrink-0 text-sm tabular-nums text-white/75 sm:w-14">
                    {item.time}
                  </span>
                  <span className="font-medium text-white">{item.title}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        ))}
      </div>
    </Section>
  );
}
