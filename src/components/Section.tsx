import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  scrim?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, children, className, innerClassName, scrim = false },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative border-t border-white/[0.06]", className)}
    >
      {scrim ? (
        <div
          className="pointer-events-none absolute inset-0 bg-hh-bg/25"
          aria-hidden
        />
      ) : null}
      <div
        className={cn(
          "hh-container relative hh-section",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
});

export default Section;
