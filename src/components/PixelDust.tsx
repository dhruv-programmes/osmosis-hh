import { media } from "@/lib/breakpoints";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PixelBlast from "./PixelBlast";
import { PIXEL_DUST_DEFAULTS } from "./pixel/pixelDustConfig";
import { usePixelDustCanvas } from "./pixel/PixelDustContext";

function getDesktopDustConfig() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  if (window.matchMedia(media.maxMd).matches) {
    return null;
  }

  return PIXEL_DUST_DEFAULTS;
}

function useMobileDustFallback() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return window.matchMedia(media.maxMd).matches;
}

function MobileDustFallback() {
  return (
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 18% 22%, rgba(129,186,44,0.22) 1px, transparent 1px)",
          "radial-gradient(circle at 72% 64%, rgba(168,217,90,0.16) 1px, transparent 1px)",
          "radial-gradient(circle at 44% 88%, rgba(129,186,44,0.14) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "5px 5px, 7px 7px, 6px 6px",
      }}
    />
  );
}

export default function PixelDust() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas } = usePixelDustCanvas();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState(getDesktopDustConfig);
  const [mobileFallback, setMobileFallback] = useState(useMobileDustFallback);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia(media.maxMd);

    const update = () => {
      setConfig(getDesktopDustConfig());
      setMobileFallback(useMobileDustFallback());
    };

    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bindCanvas = () => {
      const el = container.querySelector("canvas");
      setCanvas(el instanceof HTMLCanvasElement ? el : null);
    };

    bindCanvas();
    const observer = new MutationObserver(bindCanvas);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      setCanvas(null);
    };
  }, [setCanvas, config]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden
    >
      {config ? (
        <div className="absolute inset-0">
          <PixelBlast
            key={config.patternDensity}
            {...config}
            liquid={false}
            transparent={false}
            autoPauseOffscreen
            maxPixelRatio={1.5}
            className="h-full w-full"
          />
        </div>
      ) : null}
      {mobileFallback ? <MobileDustFallback /> : null}
      <div className="pointer-events-none absolute inset-0 bg-[#080809]/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,#080809_90%)]" />
    </div>,
    document.body,
  );
}
