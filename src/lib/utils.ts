import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (start: number, end?: number, step = 1) => {
  const output: number[] = [];

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

/**
 * Generates a random alphanumeric string of a given length.
 * @param length - The length of the string to generate.
 * @returns A random alphanumeric string.
 */
export function generateRandomString(length: number = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Converts a string into a URL-friendly slug.
 * @param title - The string to slugify.
 * @returns The slugified string.
 */
export function slugify(title: string): string {
  return title
    .normalize("NFKD") // split accented chars
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace to dash
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dash
}

/**
 * Converts a camelCase, PascalCase, snake_case, or mixed string
 * into a human-readable Title Case string.
 *
 * Examples:
 *  - "camelCaseString"   -> "Camel Case String"
 *  - "PascalCase"        -> "Pascal Case"
 *  - "snake_case_value"  -> "Snake Case Value"
 *  - "mixed-Format_str"  -> "Mixed Format Str"
 *
 * @param str - Input string in camelCase, PascalCase, snake_case, or mixed format
 * @returns A Title Case formatted string with words separated by spaces
 */
export function camelCaseToTitleCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates a random filename with an optional prefix and extension.
 * @param prefix - An optional prefix for the filename.
 * @param extension - An optional extension (including the dot, e.g., ".jpg").
 * @returns A random filename.
 */
export function generateRandomFileName(
  extension: string = ".jpg",
  prefix: string = "file",
) {
  const timestamp = Date.now();
  const randomStr = generateRandomString(6);
  return `${prefix}_${timestamp}_${randomStr}${extension}`;
}

/**
 * Formats a size in bytes into a human-readable string (e.g., "1.2 MB").
 * @param bytes - The size in bytes.
 * @returns A formatted size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function truncate(str: string, length: number = 20, expanded?: boolean) {
  const isLong = str.length > length;
  return {
    isLong,
    truncated:
      isLong && !expanded ? str.slice(0, length).trimEnd() + "..." : str,
  };
}
