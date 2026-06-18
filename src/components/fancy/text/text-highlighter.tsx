import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  motion,
  useInView,
  type Transition,
  type UseInViewOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt";

type TextHighlighterProps = {
  children: React.ReactNode;
  triggerType?: "hover" | "ref" | "inView" | "auto";
  transition?: Transition;
  useInViewOptions?: UseInViewOptions;
  className?: string;
  highlightColor?: string;
  direction?: HighlightDirection;
} & React.HTMLAttributes<HTMLSpanElement>;

export type TextHighlighterRef = {
  animate: (direction?: HighlightDirection) => void;
  reset: () => void;
};

export const TextHighlighter = forwardRef<
  TextHighlighterRef,
  TextHighlighterProps
>(
  (
    {
      children,
      triggerType = "inView",
      transition = { type: "spring", duration: 0.75, delay: 0, bounce: 0 },
      useInViewOptions = {
        once: true,
        initial: false,
        amount: 0.1,
      },
      className,
      highlightColor = "rgba(129, 186, 44, 0.55)",
      direction = "ltr",
      ...props
    },
    ref,
  ) => {
    const componentRef = useRef<HTMLSpanElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentDirection, setCurrentDirection] =
      useState<HighlightDirection>(direction);

    useEffect(() => {
      setCurrentDirection(direction);
    }, [direction]);

    const isInView = useInView(componentRef, useInViewOptions);

    useImperativeHandle(ref, () => ({
      animate: (animationDirection?: HighlightDirection) => {
        if (animationDirection) {
          setCurrentDirection(animationDirection);
        }
        setIsAnimating(true);
      },
      reset: () => setIsAnimating(false),
    }));

    const shouldAnimate =
      triggerType === "hover"
        ? isHovered
        : triggerType === "inView"
          ? isInView
          : triggerType === "ref"
            ? isAnimating
            : triggerType === "auto";

    const animated = Boolean(shouldAnimate);
    const originX = currentDirection === "rtl" ? 1 : 0;
    const skewDeg = currentDirection === "rtl" ? 11 : -11;

    return (
      <span
        ref={componentRef}
        className={cn("relative inline", className)}
        onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
        onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
        {...props}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -left-[0.16em] -right-[0.12em] bottom-[0.06em] top-[50%] -z-10 block rounded-[1px]"
          style={{
            transformOrigin: `${originX * 100}% 100%`,
            skewX: skewDeg,
            backgroundImage: `linear-gradient(
              102deg,
              transparent 0%,
              ${highlightColor} 7%,
              ${highlightColor} 93%,
              transparent 100%
            )`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: animated ? 1 : 0 }}
          transition={transition}
        />
        <span className="relative z-[1]">{children}</span>
      </span>
    );
  },
);

TextHighlighter.displayName = "TextHighlighter";

export default TextHighlighter;
