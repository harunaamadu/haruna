import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Animation constants ──────────────────────────────────────────────────────
/**
 * Framer Motion ease arrays — mirrors the CSS tokens in globals.css.
 * Use as:  transition={{ ease: EASE.spring }}
 */
export const EASE = {
  spring:    [0.22, 1, 0.36, 1]    as const,
  swipe:     [0.76, 0, 0.24, 1]    as const,
  inExpo:    [0.7,  0, 0.84, 0]    as const,
  outExpo:   [0.16, 1, 0.3,  1]    as const,
  inOutExpo: [0.87, 0, 0.13, 1]    as const,
} as const;
 
/**
 * Stagger delay helper — returns `index × stepMs` in seconds,
 * ready for Framer Motion `transition.delay`.
 *
 * @example
 *   transition={{ delay: stagger(i, 55) }}  →  0, 0.055, 0.11 …
 */
export function stagger(index: number, stepMs = 80): number {
  return (index * stepMs) / 1000;
}
 
// ─── Skill helpers ────────────────────────────────────────────────────────────
/**
 * Map a 0–100 proficiency level to a human-readable label.
 */
export function levelLabel(level: number): string {
  if (level >= 90) return "Expert";
  if (level >= 78) return "Advanced";
  if (level >= 65) return "Proficient";
  return "Familiar";
}
 
// ─── Number helpers ───────────────────────────────────────────────────────────
/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
 
/** Format a number as a percentage string. */
export function formatPct(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
 
// ─── String helpers ───────────────────────────────────────────────────────────
/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
 
/** Truncate a string to maxLength, appending "…" if needed. */
export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str;
}
 
/** Convert a string to a URL-safe slug. */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}