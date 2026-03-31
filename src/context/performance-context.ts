import { createContext } from "react";

export type PerformanceProviderState = {
    performance: boolean;
    setPerformance: (performance: boolean) => void;
};

export const PerformanceProviderContext = createContext<
    PerformanceProviderState | undefined
>(undefined);

export const PerformanceProviderContextProvider = PerformanceProviderContext.Provider;
