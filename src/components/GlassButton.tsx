import { type Colors, Liquid } from "@/components/ui/liquid-gradient";
import { externalLinkProps } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { useState } from "react";

const COLORS: Colors = {
  color1: "#F5FAEF",
  color2: "#1A2E0A",
  color3: "#4A7C1C",
  color4: "#E8F5D6",
  color5: "#D4EDB8",
  color6: "#9ECF4A",
  color7: "#5A9220",
  color8: "#0D1408",
  color9: "#81BA2C",
  color10: "#A8D95A",
  color11: "#6B9E2E",
  color12: "#C8E6A0",
  color13: "#3D6618",
  color14: "#B8E86A",
  color15: "#E2F4C8",
  color16: "#2A4510",
  color17: "#6A9C2F",
};

interface GlassButtonProps {
  href: string;
  label: string;
  size?: "hero" | "nav";
  className?: string;
}

export default function GlassButton({
  href,
  label,
  size = "hero",
  className,
}: GlassButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isNav = size === "nav";

  return (
    <a
      {...externalLinkProps(href)}
      className={cn(
        "group relative inline-block overflow-hidden rounded-lg border border-white/12 bg-[#080809]",
        isNav ? "h-10 w-[5.75rem]" : "h-[2.7em] w-[8.5rem]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="pointer-events-none absolute top-[8.57%] left-1/2 h-[128.57%] w-[112.81%] -translate-x-1/2 opacity-60 blur-[19px] filter"
        aria-hidden
      >
        <span className="absolute inset-0 rounded-lg bg-[#2a4510] blur-[6.5px] filter" />
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Liquid isHovered={isHovered} colors={COLORS} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[112.85%] w-[92.23%] -translate-x-1/2 translate-y-[-40%] rounded-lg bg-[#080809] blur-[7.3px] filter"
        aria-hidden
      />

      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-[#1a2e0a]" aria-hidden />
        <span className="absolute inset-0 rounded-lg bg-black/85" aria-hidden />
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Liquid isHovered={isHovered} colors={COLORS} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={`spark-${i}`}
            className={cn(
              "pointer-events-none absolute inset-0 rounded-lg border-[3px] border-solid border-gradient-to-b from-transparent to-white/40 mix-blend-overlay filter",
              i <= 2 ? "blur-[3px]" : i === 3 ? "blur-[5px]" : "blur-xs",
            )}
            aria-hidden
          />
        ))}
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 h-[42.85%] w-[70.8%] -translate-x-1/2 translate-y-[-40%] rounded-lg bg-[#3d6618]/80 blur-[15px] filter"
          aria-hidden
        />
      </div>

      <span
        className={cn(
          "absolute inset-0 z-10 flex items-center justify-center font-semibold tracking-wide whitespace-nowrap text-white transition-colors group-hover:text-[#c8e6a0]",
          isNav ? "text-sm" : "text-xl",
        )}
      >
        {label}
      </span>
    </a>
  );
}
