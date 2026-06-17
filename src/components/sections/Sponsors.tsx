import SparklesLogoWall from "@/components/mvpblocks/sparkles-logo";
import { cn } from "@/lib/utils";

const partnerLogos = [
  { name: "Covalent", src: "/assets/logos/covalent.png", href: "https://covalent.xyz" },
  { name: "Google", src: "/assets/logos/google.png", href: "https://google.com" },
  { name: "Clueso", src: "/assets/logos/clueso.png", href: "https://clueso.io" },
  { name: "Supabase", src: "/assets/logos/supabase.png", href: "https://supabase.com" },
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
