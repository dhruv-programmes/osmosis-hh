import { useId } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
  fpsLimit?: number;
};

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
  fpsLimit = 60,
}: ParticlesProps) => {
  const controls = useAnimation();
  const generatedId = useId();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      await controls.start({
        opacity: 1,
        transition: { duration: 1 },
      });
    }
  };

  return (
    <ParticlesProvider init={loadSlim}>
      <motion.div animate={controls} className={cn("opacity-0", className)}>
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: { value: background || "transparent" },
            },
            fullScreen: { enable: false },
            fpsLimit,
            particles: {
              color: { value: particleColor || "#ffffff" },
              move: {
                enable: true,
                speed: { min: 0.1, max: speed || 1 },
              },
              number: {
                density: { enable: true },
                value: particleDensity || 120,
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: { enable: true, speed: speed || 4 },
              },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </motion.div>
    </ParticlesProvider>
  );
};
