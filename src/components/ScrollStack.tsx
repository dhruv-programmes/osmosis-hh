import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { subscribeScrollFrame } from "@/hooks/useSmoothScroll";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import "./ScrollStack.css";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div className={cn("scroll-stack-card scroll-stack-card-plain", itemClassName)}>
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

function readStaticOffset(element: HTMLElement, useWindowScroll: boolean) {
  const previousTransform = element.style.transform;
  const previousFilter = element.style.filter;

  element.style.transform = "none";
  element.style.filter = "none";

  const top = useWindowScroll
    ? element.getBoundingClientRect().top + window.scrollY
    : element.offsetTop;

  element.style.transform = previousTransform;
  element.style.filter = previousFilter;

  return top;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardTopsRef = useRef<number[]>([]);
  const endElementTopRef = useRef(0);
  const lastTransformsRef = useRef(
    new Map<
      number,
      { translateY: number; scale: number; rotation: number; blur: number }
    >(),
  );

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    [],
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === "string" && value.includes("%")) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value as string);
    },
    [],
  );

  const getScrollTop = useCallback(() => {
    if (useWindowScroll) return window.scrollY;
    return scrollerRef.current?.scrollTop ?? 0;
  }, [useWindowScroll]);

  const getContainerHeight = useCallback(() => {
    if (useWindowScroll) return window.innerHeight;
    return scrollerRef.current?.clientHeight ?? 0;
  }, [useWindowScroll]);

  const refreshPositions = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const endElement = scrollerRef.current?.querySelector(
      ".scroll-stack-end",
    ) as HTMLElement | null;

    cardTopsRef.current = cards.map((card) => readStaticOffset(card, useWindowScroll));
    endElementTopRef.current = endElement
      ? readStaticOffset(endElement, useWindowScroll)
      : 0;
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || !cardTopsRef.current.length) return;

    const scrollTop = getScrollTop();
    const containerHeight = getContainerHeight();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endElementTopRef.current;

    cardsRef.current.forEach((card, i) => {
      const cardTop = cardTopsRef.current[i];
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardTopsRef.current.length; j++) {
          const jTriggerStart =
            cardTopsRef.current[j] - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          blur = Math.max(0, (topCardIndex - i) * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY),
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 10) / 10,
        blur: Math.round(blur * 10) / 10,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) >= 1 ||
        Math.abs(lastTransform.scale - newTransform.scale) >= 0.002 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) >= 0.5 ||
        Math.abs(lastTransform.blur - newTransform.blur) >= 0.5;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;

        card.style.transform = transform;
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "none";

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollTop,
    getContainerHeight,
  ]);

  const setupLenis = useCallback(() => {
    const onFrame = () => {
      updateCardTransforms();
      if (useWindowScroll) {
        ScrollTrigger.update();
      }
    };

    if (useWindowScroll) {
      return subscribeScrollFrame(onFrame);
    }

    const onLocalFrame = (time: number) => {
      lenisRef.current?.raf(time);
      updateCardTransforms();
    };
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      gestureOrientation: "vertical",
      wheelMultiplier: 0.9,
      lerp: 0.14,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });

    lenisRef.current = lenis;
    animationFrameRef.current = requestAnimationFrame(function loop(time) {
      onLocalFrame(time);
      animationFrameRef.current = requestAnimationFrame(loop);
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [updateCardTransforms, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      scroller.querySelectorAll(".scroll-stack-card"),
    ) as HTMLElement[];

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = "transform";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translate3d(0, 0, 0)";
    });

    refreshPositions();
    const unsubscribe = setupLenis();

    const onResize = () => {
      refreshPositions();
      updateCardTransforms();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      unsubscribe?.();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cardTopsRef.current = [];
      transformsCache.clear();
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    refreshPositions,
    updateCardTransforms,
  ]);

  return (
    <div
      className={`scroll-stack-scroller${useWindowScroll ? " scroll-stack-window" : ""} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
