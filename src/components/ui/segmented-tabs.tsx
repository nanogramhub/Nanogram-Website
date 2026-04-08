import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import React from "react";

type BaseValue = string | number | boolean;

type TabOption<T extends BaseValue> = {
  value: T;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;

  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

type SegmentedTabsProps<T extends BaseValue> = {
  options: TabOption<T>[];
  value: T;
  onValueChange: (value: T) => void;

  variant?: "icon" | "text" | "hybrid";
  disabled?: boolean;
} & React.ComponentProps<"div">;

const segmentVariants = cva(
  "flex items-center justify-center gap-1 rounded-md transition-all",
  {
    variants: {
      variant: {
        icon: "p-1.5",
        text: "px-2 py-1.5",
        hybrid: "px-2 py-1.5",
      },
      isActive: {
        true: "bg-primary shadow-sm text-primary-foreground",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "hybrid",
      isActive: false,
    },
  },
);

export function SegmentedTabs<T extends BaseValue>({
  options,
  value,
  onValueChange,
  variant = "hybrid",
  disabled,
  className,
  ...divProps
}: SegmentedTabsProps<T>) {
  return (
    <div
      {...divProps}
      className={cn(
        "flex w-fit bg-input/20 dark:bg-input/30 p-1 rounded-lg gap-1 border border-input",
        className,
      )}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = opt.value === value;

        return (
          <button
            key={String(opt.value)}
            type="button"
            disabled={disabled || opt.buttonProps?.disabled}
            onClick={(e) => {
              opt.buttonProps?.onClick?.(e);
              if (!disabled) onValueChange(opt.value);
            }}
            className={cn(
              segmentVariants({ variant, isActive }),
              opt.buttonProps?.className,
            )}
            {...opt.buttonProps}
          >
            {(variant === "icon" || variant === "hybrid") && Icon && (
              <Icon className="h-4 w-4" />
            )}

            {(variant === "text" || variant === "hybrid") && opt.label && (
              <span className="text-xs">{opt.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
