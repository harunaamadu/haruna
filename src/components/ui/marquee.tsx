"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MarqueeProps {
  /**
   * Array of label strings to display in the strip.
   * The array is automatically doubled for a seamless loop.
   */
  items: string[];
  /**
   * Seconds for one full loop of the duplicated strip.
   * Longer = slower scroll.
   * @default 28
   */
  duration?: number;
  /**
   * Direction of scroll.
   * @default "left"
   */
  direction?: "left" | "right";
  /** Extra Tailwind classes on the outer wrapper. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * `<Marquee />` — infinite horizontally-scrolling tech label strip.
 *
 * - Seamless loop: the `items` array is duplicated so the animation
 *   can animate from `0%` to `-50%` and repeat with no jump.
 * - Edge masks: left + right gradient fades blend the strip into the
 *   section background using `var(--background)`.
 * - Separator: a `var(--primary)` dot between each label.
 * - Borders: thin `var(--border)` lines above and below.
 *
 * @example
 *   <Marquee items={["React", "Next.js", "TypeScript", "Node.js"]} />
 *   <Marquee items={tools} duration={40} direction="right" />
 */
export function Marquee({
  items,
  duration  = 28,
  direction = "left",
  className,
}: MarqueeProps) {
  // Double items for a seamless infinite loop
  const doubled = [...items, ...items];

  const xStart = direction === "left" ? "0%"   : "-50%";
  const xEnd   = direction === "left" ? "-50%"  : "0%";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "py-5 mt-2",
        "border-y border-border",
        className,
      )}
    >
      {/* Left fade mask */}
      <div
        className="absolute left-0 inset-y-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, var(--background), transparent)" }}
        aria-hidden
      />
      {/* Right fade mask */}
      <div
        className="absolute right-0 inset-y-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, var(--background), transparent)" }}
        aria-hidden
      />

      {/* Scrolling track */}
      <motion.div
        className="flex w-max"
        animate={{ x: [xStart, xEnd] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        aria-hidden   // decorative; screen readers don't need this
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-5 px-7 border-r border-border"
          >
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-muted-foreground whitespace-nowrap">
              {item}
            </span>
            {/* Dot separator */}
            <span
              className="size-1 rounded-full bg-primary shrink-0"
              aria-hidden
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}