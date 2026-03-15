"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, type UseInViewOptions } from "framer-motion";
import { cn, EASE } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RevealProps {
  children: ReactNode;
  /**
   * Framer Motion delay in seconds before the animation starts.
   * Useful for staggering sibling reveals.
   * @default 0
   */
  delay?: number;
  /**
   * How far (in px) the element starts below its resting position.
   * @default 28
   */
  distance?: number;
  /**
   * Animation duration in seconds.
   * @default 0.72
   */
  duration?: number;
  /**
   * IntersectionObserver margin — controls how early/late the trigger fires.
   * Negative values trigger before the element fully enters the viewport.
   * Accepts the same values as `UseInViewOptions["margin"]`.
   * @default "-70px 0px"
   */
  margin?: UseInViewOptions["margin"];
  /**
   * Whether to animate only once (true) or every time it enters view.
   * @default true
   */
  once?: boolean;
  /** Extra Tailwind classes on the motion wrapper. */
  className?: string;
  /** Inline styles passed directly to the motion wrapper. */
  style?: CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * `<Reveal />` — scroll-triggered fade-up entrance animation.
 *
 * Wraps any content in a `motion.div` that fades in and rises from
 * `distance` pixels below its final position when the element enters
 * the viewport. Powered by Framer Motion `useInView`.
 *
 * @example
 *   <Reveal>
 *     <h2>Hello world</h2>
 *   </Reveal>
 *
 *   // Staggered siblings
 *   {items.map((item, i) => (
 *     <Reveal key={item.id} delay={stagger(i, 100)}>
 *       <Card>{item.name}</Card>
 *     </Reveal>
 *   ))}
 */
export function Reveal({
  children,
  delay    = 0,
  distance = 28,
  duration = 0.72,
  margin   = "-70px 0px",
  once     = true,
  className,
  style,
}: RevealProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={style}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration, ease: EASE.spring }}
    >
      {children}
    </motion.div>
  );
}