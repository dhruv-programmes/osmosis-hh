import { ScrollTrigger } from "@/lib/gsap";

const DEFAULT_OFFSET = 88;

function getNavOffset() {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--nav-scroll-offset",
  );
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : DEFAULT_OFFSET;
}

type LenisScrollHandler = (
  target: string | HTMLElement,
  options?: { offset?: number; immediate?: boolean },
) => void;

let lenisScrollHandler: LenisScrollHandler | null = null;

export function setLenisScrollHandler(handler: LenisScrollHandler | null) {
  lenisScrollHandler = handler;
}

export function scrollToSection(
  href: string,
  options?: { immediate?: boolean },
) {
  const id = href.replace(/^#/, "");

  if (!id) {
    window.scrollTo({ top: 0, behavior: options?.immediate ? "auto" : "smooth" });
    window.history.pushState(null, "", "#");
    ScrollTrigger.update();
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const immediate = options?.immediate ?? reducedMotion;
  const behavior = immediate ? "auto" : "smooth";

  if (lenisScrollHandler) {
    lenisScrollHandler(el, { offset: -getNavOffset(), immediate });
  } else {
    el.scrollIntoView({ behavior, block: "start" });
  }

  window.history.pushState(null, "", `#${id}`);
  requestAnimationFrame(() => {
    ScrollTrigger.update();
  });
}

function getClickTargetElement(target: EventTarget | null) {
  if (target instanceof Element) return target;
  if (target instanceof Text && target.parentElement) return target.parentElement;
  return null;
}

export function handleHashLinkClick(event: MouseEvent) {
  const element = getClickTargetElement(event.target);
  const anchor = element?.closest('a[href^="#"]');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  const href = anchor.getAttribute("href");
  if (!href || href === "#") return;

  // Navbar links handle their own scroll.
  if (anchor.closest("#mobile-nav, nav[aria-label='Main navigation']")) return;

  event.preventDefault();
  scrollToSection(href);
}
