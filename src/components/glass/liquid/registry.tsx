import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type RefObject,
  type ReactNode,
} from "react";

export type GlassVariant = "panel" | "nav";

interface GlassTarget {
  id: string;
  ref: RefObject<HTMLElement | null>;
  variant: GlassVariant;
}

interface LiquidGlassRegistryContextValue {
  targets: GlassTarget[];
  register: (id: string, ref: RefObject<HTMLElement | null>, variant: GlassVariant) => void;
  unregister: (id: string) => void;
}

const LiquidGlassRegistryContext = createContext<LiquidGlassRegistryContextValue | null>(null);

export function LiquidGlassProvider({ children }: { children: ReactNode }) {
  const [targets, setTargets] = useState<GlassTarget[]>([]);

  const register = useCallback(
    (id: string, ref: RefObject<HTMLElement | null>, variant: GlassVariant) => {
      setTargets((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { id, ref, variant };
          return next;
        }
        return [...prev, { id, ref, variant }];
      });
    },
    [],
  );

  const unregister = useCallback((id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ targets, register, unregister }),
    [targets, register, unregister],
  );

  return (
    <LiquidGlassRegistryContext.Provider value={value}>
      {children}
    </LiquidGlassRegistryContext.Provider>
  );
}

export function useLiquidGlassRegistry() {
  const ctx = useContext(LiquidGlassRegistryContext);
  if (!ctx) throw new Error("useLiquidGlassRegistry must be used within LiquidGlassProvider");
  return ctx;
}

export function useGlassTarget(
  ref: RefObject<HTMLElement | null>,
  variant: GlassVariant,
  enabled = true,
) {
  const id = useId();
  const { register, unregister } = useLiquidGlassRegistry();

  useEffect(() => {
    if (!enabled) return;
    register(id, ref, variant);
    return () => unregister(id);
  }, [id, ref, variant, register, unregister, enabled]);
}
