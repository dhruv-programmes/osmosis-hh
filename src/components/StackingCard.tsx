import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface StackingCardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  cta: string;
  href: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const sans = "font-[family-name:'Geist_Variable',system-ui,sans-serif]";

function DescriptionCopy({ text }: { text: string }) {
  const paragraphs = useMemo(() => text.split("\n\n").filter(Boolean), [text]);

  return (
    <div className="space-y-3.5">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            sans,
            "leading-[1.75] text-white",
            index === 0
              ? "text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-lg"
              : "text-[0.9875rem] font-medium text-white/90 sm:text-[1.0625rem]",
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function TextPanel({
  description,
  cta,
  href,
}: {
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex w-[46%] flex-col justify-center sm:w-[44%]">
      <div className="rounded-2xl border border-white/10 bg-[#080809]/76 p-5 backdrop-blur-xl sm:p-6 lg:p-7">
        <DescriptionCopy text={description} />

        <a
          href={href}
          className={cn(
            sans,
            "group mt-6 inline-flex items-center gap-2.5 text-[0.9875rem] font-semibold tracking-[-0.01em] text-[#e8f5d6] transition-colors hover:text-white sm:text-base",
          )}
        >
          <span className="underline decoration-[#a8d95a]/70 underline-offset-[5px] group-hover:decoration-white">
            {cta}
          </span>
          <svg
            width="22"
            height="12"
            viewBox="0 0 22 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

function ImagePanel({
  url,
  imageScale,
}: {
  url: string;
  imageScale: MotionValue<number>;
}) {
  return (
    <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
      <motion.div className="h-full w-full" style={{ scale: imageScale }}>
        <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>
    </div>
  );
}

export function StackingCard({
  i,
  title,
  description,
  url,
  color,
  cta,
  href,
  progress,
  range,
  targetScale,
}: StackingCardProps) {
  const container = useRef<HTMLDivElement>(null);
  const textOnLeft = i % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="sticky top-0 flex h-screen items-center justify-center px-4">
      <motion.article
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative -top-[25%] flex h-[min(520px,78vh)] w-full max-w-5xl origin-top flex-col rounded-[28px] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-9"
      >
        <h2
          className={cn(
            sans,
            "text-center text-[clamp(1.75rem,4.2vw,2.5rem)] font-semibold tracking-[-0.04em] text-white",
          )}
        >
          {title}
        </h2>

        <div
          className={cn(
            "mt-5 flex min-h-0 flex-1 gap-5 sm:mt-6 sm:gap-7 lg:gap-9",
            !textOnLeft && "flex-row-reverse",
          )}
        >
          <TextPanel description={description} cta={cta} href={href} />
          <ImagePanel url={url} imageScale={imageScale} />
        </div>
      </motion.article>
    </div>
  );
}
