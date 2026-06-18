import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { spring } from "@/lib/motion";
import { scrollToSection } from "@/lib/scrollToSection";
import GlassButton from "./GlassButton";

const links = [
  { label: "Schedule", href: "#schedule" },
  { label: "About", href: "#about" },
  { label: "Mentors", href: "#mentors" },
  { label: "Venue", href: "#venue" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const closeMenu = () => setOpen(false);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    closeMenu();

    requestAnimationFrame(() => {
      scrollToSection(href);
    });
  };

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-[max(1rem,var(--safe-left))] pr-[max(1rem,var(--safe-right))] pt-[max(0.75rem,var(--safe-top))]"
    >
      <div className="w-full max-w-lg">
        <motion.nav
          aria-label="Main navigation"
          className="relative flex w-full items-center justify-between gap-3 overflow-visible rounded-full border border-white/10 bg-[rgba(6,8,10,0.82)] px-4 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-5"
        >
          <a
            href="#"
            onClick={(event) => handleNavClick(event, "#")}
            className="touch-target relative z-10 inline-flex items-center text-sm font-medium text-white"
          >
            Osmosis
          </a>

          <div className="relative z-10 hidden items-center gap-5 md:flex">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="text-sm text-white/88"
                whileHover={{ color: "rgba(255,255,255,0.98)", y: -1 }}
                transition={spring.snappy}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <div className="relative z-10 flex shrink-0 items-center gap-2 overflow-visible">
            <GlassButton href="#register" label="Apply" size="nav" className="touch-target" />

            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="touch-target inline-flex items-center justify-center rounded-full border border-white/12 text-white md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(6,8,10,0.94)] backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col gap-1 p-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event) => handleNavClick(event, link.href)}
                      className="touch-target flex items-center rounded-xl px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/6 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
