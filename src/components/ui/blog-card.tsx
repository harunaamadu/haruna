"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn, EASE, stagger } from "@/lib/utils";
import { SanityBlogPost } from "../../../sanity/lib/client";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface BlogCardProps {
  post:     SanityBlogPost;
  index:    number;
  onClick:  (post: SanityBlogPost) => void;
  /** "featured" = large horizontal; "grid" = compact vertical */
  variant?: "featured" | "grid";
}

// ─── Featured blog card ───────────────────────────────────────────────────────
function FeaturedBlogCard({
  post, index, onClick,
}: Omit<BlogCardProps, "variant">) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  const accentVar = post.accent === "primary" ? "var(--primary)" : "var(--secondary)";

  return (
    <motion.article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Read: ${post.title}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: stagger(index, 120), duration: 0.8, ease: EASE.spring }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => onClick(post)}
      onKeyDown={(e) => e.key === "Enter" && onClick(post)}
      className="group relative grid grid-cols-1 md:grid-cols-[1fr_1fr]
                 overflow-hidden rounded-2xl border border-border bg-card
                 cursor-pointer transition-[border-color,box-shadow] duration-300"
      style={{
        borderColor: hov ? `color-mix(in oklch, ${accentVar} 40%, transparent)` : undefined,
        boxShadow:   hov ? `0 20px 60px color-mix(in oklch, ${accentVar} 14%, transparent)` : undefined,
      }}
    >
      {/* ── Left: visual panel ── */}
      <div
        className="relative min-h-50 md:min-h-0 overflow-hidden"
        style={{
          background: `linear-gradient(145deg,
            color-mix(in oklch, ${accentVar} 12%, var(--card)) 0%,
            var(--card) 100%)`,
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 35% 40%,
              color-mix(in oklch, ${accentVar} 22%, transparent) 0%,
              transparent 65%)`,
            opacity: hov ? 1 : 0.5,
          }}
          aria-hidden
        />

        {/* Big glyph */}
        <motion.span
          className="absolute font-serif select-none pointer-events-none font-medium leading-none"
          style={{
            fontSize:      "clamp(100px, 16vw, 180px)",
            color:         `color-mix(in oklch, ${accentVar} 12%, transparent)`,
            letterSpacing: "-0.04em",
            bottom:        -20,
            right:         -8,
          }}
          animate={{ scale: hov ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: EASE.spring }}
          aria-hidden
        >
          {post.coverGlyph}
        </motion.span>

        {/* Category pill */}
        <span
          className="absolute top-5 left-5 text-[10px] font-bold uppercase
                     tracking-[0.16em] px-3 py-1 rounded-full"
          style={{
            background: `color-mix(in oklch, ${accentVar} 14%, transparent)`,
            color:      `color-mix(in oklch, ${accentVar} 90%, var(--foreground))`,
            border:     `1px solid color-mix(in oklch, ${accentVar} 22%, transparent)`,
          }}
        >
          {post.category}
        </span>

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(${accentVar} 1px, transparent 1px),
                              linear-gradient(90deg, ${accentVar} 1px, transparent 1px)`,
            backgroundSize:  "36px 36px",
          }}
          aria-hidden
        />
      </div>

      {/* ── Right: content ── */}
      <div className="flex flex-col justify-between p-8 lg:p-10">
        <div>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            <span className="size-1 rounded-full bg-border" aria-hidden />
            <span className="text-[11px] text-muted-foreground">
              {post.readTime} min read
            </span>
          </div>

          <h3 className="font-serif text-[clamp(20px,2.2vw,26px)] font-medium
                         tracking-[-0.02em] text-foreground mb-3 leading-tight">
            {post.title}
          </h3>
          <p className="text-sm leading-[1.8] text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full
                           bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Read CTA */}
          <motion.span
            className="flex items-center gap-1.5 text-[11px] font-semibold
                       uppercase tracking-[0.12em] shrink-0 ml-3"
            style={{ color: accentVar }}
            animate={{ x: hov ? 3 : 0 }}
            transition={{ duration: 0.25 }}
          >
            Read
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor"
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Grid blog card ───────────────────────────────────────────────────────────
function GridBlogCard({
  post, index, onClick,
}: Omit<BlogCardProps, "variant">) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  const accentVar = post.accent === "primary" ? "var(--primary)" : "var(--secondary)";

  return (
    <motion.article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Read: ${post.title}`}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: stagger(index, 90), duration: 0.7, ease: EASE.spring }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={() => onClick(post)}
      onKeyDown={(e) => e.key === "Enter" && onClick(post)}
      className="group relative flex flex-col overflow-hidden rounded-2xl
                 border border-border bg-card cursor-pointer
                 transition-[border-color,box-shadow,transform] duration-300"
      style={{
        borderColor: hov ? `color-mix(in oklch, ${accentVar} 38%, transparent)` : undefined,
        boxShadow:   hov ? `0 14px 44px color-mix(in oklch, ${accentVar} 12%, transparent)` : undefined,
        transform:   hov ? "translateY(-4px)" : undefined,
      }}
    >
      {/* Visual header */}
      <div
        className="relative h-32 overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            color-mix(in oklch, ${accentVar} 10%, var(--card)) 0%,
            var(--card) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 30% 50%,
              color-mix(in oklch, ${accentVar} 20%, transparent) 0%,
              transparent 70%)`,
            opacity: hov ? 1 : 0.4,
          }}
          aria-hidden
        />

        {/* Glyph */}
        <span
          className="absolute font-serif font-medium select-none pointer-events-none leading-none"
          style={{
            fontSize:      88,
            color:         `color-mix(in oklch, ${accentVar} 12%, transparent)`,
            bottom:        -16,
            right:         -4,
            letterSpacing: "-0.04em",
          }}
          aria-hidden
        >
          {post.coverGlyph}
        </span>

        {/* Category */}
        <span
          className="absolute top-4 left-4 text-[10px] font-bold uppercase
                     tracking-[0.14em] px-2.5 py-0.5 rounded-full"
          style={{
            background: `color-mix(in oklch, ${accentVar} 14%, transparent)`,
            color:      `color-mix(in oklch, ${accentVar} 90%, var(--foreground))`,
            border:     `1px solid color-mix(in oklch, ${accentVar} 22%, transparent)`,
          }}
        >
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
          <span className="size-1 rounded-full bg-border" aria-hidden />
          <span className="text-[11px] text-muted-foreground">
            {post.readTime} min
          </span>
        </div>

        <h3 className="font-serif text-[16px] font-medium tracking-[-0.01em]
                       text-foreground leading-tight mb-2.5 flex-1">
          {post.title}
        </h3>
        <p className="text-[13px] leading-[1.7] text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-wrap gap-1">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full
                           bg-muted text-muted-foreground font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <motion.span
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: accentVar }}
            animate={{ x: hov ? 3 : 0 }}
            transition={{ duration: 0.25 }}
          >
            Read →
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function BlogCard({ post, index, onClick, variant = "grid" }: BlogCardProps) {
  if (variant === "featured") {
    return <FeaturedBlogCard post={post} index={index} onClick={onClick} />;
  }
  return <GridBlogCard post={post} index={index} onClick={onClick} />;
}