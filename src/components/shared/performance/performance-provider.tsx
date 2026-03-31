import { useState } from "react";

import { PerformanceProviderContextProvider } from "@/context/performance-context";

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
    const [performance, setPerformance] = useState<boolean>(
        () => (localStorage.getItem(storageKey) === "true") || defaultPreference,
    );

    const value = {
        performance,
        setPerformance: (performance: boolean) => {
            localStorage.setItem(storageKey, performance.toString());
            setPerformance(performance);
        },
    };

    return (
        <PerformanceProviderContextProvider value={value}>
            {children}
        </PerformanceProviderContextProvider>
    );
}
