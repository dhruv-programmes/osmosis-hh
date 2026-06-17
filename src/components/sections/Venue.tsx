import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Section from "../Section";
import SectionHeader from "../SectionHeader";
import {
  Carousel,
  Slider,
  SliderContainer,
  SliderDotButton,
  SliderNextButton,
  SliderPrevButton,
} from "@/components/ui/carousel";
import { galleryImages } from "@/lib/venueGallery";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Venue() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.from(".venue-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
            y: 48,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          });
          gsap.from(".venue-carousel", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
            y: 56,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.08,
          });
        },
        "(max-width: 767px)": () => {
          gsap.from(".venue-header", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 84%" },
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          });
          gsap.from(".venue-carousel", {
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
            y: 28,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: 0.06,
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <Section ref={sectionRef} id="venue" scrim>
      <SectionHeader
        className="venue-header mb-8 text-center sm:mb-10"
        align="center"
        eyebrow="Venue"
        title={
          <>
            Zo House, <span className="hh-title-accent">Whitefield.</span>
          </>
        }
      />

      <div className="venue-carousel mx-auto max-w-5xl">
        <Carousel
          className="group/carousel"
          options={{ loop: true, align: "start" }}
        >
          <div className="relative">
            <SliderContainer>
              {galleryImages.map((src) => (
                <Slider key={src} className="basis-full">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 sm:aspect-[5/3]">
                    <img
                      src={src}
                      alt="Zo House, Whitefield, Bangalore"
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Slider>
              ))}
            </SliderContainer>

            <SliderPrevButton
              aria-label="Previous slide"
              className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#080809]/80 text-white backdrop-blur-sm transition-opacity disabled:opacity-30 sm:left-4"
            >
              <ChevronLeft className="h-4 w-4" />
            </SliderPrevButton>

            <SliderNextButton
              aria-label="Next slide"
              className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#080809]/80 text-white backdrop-blur-sm transition-opacity disabled:opacity-30 sm:right-4"
            >
              <ChevronRight className="h-4 w-4" />
            </SliderNextButton>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <SliderDotButton activeClass="!bg-[#a8d95a]" />
          </div>
        </Carousel>

        <p className="mt-4 text-center text-sm text-white/60">
          Zo House · Whitefield, Bangalore
        </p>
      </div>
    </Section>
  );
}
