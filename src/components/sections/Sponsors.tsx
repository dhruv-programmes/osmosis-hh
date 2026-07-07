import SparklesLogoWall from "@/components/mvpblocks/sparkles-logo";
import { cn } from "@/lib/utils";

const partnerLogos = [
  { name: "Covalent", src: "/assets/logos/covalent.png", href: "https://covalent.xyz" },
  { name: "Zo House", src: "/assets/logos/zo-house.png", href: "https://zo.house", featured: true },
];

interface SponsorsProps {
  className?: string;
}

export default function Sponsors({ className }: SponsorsProps) {
  return (
    <section aria-label="Event sponsors" className={cn("relative w-full", className)}>
      <SparklesLogoWall logos={partnerLogos} />
    </section>
  );
}
