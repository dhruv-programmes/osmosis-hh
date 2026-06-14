import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "hh-header-block",
        align === "center" && "hh-header-block--center",
        className,
      )}
    >
      <p className="hh-eyebrow mb-4">{eyebrow}</p>
      <h2 className="hh-title">{title}</h2>
      {description ? <p className="hh-body mt-5">{description}</p> : null}
    </header>
  );
}
