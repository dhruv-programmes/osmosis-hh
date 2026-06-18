import type { MouseEvent } from "react";
import { Mail } from "lucide-react";
import { FooterShinyWordmark } from "@/components/ui/footer-shiny-wordmark";
import { FooterTape } from "@/components/ui/footer-tape";
import { cn } from "@/lib/utils";

const geist = "font-[family-name:'Geist_Variable',system-ui,sans-serif]";

const linkClass = cn(
  geist,
  "text-sm text-white/50 whitespace-nowrap transition-colors hover:text-white",
);

function scrollToTop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.history.pushState(null, "", "#");
}

export function FooterTapedDesign() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(geist, "mx-auto my-8 max-w-5xl px-[var(--section-px)] pb-[max(1.5rem,var(--safe-bottom))]")}>
      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-[#0f0f11] px-4 py-10 md:flex-row">
        <div className="absolute -left-8 -top-4 hidden h-9 w-20 scale-75 md:block">
          <FooterTape className="size-full" />
        </div>
        <div className="absolute -right-8 -top-4 hidden h-9 w-20 rotate-90 scale-75 md:block">
          <FooterTape className="size-full" />
        </div>

        <div className="flex flex-1 flex-col items-start justify-between gap-4 px-2 md:flex-row md:gap-10 md:px-8">
          <div className="flex flex-col items-start gap-2">
            <FooterShinyWordmark onClick={scrollToTop} />
            <p className="hh-body w-full text-white/50 md:w-4/5">
              48 hours of building, mentorship, and collisions in Whitefield,
              Bangalore.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:mx-4 md:flex-row md:gap-20">
            <div className="flex flex-col gap-1 md:gap-4">
              <h4 className="hh-eyebrow">Explore</h4>
              <div className="flex flex-wrap items-start gap-2 text-sm md:flex-col">
                <a className={linkClass} href="#schedule">
                  Schedule
                </a>
                <a className={linkClass} href="#about">
                  About
                </a>
                <a className={linkClass} href="#mentors">
                  Mentors
                </a>
                <a className={linkClass} href="#venue">
                  Venue
                </a>
                <a className={linkClass} href="#register">
                  Apply
                </a>
              </div>
            </div>

            <div className="hidden flex-col gap-1 md:flex md:gap-4">
              <h4 className="hh-eyebrow whitespace-nowrap">Event</h4>
              <div className="flex flex-col items-start gap-2 text-sm">
                <span className={linkClass}>July 25–26</span>
                <span className={linkClass}>Whitefield, Bangalore</span>
                <a className={linkClass} href="#venue">
                  Zo House
                </a>
              </div>
            </div>

            <div className="hidden flex-col gap-4 md:flex">
              <h4 className="hh-eyebrow whitespace-nowrap">Contact</h4>
              <div className="flex flex-col items-start gap-2 text-sm">
                <a
                  className={linkClass}
                  href="mailto:hello@osmosis.dev?subject=Osmosis%20Hacker%20House"
                >
                  hello@osmosis.dev
                </a>
                <a
                  className={linkClass}
                  href="mailto:hello@osmosis.dev?subject=Osmosis%20Hacker%20House%20Application"
                >
                  Apply via email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-3 flex flex-col items-start justify-between gap-4 px-4 text-sm text-white/55 md:flex-row md:items-center md:px-8">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-8">
          <p className="whitespace-nowrap">
            ©{currentYear} Osmosis Hacker House. All rights reserved.
          </p>
          <div className="flex flex-row gap-4">
            <a
              className="transition-colors hover:text-white"
              href="mailto:hello@osmosis.dev?subject=Osmosis%20Hacker%20House"
            >
              Contact
            </a>
            <a
              className="transition-colors hover:text-white"
              href="#venue"
            >
              Venue
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:hello@osmosis.dev?subject=Osmosis%20Hacker%20House"
            aria-label="Email Osmosis Hacker House"
            className="text-white/55 transition-colors hover:text-white"
          >
            <Mail className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
