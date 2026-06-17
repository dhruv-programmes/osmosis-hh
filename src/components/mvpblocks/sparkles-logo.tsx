import type { ReactNode } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

export interface PartnerLogo {
  name: string;
  src: string;
  href?: string;
}

interface SparklesLogoWallProps {
  logos: PartnerLogo[];
  className?: string;
  headline?: ReactNode;
  subline?: ReactNode;
}

export default function SparklesLogoWall({
  logos,
  className,
  headline = (
    <>
      <span className="text-[#a8d95a]/90">Proudly supported by.</span>
      <br />
      <span>Our event sponsors.</span>
    </>
  ),
  subline,
}: SparklesLogoWallProps) {
  const colClass =
    logos.length <= 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none relative h-14 w-full overflow-hidden sm:h-16 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,#81ba2c,transparent_72%)] before:opacity-35 after:absolute after:top-0 after:left-1/2 after:aspect-[2/0.55] after:w-[200%] after:-translate-x-1/2 after:rounded-[100%] after:border-t after:border-[#81ba2c55] after:bg-hh-bg/90"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-[var(--section-px)] pt-3 sm:pt-4">
        {headline ? (
          <div className="text-center text-2xl text-white sm:text-3xl">{headline}</div>
        ) : null}
        {subline ? (
          <p className="mt-2 text-center text-sm text-white/60 sm:text-base">{subline}</p>
        ) : null}

        <ul
          className={cn(
            "mt-8 grid w-full items-center justify-items-center gap-x-6 gap-y-6 sm:mt-9 sm:gap-x-8",
            colClass,
          )}
        >
          {logos.map((logo) => {
            const img = (
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className="h-8 w-auto max-w-[min(120px,24vw)] object-contain opacity-85 transition-opacity duration-300 hover:opacity-100 sm:h-9"
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
        className="pointer-events-none relative -mt-20 h-52 w-full overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] sm:-mt-24 sm:h-60 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#81ba2c,transparent_70%)] before:opacity-35 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#81ba2c55] after:bg-zinc-900/50"
      >
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
