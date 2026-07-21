import { type CSSProperties, type MouseEventHandler } from "react";

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

const CHROMA_GREEN = {
  borderColor: "#81BA2C",
  gradient: "linear-gradient(145deg, #4A7C1C, #000)",
} as const;

export default function ChromaGrid({
  items,
  className = "",
}: ChromaGridProps) {
  const data = items ?? [];

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
      className={`relative grid w-full grid-cols-2 gap-3 px-2 py-4 sm:gap-4 sm:px-4 sm:py-6 lg:grid-cols-3 ${className}`}
    >
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          className="group relative flex h-auto min-h-0 w-full cursor-pointer flex-col overflow-hidden rounded-[20px] transition-colors duration-300"
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
          <div className="relative z-10 shrink-0 p-2 pb-0 sm:p-2.5 sm:pb-0">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-[#0a0a0b]">
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
          <footer className="relative z-10 flex min-h-[4.5rem] flex-1 flex-col justify-end gap-0.5 p-2.5 font-sans text-white sm:min-h-[88px] sm:gap-1 sm:p-3">
            <h3 className="m-0 text-[0.95rem] font-semibold leading-tight sm:text-[1.05rem]">
              {c.title}
            </h3>
            {c.handle ? (
              <span className="text-[0.85rem] opacity-80 sm:text-[0.95rem]">
                {c.handle}
              </span>
            ) : null}
            <p className="m-0 line-clamp-2 text-[0.75rem] leading-snug opacity-85 sm:text-[0.85rem]">
              {c.subtitle}
            </p>
            {c.location ? (
              <span className="text-[0.75rem] opacity-85 sm:text-[0.85rem]">
                {c.location}
              </span>
            ) : null}
          </footer>
        </article>
      ))}
    </div>
  );
}
