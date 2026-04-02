import type { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  size?: number | string;
  showTitle?: boolean;
}