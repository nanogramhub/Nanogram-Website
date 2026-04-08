import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface TagsInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  ({ className, value = [], onChange, placeholder, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        const newValue = [...value, inputValue.trim()];
        onChange?.(newValue);
        setInputValue("");
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        onChange?.(value.slice(0, -1));
      }
    };

    const removeTag = (indexToRemove: number) => {
      onChange?.(value.filter((_, index) => index !== indexToRemove));
    };

    return (
      <div
        className={cn(
          "flex min-h-20 w-full flex-col rounded-md border border-input bg-input/20 p-2 text-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 dark:bg-input/30",
          className,
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="outline"
              className="px-1.5 py-0 h-6 gap-1 bg-secondary/50 dark:bg-secondary/20"
            >
              {tag}
              <button
                type="button"
                className="ml-1 rounded-full outline-none hover:bg-muted p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <input
          {...props}
          ref={(node) => {
            if (node) {
              (inputRef as any).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as any).current = node;
            }
          }}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted-foreground md:text-xs/relaxed"
        />
      </div>
    );
  },
);

TagsInput.displayName = "TagsInput";
