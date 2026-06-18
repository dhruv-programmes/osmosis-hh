import { lazy, Suspense, useEffect, useRef } from "react";
import PixelDust from "./PixelDust";
import { PixelDustProvider } from "./pixel/PixelDustContext";
import Navbar from "./Navbar";
import CurvedLoopMarquee from "./sections/CurvedLoopMarquee";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import HeroMission from "./sections/HeroMission";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollTrigger } from "@/lib/gsap";

const Mentors = lazy(() => import("./sections/Mentors"));
const Venue = lazy(() => import("./sections/Venue"));
const StackingCards = lazy(() => import("./sections/StackingCards"));
const RegisterCta = lazy(() => import("./sections/RegisterCta"));
const Footer = lazy(() => import("./sections/Footer"));

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
          <HeroMission />
          <CurvedLoopMarquee />
          <Experience />
          <Suspense fallback={null}>
            <div className="hh-deferred-section">
              <Mentors />
            </div>
          </Suspense>
          <Suspense fallback={null}>
            <div className="hh-deferred-section">
              <Venue />
            </div>
          </Suspense>
          <Suspense fallback={null}>
            <div className="hh-deferred-section">
              <StackingCards />
            </div>
          </Suspense>
          <Suspense fallback={null}>
            <div className="hh-deferred-section">
              <RegisterCta />
            </div>
          </Suspense>
          <Suspense fallback={null}>
            <div className="hh-deferred-section">
              <Footer />
            </div>
          </Suspense>
        </main>
      </div>
    </PixelDustProvider>
  );
}
