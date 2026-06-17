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
      <span className="text-[#a8d95a]/90">Trusted by experts.</span>
      <br />
      <span>Used by the leaders.</span>
    </>
  ),
  subline,
}: SparklesLogoWallProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {headline ? (
          <div className="text-center text-xl text-white sm:text-2xl md:text-3xl">
            {headline}
          </div>
        ) : null}
        {subline ? (
          <p className="mt-3 text-center text-sm text-white/60 sm:text-base">{subline}</p>
        ) : null}

        <div
          className={cn(
            "mt-10 grid items-center justify-items-center gap-8 sm:mt-12",
            logos.length === 4
              ? "grid-cols-2 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
          )}
        >
          {logos.map((logo) => {
            const img = (
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className="h-10 w-auto max-w-[140px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 sm:h-12"
              />
            );

            return logo.href ? (
              <a
                key={logo.name}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2"
              >
                {img}
              </a>
            ) : (
              <div key={logo.name} className="flex items-center justify-center px-2">
                {img}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative -mt-16 h-64 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] sm:-mt-20 sm:h-80 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#81ba2c,transparent_70%)] before:opacity-35 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#81ba2c66] after:bg-zinc-900/40">
        <SparklesCore
          id="partner-sparkles"
          background="transparent"
          particleDensity={280}
          particleColor="#c8e6a0"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    </div>
  );
}
