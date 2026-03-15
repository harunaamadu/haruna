"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn, EASE, stagger } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SkillChipProps {
  /** Skill name. */
  name: string;
  /**
   * Short icon string — emoji, abbreviation, or symbol.
   * Strings longer than 2 chars render at a smaller font size.
   */
  icon: string;
  /**
   * Proficiency 0–100.
   * Drives the mini progress bar width.
   */
  level: number;
  /**
   * Grid position — used for staggered entrance timing.
   */
  index: number;
  /** Extra Tailwind classes on the root wrapper. */
  className?: string;
}

// Mini progress bar width in px at 100%
const BAR_MAX_PX = 48;

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * `<SkillChip />` — compact icon + name + mini progress tile.
 *
 * Features:
 * - Staggered scale-in entrance via Framer Motion + `useInView`.
 * - Hover: lifts `y: -3`, scales up 4%, warm primary border glow.
 * - Icon badge background uses `color-mix` tints of `--primary`.
 * - Mini 2 px bar animates width on scroll entry.
 * - All colours reference CSS custom properties — theme-aware.
 *
 * @example
 *   {skills.map((s, i) => (
 *     <SkillChip key={s.name} name={s.name} icon={s.icon} level={s.level} index={i} />
 *   ))}
 */
export function SkillChip({ name, icon, level, index, className }: SkillChipProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Layout
        "flex items-center gap-2.5 p-[10px_16px] rounded-xl",
        // Colours — static base; hover overrides applied via inline style
        "bg-card border border-border",
        // Cursor
        "cursor-default select-none",
        // Overflow (for future shimmer effects)
        "relative overflow-hidden",
        className,
      )}
      style={{
        // Dynamic tokens can't be expressed as static Tailwind classes
        background: hov
          ? "color-mix(in oklch, var(--primary) 8%, var(--card))"
          : undefined,
        borderColor: hov
          ? "color-mix(in oklch, var(--primary) 30%, transparent)"
          : undefined,
        boxShadow: hov
          ? "0 8px 24px color-mix(in oklch, var(--primary) 10%, transparent)"
          : "0 1px 4px color-mix(in oklch, var(--border) 60%, transparent)",
        transition: "background 0.25s, border-color 0.25s, box-shadow 0.25s",
      }}
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: stagger(index, 55), duration: 0.55, ease: EASE.spring }}
      whileHover={{ y: -3, scale: 1.04 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={()   => setHov(false)}
    >
      {/* ── Icon badge ── */}
      <div
        className={cn(
          "size-8.5 rounded-sm shrink-0",
          "flex items-center justify-center",
          "font-bold leading-none",
          // Font size: smaller for multi-char icons (e.g. "TS", "$_")
          icon.length > 2 ? "text-[11px]" : "text-[15px]",
        )}
        style={{
          background: hov
            ? "color-mix(in oklch, var(--primary) 15%, transparent)"
            : "color-mix(in oklch, var(--primary) 8%, transparent)",
          color:      "var(--primary)",
          letterSpacing: "-0.02em",
          transition: "background 0.25s",
        }}
        aria-hidden
      >
        {icon}
      </div>

      {/* ── Name + mini bar ── */}
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-foreground tracking-[0.01em] leading-[1.2] truncate">
          {name}
        </p>

        {/* Mini progress bar */}
        <div
          className="mt-1 h-0.5 rounded-full bg-border overflow-hidden"
          style={{ width: BAR_MAX_PX }}
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={inView ? { width: (level / 100) * BAR_MAX_PX } : {}}
            transition={{
              delay:    stagger(index, 55) + 0.35,
              duration: 0.9,
              ease:     "easeOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}