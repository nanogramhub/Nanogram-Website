import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (start: number, end?: number, step = 1) => {
  let output: number[] = [];

  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i += step) {
    output.push(i);
  }

  return output;
};

/**
 * Formats an ISO date string into a custom human-readable format.
 *
 * Common format patterns:
 * - `"PPP"`: Dec 31st, 2026 (Default)
 * - `"PP"`: Dec 31, 2026
 * - `"p"`: 10:30 PM
 * - `"PPPp"`: Dec 31st, 2026 at 10:30 PM
 * - `"do MMM yyyy"`: 31st Mar 2026
 * - `"eeee, MMMM do"`: Tuesday, March 31st
 * - `"yyyy-MM-dd"`: 2026-03-31
 *
 * @param isoString - The ISO date string to be formatted.
 * @param formatStr - The date-fns format specifier (defaults to "PPP").
 * @returns The formatted date string.
 */
export function formatDateTime(isoString: string, formatStr: string = "PPP") {
  return format(parseISO(isoString), formatStr);
}

/**
 * Formats an ISO date string into a relative time string.
 *
 * Examples:
 * - "just now"
 * - "5 minutes ago"
 * - "2 hours ago"
 * - "3 days ago"
 *
 * @param isoString - The ISO date string to be formatted.
 * @param addSuffix - Whether to include "ago" / "in" (default: true).
 * @returns The relative time string.
 */
export function formatRelativeTime(
  isoString: string,
  addSuffix: boolean = true,
) {
  const date = parseISO(isoString);

  return formatDistanceToNow(date, {
    addSuffix,
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function kebabCasetoTitleCase(str: string) {
  return str.split("-").map(capitalize).join(" ");
}

export function getInitials(name: string) {
  // if firstname and lastname are present then return first letter of each
  // else return first two letter of the name
  const names = name.split(" ");
  if (names.length > 1) {
    return names
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
