import { useEffect, useRef } from "react";
import PixelDust from "./PixelDust";
import { PixelDustProvider } from "./pixel/PixelDustContext";
import Navbar from "./Navbar";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import Mentors from "./sections/Mentors";
import RegisterCta, { Footer } from "./sections/RegisterCta";
import Schedule from "./sections/Schedule";
import Venue from "./sections/Venue";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollTrigger } from "@/lib/gsap";

export default function EventLanding() {
  const mainRef = useRef<HTMLElement>(null);

  useSmoothScroll();

  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <PixelDustProvider>
      <PixelDust />

      <div className="relative min-h-svh overflow-x-clip bg-hh-bg text-hh-text">
        <Navbar />

        <main ref={mainRef} className="relative z-10">
          <Hero />
          <Experience />
          <Venue />
          <Mentors />
          <Schedule />
          <RegisterCta />
          <Footer />
        </main>
      </div>
    </PixelDustProvider>
  );
}
