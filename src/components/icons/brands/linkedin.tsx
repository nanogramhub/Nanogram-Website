import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

const LinkedIn = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="9 6 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("size-4", className)}
    {...props}
  >
    <rect width="32" height="32" x="9" y="6" rx="2" fill="#0077b5" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.775 14.284c0 1.245-.948 2.253-2.43 2.253-1.426 0-2.374-1.008-2.344-2.253-.03-1.306.918-2.284 2.372-2.284s2.373.978 2.402 2.284M14.12 32.819V18.316h4.507v14.502zm8.12-9.874c0-1.81-.06-3.352-.12-4.627h3.915l.208 1.987h.09c.592-.92 2.075-2.312 4.477-2.312 2.965 0 5.19 1.957 5.19 6.226v8.602h-4.508v-8.037c0-1.87-.652-3.144-2.283-3.144-1.246 0-1.987.86-2.283 1.69-.119.297-.178.711-.178 1.127v8.364h-4.507z"
      fill="#fff"
    />
  </svg>
);
export default LinkedIn;
