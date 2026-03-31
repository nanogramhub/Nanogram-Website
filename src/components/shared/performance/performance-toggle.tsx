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
    <Toggle
      variant="default"
      size="lg"
      className={cn("cursor-pointer relative", className)}
      onClick={() => setPerformance(!performance)}
    >
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "transition-all",
            performance ? "rotate-0 scale-100" : "-rotate-90 scale-0",
          )}
        >
          <Leaf />
        </TooltipTrigger>
        <TooltipContent>
          <p>Low Performance</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "absolute transition-all",
            performance ? "rotate-90 scale-0" : "rotate-0 scale-100",
          )}
        >
          <Gauge />
        </TooltipTrigger>
        <TooltipContent>
          <p>High Performance</p>
        </TooltipContent>
      </Tooltip>

      <span className="sr-only">Toggle performance</span>
    </Toggle>
  );
}
