import { useEffect } from "react";

import { PerformanceProviderContextProvider } from "@/context/performance-context";
import { useStickyState } from "@/hooks/useStickyState";
import { useAuthStore } from "@/store/use-auth-store";

type PerformanceProviderProps = {
  children: React.ReactNode;
  defaultPreference?: boolean;
  storageKey?: string;
};

export function PerformanceProvider({
  children,
  defaultPreference = false,
  storageKey = "nanogram-performance",
}: PerformanceProviderProps) {
  const [performance, setPerformance] = useStickyState<boolean>(
    defaultPreference,
    storageKey,
  );
  const cloudPerf = useAuthStore((s) => s.prefs.performance);

  useEffect(() => {
    if (cloudPerf !== undefined && cloudPerf !== performance) {
      setPerformance(cloudPerf);
    }
  }, [cloudPerf, performance, setPerformance]);

  const value = {
    performance,
    setPerformance,
  };

  return (
    <PerformanceProviderContextProvider value={value}>
      {children}
    </PerformanceProviderContextProvider>
  );
}
