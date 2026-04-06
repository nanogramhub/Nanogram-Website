import React from "react";

import { cn } from "@/lib/utils";
import type { LinkifyOptions } from "@/types";

export function linkifyReact(
  text: string,
  options: LinkifyOptions = {},
): React.ReactNode {
  const {
    target = "_blank",
    rel = "noopener noreferrer",
    className = "",
  } = options;

  const urlRegex = /\b(https?:\/\/[^\s]+|www\.[^\s]+)\b/g;

  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // If it matches the URL regex, render as link
    if (urlRegex.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;

      return (
        <a
          key={index}
          href={href}
          target={target}
          rel={rel}
          className={cn("text-wrap", className)}
        >
          {part}
        </a>
      );
    }

    // Otherwise return plain text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
