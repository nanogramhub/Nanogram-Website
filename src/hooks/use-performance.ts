import { useContext } from "react";

import { PerformanceProviderContext } from "@/context/performance-context";

export const usePerformance = () => {
    const context = useContext(PerformanceProviderContext);

    if (!context) {
        throw new Error("usePerformance must be used within a PerformanceProvider");
    }

    return context;
};
