import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react";

import {
  TextHighlighter,
  type TextHighlighterRef,
} from "@/components/fancy/text/text-highlighter";
import {
  revealProgress,
  TextGradientScroll,
  type TextGradientScrollProps,
} from "@/components/ui/text-gradient-scroll";
import { cn } from "@/lib/utils";

const HIGHLIGHT_TRANSITION: Transition = {
  type: "spring",
  duration: 0.75,
  delay: 0.08,
  bounce: 0,
};
const HIGHLIGHT_CLASS = "relative z-[1]";
const HIGHLIGHT_COLOR = "rgba(129, 186, 44, 0.55)";
const HIGHLIGHT_IN_VIEW = { once: true, initial: true, amount: 0.1 } as const;

type ScrollOffset = NonNullable<
  Parameters<typeof useScroll>[0]
>["offset"];

export interface TextRevealProps {
  children: string;
  footer?: ReactNode;
  className?: string;
  textClassName?: string;
  scrollOffset?: ScrollOffset;
  scrollHeightClassName?: string;
  highlightWords?: string[];
}

const DEFAULT_SCROLL_OFFSET: ScrollOffset = ["start 0.90", "end 0.58"];

/** All words fully revealed by this fraction of section scroll progress. */
export const TEXT_REVEAL_COMPLETE_AT = 0.64;

export function getWordRevealStart(wordIndex: number, totalWords: number) {
  return (wordIndex / totalWords) * TEXT_REVEAL_COMPLETE_AT;
}

export function getStatsCountTrigger(text: string, anchorWord = "COMES") {
  const words = text.split(" ").filter(Boolean);
  const anchor = anchorWord.toUpperCase().replace(/[,.]/g, "");
  const index = words.findIndex(
    (word) => word.toUpperCase().replace(/[,.]/g, "") === anchor,
  );

  if (index < 0) return TEXT_REVEAL_COMPLETE_AT * 0.85;
  return getWordRevealStart(index, words.length);
}

const TextRevealProgressContext = createContext<MotionValue<number> | null>(
  null,
);

export function useTextRevealProgress() {
  return useContext(TextRevealProgressContext);
}

function normalizeWord(word: string) {
  return word.toUpperCase().replace(/[,.]/g, "");
}

export function TextReveal({
  children,
  footer,
  className,
  textClassName,
  scrollOffset = DEFAULT_SCROLL_OFFSET,
  scrollHeightClassName = "min-h-[92vh]",
  highlightWords = [],
}: TextRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: scrollOffset,
  });

  const words = children.split(" ").filter(Boolean);
  const highlightSet = new Set(
    highlightWords.map((word) => normalizeWord(word)),
  );

  const textProps: Omit<TextGradientScrollProps, "text"> = {
    scrollTargetRef: sectionRef,
    scrollOffset,
    progress: scrollYProgress,
    type: "word",
    textOpacity: "soft",
    className: cn(
      "w-full justify-center gap-x-[0.3em] gap-y-1 text-center font-[family-name:'Geist_Variable',system-ui,sans-serif] text-[clamp(1.65rem,4.8vw,3.25rem)] font-bold uppercase leading-[1.02] tracking-[-0.03em] text-white",
      textClassName,
    ),
  };

  return (
    <TextRevealProgressContext.Provider value={scrollYProgress}>
      <div
        ref={sectionRef}
        className={cn("relative", scrollHeightClassName, className)}
      >
        <div className="sticky top-[calc(max(0.75rem,var(--safe-top))+3.75rem)] flex min-h-[calc(100svh-max(0.75rem,var(--safe-top))-3.75rem)] flex-col items-center justify-center px-[var(--section-px)] pb-2 pt-2 sm:pb-3">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2.5 sm:gap-3">
            {reduceMotion ? (
              <p className={textProps.className}>
                {words.map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className={cn(
                      "me-[0.3em] inline-block",
                      highlightSet.has(normalizeWord(word)) &&
                        "relative inline-block after:pointer-events-none after:absolute after:-left-[0.14em] after:-right-[0.1em] after:bottom-[0.07em] after:top-[48%] after:-z-10 after:block after:-skew-x-[11deg] after:bg-[rgba(129,186,44,0.55)] after:content-['']",
                    )}
                  >
                    {word}
                  </span>
                ))}
              </p>
            ) : (
              <HighlightedGradientText
                text={children}
                highlightSet={highlightSet}
                progress={scrollYProgress}
                textProps={textProps}
              />
            )}

            {footer ? <div className="w-full -mb-1">{footer}</div> : null}
          </div>
        </div>
      </div>
    </TextRevealProgressContext.Provider>
  );
}

function HighlightedGradientText({
  text,
  highlightSet,
  progress,
  textProps,
}: {
  text: string;
  highlightSet: Set<string>;
  progress: MotionValue<number>;
  textProps: Omit<TextGradientScrollProps, "text">;
}) {
  const words = text.split(" ").filter(Boolean);

  return (
    <p className={textProps.className}>
      {words.map((word, i) => {
        const start = (i / words.length) * TEXT_REVEAL_COMPLETE_AT;
        const end = ((i + 1) / words.length) * TEXT_REVEAL_COMPLETE_AT;
        const highlight = highlightSet.has(normalizeWord(word));

        return (
          <HighlightWord
            key={`${word}-${i}`}
            progress={progress}
            range={[start, end]}
            highlight={highlight}
          >
            {word}
          </HighlightWord>
        );
      })}
    </p>
  );
}

function HighlightWord({
  children,
  progress,
  range,
  highlight,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const highlighterRef = useRef<TextHighlighterRef>(null);
  const hasHighlighted = useRef(false);
  const reveal = useTransform(progress, (p) =>
    revealProgress(p, range[0], range[1]),
  );

  const triggerHighlight = () => {
    if (!highlight || hasHighlighted.current) return;
    hasHighlighted.current = true;
    highlighterRef.current?.animate();
  };

  useMotionValueEvent(reveal, "change", (value) => {
    if (value >= 0.35) triggerHighlight();
  });

  useEffect(() => {
    if (reveal.get() >= 0.35) triggerHighlight();
  }, [reveal, highlight]);

  const revealedText = highlight ? (
    <TextHighlighter
      ref={highlighterRef}
      triggerType="ref"
      className={HIGHLIGHT_CLASS}
      transition={HIGHLIGHT_TRANSITION}
      highlightColor={HIGHLIGHT_COLOR}
      useInViewOptions={HIGHLIGHT_IN_VIEW}
    >
      {children}
    </TextHighlighter>
  ) : (
    children
  );

  return (
    <span className="relative me-[0.3em] mt-0.5 inline-block whitespace-pre">
      <span className="text-white/20">{children}</span>
      <motion.span className="absolute inset-0 text-white" style={{ opacity: reveal }}>
        {revealedText}
      </motion.span>
    </span>
  );
}

// Re-export for direct use
export { TextGradientScroll, revealProgress };
