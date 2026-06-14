import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PixelBlast from "./PixelBlast";
import {
  PIXEL_DUST_DEFAULTS,
  PIXEL_DUST_MOBILE,
} from "./pixel/pixelDustConfig";
import { usePixelDustCanvas } from "./pixel/PixelDustContext";

function getPixelDustConfig() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  return window.matchMedia("(max-width: 767px)").matches
    ? PIXEL_DUST_MOBILE
    : PIXEL_DUST_DEFAULTS;
}

export default function PixelDust() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas } = usePixelDustCanvas();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState(getPixelDustConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");

    const update = () => setConfig(getPixelDustConfig());

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
            autoPauseOffscreen={false}
            className="h-full w-full"
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[#080809]/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,#080809_90%)]" />
    </div>,
    document.body,
  );
}
