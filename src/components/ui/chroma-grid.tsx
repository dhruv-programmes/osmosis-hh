import { useRef, useEffect, type CSSProperties, type MouseEventHandler, type PointerEvent } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { media } from "@/lib/breakpoints";
import { gsap } from "@/lib/gsap";

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

const CHROMA_GREEN = {
  borderColor: "#81BA2C",
  gradient: "linear-gradient(145deg, #4A7C1C, #000)",
} as const;

export default function ChromaGrid({
  items,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items ?? [];
  const isMobile = useMediaQuery(media.maxMd);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardMove: MouseEventHandler<HTMLElement> = (e) => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative flex h-full w-full flex-wrap items-stretch justify-center gap-3 ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--x": "50%",
          "--y": "50%",
        } as CSSProperties
      }
    >
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          className="group relative flex h-auto min-h-0 w-full max-w-[300px] max-md:max-w-none cursor-pointer flex-col overflow-hidden rounded-[20px] transition-colors duration-300"
          style={
            {
              "--card-border": CHROMA_GREEN.borderColor,
              background: CHROMA_GREEN.gradient,
              "--spotlight-color": "rgba(168, 217, 90, 0.35)",
            } as CSSProperties
          }
        >
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
            }}
          />
          <div className="relative z-10 shrink-0 p-2.5 pb-0">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-black max-md:aspect-[3/4]">
              <img
                src={c.image}
                alt={c.title}
                width={400}
                height={500}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
          <footer className="relative z-10 flex min-h-[88px] flex-1 flex-col justify-end gap-1 p-3 font-sans text-white">
            <h3 className="m-0 text-[1.05rem] font-semibold leading-tight">{c.title}</h3>
            {c.handle ? (
              <span className="text-[0.95rem] opacity-80">{c.handle}</span>
            ) : null}
            <p className="m-0 line-clamp-2 text-[0.85rem] leading-snug opacity-85">{c.subtitle}</p>
            {c.location ? (
              <span className="text-[0.85rem] opacity-85">{c.location}</span>
            ) : null}
          </footer>
        </article>
      ))}
      {!isMobile ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              backdropFilter: "grayscale(1) brightness(0.78)",
              WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
              background: "rgba(0,0,0,0.001)",
              maskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
              WebkitMaskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
            }}
          />
          <div
            ref={fadeRef}
            className="pointer-events-none absolute inset-0 z-40 transition-opacity duration-[250ms]"
            style={{
              backdropFilter: "grayscale(1) brightness(0.78)",
              WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
              background: "rgba(0,0,0,0.001)",
              maskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
              opacity: 1,
            }}
          />
        </>
      ) : null}
    </div>
  );
}
