import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

interface GlassButtonProps {
  href: string;
  label: string;
  primary?: boolean;
  className?: string;
}

export default function GlassButton({
  href,
  label,
  primary = false,
  className,
}: GlassButtonProps) {
  return (
    <motion.a
      href={href}
      className={cn(
        "touch-target group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium sm:px-7 sm:py-3.5",
        primary
          ? "bg-white text-neutral-900 shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
          : "border border-white/15 bg-hh-surface text-white/85",
        className,
      )}
      whileHover={{
        scale: 1.04,
        y: -2,
        boxShadow: primary
          ? "0 8px 32px rgba(255,255,255,0.2)"
          : "0 8px 32px rgba(129,186,44,0.12)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
    >
      {label}
      <ArrowRight
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={1.5}
      />
    </motion.a>
  );
}
