import React, { useState } from "react";
import { Monitor, Moon, Sun, Zap, ZapOff } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { usePerformance } from "@/hooks/use-performance";
import { useTheme } from "@/hooks/use-theme";
import { api } from "@/lib/appwrite/api";
import { useAuthStore } from "@/store/use-auth-store";

const PrefItem = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
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

  const updateCloudPrefs = async (newPrefs: Record<string, any>) => {
    setIsLoading(true);
    try {
      await api.auth.updatePrefs(newPrefs);
      setPrefs(newPrefs);
    } catch (error) {
      toast.error("Failed to sync preferences to cloud");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme as any);
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
        <div className="flex bg-muted p-1 rounded-lg gap-1 ring-1 ring-border">
          <button
            onClick={() => handleThemeChange("light")}
            disabled={isLoading}
            className={`p-1.5 rounded-md transition-all ${
              theme === "light"
                ? "bg-background shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            disabled={isLoading}
            className={`p-1.5 rounded-md transition-all ${
              theme === "dark"
                ? "bg-background shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            disabled={isLoading}
            className={`p-1.5 rounded-md transition-all ${
              theme === "system"
                ? "bg-background shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-4 w-4" />
          </button>
        </div>
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
