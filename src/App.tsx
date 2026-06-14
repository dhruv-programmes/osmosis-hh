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
        <h1
          className={`transition-all duration-700 ${pop ? "scale-110 opacity-100" : "scale-95 opacity-0"}`}
        >
          <ShinyText
            text="Osmosis-hh"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-7xl font-black font-sans tracking-wide text-center select-none drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] md:text-9xl"
          />
        </h1>
      </div>
    </div>
  );
}
