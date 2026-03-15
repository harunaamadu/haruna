"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { cn, EASE, levelLabel, stagger } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MasteryBarProps {
  /** Skill name displayed on the left. */
  name: string;
  /**
   * Proficiency level, 0–100.
   * Drives both the bar width and the `levelLabel()` badge.
   */
  level: number;
  /**
   * Position index — used to stagger the entrance animation and
   * the GSAP bar fill delay.
   */
  index: number;
  /** Extra Tailwind classes on the root wrapper. */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * `<MasteryBar />` — animated horizontal skill proficiency bar.
 *
 * - Entrance: slides in from the left via Framer Motion, staggered by `index`.
 * - Bar fill: driven by GSAP `power3.out` on scroll entry for a smooth,
 *   satisfying draw effect that plain CSS transitions can't replicate.
 * - Colours: `bg-primary` fill on a `bg-border` track — inherits theme tokens.
 *
 * @example
 *   {skills.map((s, i) => (
 *     <MasteryBar key={s.name} name={s.name} level={s.level} index={i} />
 *   ))}
 */
export function MasteryBar({ name, level, index, className }: MasteryBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef  = useRef<HTMLDivElement>(null);
  const inView  = useInView(rootRef, { once: true, margin: "-60px 0px" });

  // GSAP fill animation — fires once inView becomes true
  useEffect(() => {
    if (!barRef.current || !inView) return;
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      {
        width:    `${level}%`,
        duration: 1.1,
        delay:    stagger(index, 90),   // 0, 0.09, 0.18 …
        ease:     "power3.out",
      },
    );
  }, [inView, level, index]);

  return (
    <motion.div
      ref={rootRef}
      className={cn("mb-4.5", className)}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: stagger(index, 70), duration: 0.6, ease: EASE.spring }}
    >
      {/* Label row */}
      <div className="flex justify-between items-baseline mb-1.75">
        <span className="text-xs font-medium tracking-[0.01em] text-foreground">
          {name}
        </span>

        <div className="flex items-center gap-2">
          {/* Human-readable level badge */}
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {levelLabel(level)}
          </span>
          {/* Numeric percentage */}
          <span className="text-[11px] font-bold text-primary tabular-nums">
            {level}%
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="h-1 rounded-full bg-border overflow-hidden">
        {/* Fill — GSAP controls width, Tailwind handles color */}
        <div
          ref={barRef}
          className="h-full w-0 rounded-full bg-primary"
          aria-valuenow={level}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
          aria-label={`${name} proficiency`}
        />
      </div>
    </motion.div>
  );
}