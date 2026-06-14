import { useEffect, useState } from "react";
import PixelBlast from "./components/PixelBlast";
import ShinyText from "./components/ShinyText";

export default function App() {
  const [pop, setPop] = useState(false);
  useEffect(() => {
    setTimeout(() => setPop(true), 100);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#81ba2c"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div
          className="absolute size-72 rounded-full bg-[#f6f3ec]/[0.04] blur-3xl md:size-96"
          aria-hidden
        />
        <h1
          className={`relative transition-all duration-700 ${pop ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"}`}
        >
          <ShinyText
            text="Osmosis-hh"
            speed={3}
            delay={0.5}
            color="#ddd8cc"
            shineMidColor="#e8d4a8"
            shineColor="#fffef8"
            spread={105}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="premium-title font-heading text-center select-none"
          />
        </h1>
      </div>
    </div>
  );
}
