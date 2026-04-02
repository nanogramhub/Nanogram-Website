import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";

import { Toggle } from "../../ui/toggle";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <Toggle
            {...props}
            variant="default"
            size="lg"
            className={cn("cursor-pointer relative", className)}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span
              className={cn(
                "transition-all absolute",
                theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0",
              )}
            >
              <Sun />
            </span>

            <span
              className={cn(
                "transition-all absolute",
                theme === "light" ? "rotate-90 scale-0" : "rotate-0 scale-100",
              )}
            >
              <Moon />
            </span>

            <span className="sr-only">Toggle theme</span>
          </Toggle>
        )}
      />
      <TooltipContent>
        <p>{theme === "light" ? "Light Mode" : "Dark Mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
