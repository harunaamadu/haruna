"use client";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EyebrowProps {
  /** The label text rendered in ALL CAPS with wide tracking. */
  label: string;
  /**
   * Additional Tailwind classes for the wrapper `<div>`.
   * Use this to override margin/spacing per section.
   * @default "mb-5"
   */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * `<Eyebrow />` — the small labelled line above section headings.
 *
 * Renders a short `var(--primary)` dash + an uppercase, wide-tracked
 * span. Fully driven by CSS custom properties so it inherits both
 * light and dark theme tokens automatically.
 *
 * @example
 *   <Eyebrow label="About Me" />
 *   <Eyebrow label="Projects" className="mb-8" />
 */
export function Eyebrow({ label, className }: EyebrowProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-5", className)}>
      {/* Decorative dash — color driven by --primary */}
      <span className="block w-8 h-0.5 bg-primary shrink-0" aria-hidden />

      {/* Label */}
      <span className="text-xs uppercase tracking-[0.22em] font-semibold text-primary leading-none">
        {label}
      </span>
    </div>
  );
}