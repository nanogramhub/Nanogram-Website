import type { LucideIcon } from "lucide-react";
import { Monitor, Moon, Sun, Zap, ZapOff } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { Switch } from "@/components/ui/switch";
import { usePerformance } from "@/hooks/use-performance";
import { useTheme } from "@/hooks/use-theme";
import { api } from "@/lib/appwrite/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { Theme } from "@/types";

const PrefItem = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between py-4 px-2">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-muted">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const UserPrefs = () => {
  const { theme, setTheme } = useTheme();
  const { performance, setPerformance } = usePerformance();
  const { prefs, setPrefs } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const updateCloudPrefs = async (newPrefs: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      await api.auth.updatePrefs(newPrefs);
      setPrefs(newPrefs);
    } catch {
      toast.error("Failed to sync preferences to cloud");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme as Theme);
    await updateCloudPrefs({ ...prefs, theme: newTheme });
  };

  const handlePerformanceChange = async (newPerf: boolean) => {
    setPerformance(newPerf);
    await updateCloudPrefs({ ...prefs, performance: newPerf });
  };

  return (
    <div className="flex flex-col divide-y">
      <PrefItem
        icon={theme === "dark" ? Moon : theme === "light" ? Sun : Monitor}
        title="Theme Mode"
        description="Choose between light, dark, or system theme"
      >
        <SegmentedTabs
          value={theme}
          disabled={isLoading}
          onValueChange={handleThemeChange}
          options={[
            { value: "light", icon: Sun },
            { value: "dark", icon: Moon },
            { value: "system", icon: Monitor },
          ]}
        />
      </PrefItem>

      <PrefItem
        icon={performance ? Zap : ZapOff}
        title="App Performance"
        description="Disable smooth transitions and heavy animations"
      >
        <Switch
          checked={performance}
          disabled={isLoading}
          onCheckedChange={handlePerformanceChange}
        />
      </PrefItem>
    </div>
  );
};

export default UserPrefs;
