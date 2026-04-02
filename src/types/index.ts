import type { LucideIcon } from "lucide-react";

export type Theme = "dark" | "light" | "system";

type Position = [number, number, number];

export interface Point {
  idx: number;
  position: Position;
  color: string;
}

export type NavigationItems = { to: string; icon: LucideIcon; label: string }[];

export type LinkifyOptions = {
  target?: "_blank" | "_self";
  rel?: string;
  className?: string;
};
