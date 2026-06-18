import {
  createContext,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

type TextOpacityEnum = "none" | "soft" | "medium";
type ViewTypeEnum = "word" | "letter";

type TextGradientScrollContextType = {
  textOpacity?: TextOpacityEnum;
  type?: ViewTypeEnum;
};

const TextGradientScrollContext =
  createContext<TextGradientScrollContextType>({});

function useGradientScroll() {
  return useContext(TextGradientScrollContext);
}

type ScrollOffset = NonNullable<
  Parameters<typeof useScroll>[0]
>["offset"];

export type TextGradientScrollProps = ComponentPropsWithoutRef<"p"> & {
  text: string;
  type?: ViewTypeEnum;
  textOpacity?: TextOpacityEnum;
  scrollTargetRef?: RefObject<HTMLElement | null>;
  scrollOffset?: ScrollOffset;
  progress?: MotionValue<number>;
};

const ghostOpacity: Record<TextOpacityEnum, string> = {
  none: "opacity-0",
  soft: "opacity-10",
  medium: "opacity-30",
};

/** Once a segment is revealed it stays revealed (p >= end or p >= 1). */
export function revealProgress(p: number, start: number, end: number) {
  if (p >= 1 || p >= end) return 1;
  if (p <= start) return 0;
  return (p - start) / (end - start);
}

export function TextGradientScroll({
  text,
  className,
  type = "word",
  textOpacity = "soft",
  scrollTargetRef,
  scrollOffset = ["start 0.78", "end 0.32"],
  progress: externalProgress,
}: TextGradientScrollProps) {
  const localRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress: localProgress } = useScroll({
    target: scrollTargetRef ?? localRef,
    offset: scrollOffset,
  });

  const scrollYProgress = externalProgress ?? localProgress;
  const words = text.split(" ").filter(Boolean);

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity, type }}>
      <p
        ref={localRef}
        className={cn("relative m-0 flex flex-wrap", className)}
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;

          return type === "word" ? (
            <RevealWord
              key={`${word}-${i}`}
              progress={scrollYProgress}
              range={[start, end]}
            >
              {word}
            </RevealWord>
          ) : (
            <RevealLetters
              key={`${word}-${i}`}
              progress={scrollYProgress}
              range={[start, end]}
            >
              {word}
            </RevealLetters>
          );
        })}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

type SegmentProps = {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
};

function RevealWord({ children, progress, range }: SegmentProps) {
  const opacity = useTransform(progress, (p) =>
    revealProgress(p, range[0], range[1]),
  );

  return (
    <span className="relative me-[0.3em] mt-0.5 inline-block">
      <span className="pointer-events-none absolute inset-0 opacity-10">
        {children}
      </span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

function RevealLetters({ children, progress, range }: SegmentProps) {
  if (typeof children !== "string") return null;

  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="relative me-[0.3em] mt-0.5 inline-block">
      {children.split("").map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;

        return (
          <RevealChar key={`${char}-${i}`} progress={progress} range={[start, end]}>
            {char}
          </RevealChar>
        );
      })}
    </span>
  );
}

function RevealChar({ children, progress, range }: SegmentProps) {
  const { textOpacity = "soft" } = useGradientScroll();
  const opacity = useTransform(progress, (p) =>
    revealProgress(p, range[0], range[1]),
  );

  return (
    <span className="relative inline-block">
      <span
        className={cn("pointer-events-none absolute inset-0", ghostOpacity[textOpacity])}
        aria-hidden
      >
        {children}
      </span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
