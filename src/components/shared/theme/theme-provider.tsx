import { useEffect } from "react";

import { ThemeProviderContextProvider } from "@/context/theme-context";
import { useStickyState } from "@/hooks/useStickyState";
import { useAuthStore } from "@/store/use-auth-store";
import type { Theme } from "@/types";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useStickyState<Theme>(defaultTheme, storageKey);
  const cloudTheme = useAuthStore((s) => s.prefs.theme);

  useEffect(() => {
    if (cloudTheme && cloudTheme !== theme) {
      setTheme(cloudTheme as Theme);
    }
  }, [cloudTheme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContextProvider value={value}>
      {children}
    </ThemeProviderContextProvider>
  );
}
