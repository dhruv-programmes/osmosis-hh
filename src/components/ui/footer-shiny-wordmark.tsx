import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";

const wordmarkClass = cn(
  "font-[family-name:'Geist_Variable',system-ui,sans-serif]",
  "text-2xl font-semibold uppercase tracking-[-0.04em] sm:text-[1.65rem]",
);

type FooterShinyWordmarkProps = {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

export function FooterShinyWordmark({
  onClick,
  className,
}: FooterShinyWordmarkProps) {
  return (
    <a
      href="#"
      onClick={onClick}
      className={cn("group relative inline-flex items-center", className)}
      aria-label="OSMOSIS'26 — scroll to top"
    >
      <span
        className={cn(wordmarkClass, "text-white/10 select-none")}
        aria-hidden
      >
        OSMOSIS&apos;26
      </span>
      <span
        className={cn(
          wordmarkClass,
          "hh-shiny-text absolute inset-0 transition-[filter] duration-300 group-hover:brightness-110",
        )}
        aria-hidden
      >
        OSMOSIS&apos;26
      </span>
    </a>
  );
}
