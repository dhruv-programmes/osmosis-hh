import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";
import SpotlightCard from "../SpotlightCard";
import { spring } from "@/lib/motion";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  hoverLift?: boolean;
  spotlightColor?: string;
}

export default function GlassPanel({
  children,
  className,
  hoverLift = false,
  spotlightColor,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      whileHover={hoverLift ? { y: -3 } : undefined}
      transition={spring.smooth}
      {...props}
    >
      <SpotlightCard className={className} spotlightColor={spotlightColor} liquid>
        {children}
      </SpotlightCard>
    </motion.div>
  );
}
