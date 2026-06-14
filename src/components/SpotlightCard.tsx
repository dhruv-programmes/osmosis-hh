import { useRef, type PropsWithChildren, type MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import "./SpotlightCard.css";

interface SpotlightCardProps extends PropsWithChildren {
  className?: string;
  spotlightColor?: string;
  liquid?: boolean;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(129, 186, 44, 0.14)",
  liquid = true,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn("card-spotlight", liquid && "card-liquid-glass", className)}
    >
      {liquid ? (
        <>
          <div className="card-liquid-glass-backdrop" aria-hidden />
          <div className="card-liquid-glass-rim" aria-hidden />
          <div className="card-liquid-edge" aria-hidden />
        </>
      ) : null}
      <div className="card-spotlight-content">{children}</div>
    </div>
  );
}
