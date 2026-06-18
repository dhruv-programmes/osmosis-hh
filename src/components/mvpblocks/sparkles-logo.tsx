import type { ReactNode } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

export interface PartnerLogo {
  name: string;
  src: string;
  href?: string;
  featured?: boolean;
}

interface SparklesLogoWallProps {
  logos: PartnerLogo[];
  className?: string;
  headline?: ReactNode;
  subline?: ReactNode;
}

const sans = "font-[family-name:'Geist_Variable',system-ui,sans-serif]";

export default function SparklesLogoWall({
  logos,
  className,
  headline = (
    <h2
      className={cn(
        sans,
        "text-[clamp(1.625rem,4.5vw,2.25rem)] font-semibold tracking-[-0.04em] text-[#f5f5f7]",
      )}
    >
      Our event{" "}
      <span className="box-decoration-clone bg-[linear-gradient(transparent_42%,rgba(168,217,90,0.85)_42%,rgba(168,217,90,0.85)_80%,transparent_80%)] px-0.5">
        Sponsors
      </span>
    </h2>
  ),
  subline,
}: SparklesLogoWallProps) {
  const colClass =
    logos.length === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : logos.length <= 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none relative h-8 w-full sm:h-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_0%,rgba(129,186,44,0.14),transparent_70%)]" />
        <div className="absolute left-1/2 top-0 aspect-[2.4/0.28] w-[155%] -translate-x-1/2 rounded-[100%] border-t border-[#81ba2c40] bg-gradient-to-b from-white/[0.04] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-[var(--section-px)] pt-2 sm:pt-3">
        {headline ? <div className="text-center">{headline}</div> : null}
        {subline ? (
          <p
            className={cn(
              sans,
              "mt-3 text-center text-sm font-medium tracking-[-0.01em] text-white/55 sm:text-[0.9375rem]",
            )}
          >
            {subline}
          </p>
        ) : null}

        <ul
          className={cn(
            "mt-5 grid w-full items-center justify-items-center gap-x-6 gap-y-5 sm:mt-6 sm:gap-x-8 sm:gap-y-6",
            colClass,
          )}
        >
          {logos.map((logo) => {
            const img = (
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className={cn(
                  "w-auto object-contain opacity-90 transition-opacity duration-300 hover:opacity-100",
                  logo.featured
                    ? "h-14 max-w-[min(190px,38vw)] sm:h-[3.25rem] md:h-16 md:max-w-[min(230px,32vw)]"
                    : "h-11 max-w-[min(160px,34vw)] sm:h-12 md:h-14 md:max-w-[min(200px,28vw)]",
                )}
              />
            );

            return (
              <li key={logo.name} className="flex w-full items-center justify-center">
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div
        aria-hidden
        className="pointer-events-none relative -mt-4 h-10 w-full overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] sm:-mt-5 sm:h-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(129,186,44,0.22),transparent_72%)]" />
        <div className="absolute left-1/2 top-[42%] aspect-[1/0.65] w-[200%] -translate-x-1/2 rounded-[100%] border-t border-[#81ba2c30] shadow-[0_-10px_36px_rgba(129,186,44,0.1)]" />
        <SparklesCore
          id="partner-sparkles"
          background="transparent"
          particleDensity={240}
          particleColor="#c8e6a0"
          className="absolute inset-x-0 bottom-0 h-full w-full mask-[radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    </div>
  );
}
