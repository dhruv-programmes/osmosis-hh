import { TextReveal } from "@/components/ui/text-reveal";
import { MissionStats } from "@/components/sections/MissionStats";
import { MISSION_COPY } from "@/lib/missionCopy";

export { MISSION_COPY };

export default function HeroMission() {
  return (
    <section aria-label="Mission statement" className="relative text-white">
      <TextReveal
        footer={<MissionStats />}
        highlightWords={["AI", "CRYPTO", "WEB3"]}
      >
        {MISSION_COPY}
      </TextReveal>
    </section>
  );
}
