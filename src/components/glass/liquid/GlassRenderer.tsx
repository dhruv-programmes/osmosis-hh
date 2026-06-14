import { useLiquidGlassRegistry } from "./registry";
import { TrackedGlass } from "./TrackedGlass";

export default function GlassRenderer() {
  const { targets } = useLiquidGlassRegistry();

  return (
    <>
      {targets.map((target) => (
        <TrackedGlass
          key={target.id}
          targetRef={target.ref}
          variant={target.variant}
        />
      ))}
    </>
  );
}
