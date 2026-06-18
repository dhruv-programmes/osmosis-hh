import { animate, useInView, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  /** When false, animation runs when `startWhen` flips true (ignores in-view). */
  waitForInView?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1.2,
  className = "",
  startWhen = true,
  waitForInView = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);
  const target = direction === "down" ? from : to;
  const initial = direction === "down" ? to : from;

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals, 10) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));
  const isInteger = maxDecimals === 0;

  const formatValue = useCallback(
    (latest: number) => {
      const value = isInteger ? Math.round(latest) : latest;
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat("en-US", options).format(value);

      return separator
        ? formattedNumber.replace(/,/g, separator)
        : formattedNumber;
    },
    [isInteger, maxDecimals, separator],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(initial);
    }
  }, [initial, formatValue]);

  useEffect(() => {
    if (!startWhen) return;
    if (waitForInView && !isInView) return;

    onStart?.();
    motionValue.set(initial);

    const controls = animate(motionValue, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });

    controls.then(() => {
      if (ref.current) {
        ref.current.textContent = formatValue(target);
      }
      onEnd?.();
    });

    return () => controls.stop();
  }, [
    startWhen,
    waitForInView,
    isInView,
    motionValue,
    target,
    initial,
    delay,
    duration,
    onStart,
    onEnd,
    formatValue,
  ]);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [motionValue, formatValue]);

  return <span className={className} ref={ref} />;
}
