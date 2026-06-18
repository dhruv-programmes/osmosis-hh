import { media } from "@/lib/breakpoints";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useScroll } from "motion/react";
import {
  PIXEL_DUST_STACKING,
} from "../pixel/pixelDustConfig";
import { StackingCard } from "../StackingCard";
import type PixelBlastComponent from "../PixelBlast";

const projects = [
  {
    title: "The Builders",
    description:
      "The best projects are rarely built alone.\n\nMeet founders launching startups, engineers building products, designers shaping experiences, and hackers exploring new ideas. Every person in the room is selected for one reason: they're actively creating.",
    cta: "See who's building",
    href: "#register",
    link: "https://images.unsplash.com/photo-1605106702842-01a887a31122?q=80&w=500&auto=format&fit=crop",
    color: "#5196fd",
  },
  {
    title: "The Mentors",
    description:
      "Learn from people who have already walked the path.\n\nFounders, operators, investors, and technical leaders will be available throughout the house for feedback, guidance, and high-signal conversations.",
    cta: "Meet the mentors",
    href: "#mentors",
    link: "https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=500&auto=format&fit=crop&q=60",
    color: "#8f89ff",
  },
  {
    title: "The Experience",
    description:
      "No stages. No endless presentations.\n\nSpend two days immersed in deep work, spontaneous collaboration, mentorship sessions, and conversations that continue long after midnight.",
    cta: "Explore the schedule",
    href: "#schedule",
    link: "https://images.unsplash.com/photo-1605106901227-991bd663255c?w=500&auto=format&fit=crop",
    color: "#13006c",
  },
  {
    title: "The Projects",
    description:
      "Ideas become prototypes.\n\nPrototypes become products.\n\nProducts become companies.\n\nUse the house to launch something you've been putting off for months or start something entirely new.",
    cta: "See what gets built",
    href: "#schedule",
    link: "https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60",
    color: "#ed649e",
  },
  {
    title: "The Community",
    description:
      "The event ends.\n\nThe relationships don't.\n\nFind future co-founders, teammates, collaborators, and friends among a carefully curated group of builders from across Bangalore's startup ecosystem.",
    cta: "Join the house",
    href: "#register",
    link: "https://images.unsplash.com/photo-1506792006437-256b665541e2?w=500&auto=format&fit=crop",
    color: "#fd521a",
  },
];

function getStackingDustConfig(): typeof PIXEL_DUST_STACKING | null {
  if (typeof window === "undefined") return PIXEL_DUST_STACKING;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (window.matchMedia(media.maxMd).matches) return null;
  return PIXEL_DUST_STACKING;
}

function DeferredPixelBlast({
  config,
  className,
}: {
  config: typeof PIXEL_DUST_STACKING;
  className: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [PixelBlast, setPixelBlast] = useState<typeof PixelBlastComponent | null>(
    null,
  );

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "240px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    import("../PixelBlast").then((mod) => setPixelBlast(() => mod.default));
  }, [inView]);

  const Blast = PixelBlast as ComponentType<
    typeof PIXEL_DUST_STACKING & {
      liquid?: boolean;
      transparent?: boolean;
      autoPauseOffscreen?: boolean;
      className?: string;
    }
  >;

  return (
    <div ref={hostRef} className={className}>
      {Blast ? (
        <Blast
          key={`stacking-${config.variant}-${config.patternDensity}`}
          {...config}
          liquid={false}
          transparent={false}
          autoPauseOffscreen
          className="h-full w-full"
        />
      ) : null}
    </div>
  );
}

export default function StackingCards() {
  const container = useRef<HTMLElement>(null);
  const [dustConfig, setDustConfig] = useState(getStackingDustConfig);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia(media.maxMd);

    const update = () => setDustConfig(getStackingDustConfig());

    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, []);

  return (
    <section ref={container} id="about" className="relative w-full text-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        {dustConfig ? (
          <DeferredPixelBlast
            config={dustConfig}
            className="h-full w-full"
          />
        ) : (
          <div className="h-full w-full bg-slate-950" />
        )}
        <div className="absolute inset-0 bg-slate-950/78" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_8%,#020617_88%)]" />
      </div>

      <div className="relative z-10 max-md:px-[var(--section-px)] max-md:pb-10 max-md:pt-6">
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.05;

          return (
            <StackingCard
              key={project.title}
              i={i}
              url={project.link}
              title={project.title}
              color={project.color}
              description={project.description}
              cta={project.cta}
              href={project.href}
              sectionProgress={scrollYProgress}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}
