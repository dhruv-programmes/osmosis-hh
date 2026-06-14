import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface PixelDustContextValue {
  canvas: HTMLCanvasElement | null;
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
}

const PixelDustContext = createContext<PixelDustContextValue | null>(null);

export function PixelDustProvider({ children }: { children: ReactNode }) {
  const [canvas, setCanvasState] = useState<HTMLCanvasElement | null>(null);

  const setCanvas = useCallback((next: HTMLCanvasElement | null) => {
    setCanvasState((prev) => (prev === next ? prev : next));
  }, []);

  const value = useMemo(() => ({ canvas, setCanvas }), [canvas, setCanvas]);

  return (
    <PixelDustContext.Provider value={value}>{children}</PixelDustContext.Provider>
  );
}

export function usePixelDustCanvas() {
  const ctx = useContext(PixelDustContext);
  if (!ctx) throw new Error("usePixelDustCanvas must be used within PixelDustProvider");
  return ctx;
}
