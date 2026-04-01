import { Gauge, Leaf } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

import { Toggle } from "../../ui/toggle";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PerformanceToggle({ className }: { className?: string }) {
  const { performance, setPerformance } = usePerformance();

  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <Toggle
            {...props}
            variant="default"
            size="lg"
            className={cn("cursor-pointer relative", className)}
            onClick={() => setPerformance(!performance)}
          >
            <span
              className={cn(
                "transition-all absolute",
                performance ? "rotate-0 scale-100" : "-rotate-90 scale-0",
              )}
            >
              <Leaf />
            </span>

            <span
              className={cn(
                "transition-all absolute",
                performance ? "rotate-90 scale-0" : "rotate-0 scale-100",
              )}
            >
              <Gauge />
            </span>

            <span className="sr-only">Toggle performance</span>
          </Toggle>
        )}
      />

      <TooltipContent>
        <p>{performance ? "Low Performance" : "High Performance"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
