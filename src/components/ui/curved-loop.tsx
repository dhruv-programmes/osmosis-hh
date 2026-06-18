import { cn } from "@/lib/utils";
import { breakpoints } from "@/lib/breakpoints";
import {  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  containerClassName?: string;
  svgClassName?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  reducedMotion?: boolean;
}

export default function CurvedLoop({
  marqueeText = "",
  speed = 2,
  className,
  containerClassName,
  svgClassName,
  curveAmount = 400,
  direction = "left",
  interactive = true,
  reducedMotion = false,
}: CurvedLoopProps) {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fontSizeVb, setFontSizeVb] = useState(112);
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;
  const pathBaseline = 28;
  const controlY = pathBaseline + curveAmount;
  /** Deepest point on the quadratic path + room for glyph descenders. */
  const pathLowY = pathBaseline + curveAmount * 0.52;
  const viewBoxHeight = Math.ceil(pathLowY + fontSizeVb * 0.9);
  const pathD = `M-100,${pathBaseline} Q500,${controlY} 1540,${pathBaseline}`;
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<"left" | "right">(direction);
  const velRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0;
  const canInteract = interactive && !reducedMotion;
  const animationSpeed = reducedMotion ? 0 : speed;
  /** Mobile glyphs are larger in viewBox units — scale px/frame so loop time matches desktop. */
  const REFERENCE_FONT_SIZE = 52;
  const effectiveSpeed = animationSpeed * (fontSizeVb / REFERENCE_FONT_SIZE);

  useEffect(() => {
    const updateFontSize = () => {
      const vw = window.innerWidth;
      if (vw < breakpoints.md) {
        setFontSizeVb(Math.min(132, Math.max(108, vw * 0.34)));
      } else {
        setFontSizeVb(Math.min(58, Math.max(44, vw * 0.042)));
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className, svgClassName, fontSizeVb]);
  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", `${initial}px`);
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!spacing || !ready || animationSpeed === 0) return;

    let frame = 0;
    const step = () => {
      if (isVisibleRef.current && !dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? effectiveSpeed : -effectiveSpeed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let newOffset = currentOffset + delta;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute("startOffset", `${newOffset}px`);
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, effectiveSpeed, ready]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canInteract) return;
    dragRef.current = true;
    setDragging(true);
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canInteract || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    textPathRef.current.setAttribute("startOffset", `${newOffset}px`);
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!canInteract) return;
    dragRef.current = false;
    setDragging(false);
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = canInteract ? (dragging ? "grabbing" : "grab") : "auto";

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full items-start justify-center overflow-x-clip overflow-y-visible",
        containerClassName,
      )}
      style={{
        visibility: ready ? "visible" : "hidden",
        cursor: cursorStyle,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className={cn(
          "block w-full overflow-visible leading-none font-bold uppercase select-none",
          svgClassName,
        )}
        style={{ aspectRatio: `1440 / ${viewBoxHeight}` }}
        viewBox={`0 0 1440 ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMin meet"
        aria-hidden
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className={className}
          fontSize={fontSizeVb}
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready ? (
          <text xmlSpace="preserve" className={className} fontSize={fontSizeVb}>            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={`${offset}px`}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        ) : null}
      </svg>
    </div>
  );
}