"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn, EASE, stagger } from "@/lib/utils";
import type { Project } from "@/lib/constants";
import { ArrowRight, Github } from "lucide-react";

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconArrow({ className }: { className?: string }) {
  return (
    <ArrowRight className="-rotate-45" size={14} />
  );
}

function IconGithub({ className }: { className?: string }) {
  return (
    <Github size={14} />
  );
}

// ─── Tag list ─────────────────────────────────────────────────────────────────
function TagList({
  tags, accent, compact = false,
}: {
  tags: Project["tags"]; accent: string; compact?: boolean;
}) {
  const visible = compact ? tags.slice(0, 3) : tags;
  const extra   = compact && tags.length > 3 ? tags.length - 3 : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center rounded-full font-medium",
            compact ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1",
          )}
          style={{
            background: `color-mix(in oklch, ${accent} 10%, transparent)`,
            color:      `color-mix(in oklch, ${accent} 80%, var(--foreground))`,
            border:     `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
          }}
        >
          {tag}
        </span>
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center rounded-full text-[10px] px-2 py-0.5
                         font-medium bg-muted text-muted-foreground">
          +{extra}
        </span>
      )}
    </div>
  );
}

// ─── Shared prop type ─────────────────────────────────────────────────────────
interface CardProps {
  project: Project;
  index:   number;
}

// ─── Featured card ────────────────────────────────────────────────────────────
/**
 * Large horizontal split-panel card.
 * Owns its own `useRef`, `useInView`, and `useState` — no ref prop passing.
 */
function FeaturedCard({ project, index }: CardProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: stagger(index, 120), duration: 0.8, ease: EASE.spring }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className={cn(
        "group relative grid grid-cols-1 md:grid-cols-[1fr_1.1fr] overflow-hidden",
        "rounded-2xl border border-border bg-card cursor-default",
        "transition-[border-color,box-shadow] duration-300",
      )}
      style={{
        borderColor: hov ? `color-mix(in oklch, ${project.accent} 40%, transparent)` : undefined,
        boxShadow:   hov ? `0 20px 60px color-mix(in oklch, ${project.accent} 14%, transparent)` : undefined,
      }}
    >
      {/* ── Left: content ── */}
      <div className="flex flex-col justify-between p-8 lg:p-10">
        <div>
          <div className="flex items-start justify-between mb-6">
            {/* Large number */}
            <span
              className="font-serif text-[clamp(48px,6vw,72px)] font-medium
                         leading-none tracking-[-0.04em] select-none"
              style={{ color: `color-mix(in oklch, ${project.accent} 20%, transparent)` }}
            >
              {project.number}
            </span>

            {/* Links */}
            <div className="flex items-center gap-2 mt-2">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.title} GitHub`}
                className="flex items-center justify-center size-9 rounded-full border
                           border-border text-muted-foreground hover:border-primary
                           hover:text-primary transition-colors duration-200">
                <IconGithub />
              </a>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="flex items-center justify-center size-9 rounded-full border
                           border-border text-muted-foreground hover:border-primary
                           hover:text-primary transition-colors duration-200">
                <IconArrow />
              </a>
            </div>
          </div>

          <h3 className="font-serif text-[clamp(20px,2.5vw,26px)] font-medium
                         tracking-[-0.02em] text-foreground mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-sm leading-[1.8] text-muted-foreground mb-4">
            {project.description}
          </p>
          <p className="text-[13px] leading-[1.75] text-muted-foreground/70 mb-6">
            {project.longDesc}
          </p>
        </div>

        <TagList tags={project.tags} accent={project.accent} />
      </div>

      {/* ── Right: visual panel ── */}
      <div
        className="relative min-h-55 md:min-h-0 overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            color-mix(in oklch, ${project.accent} 10%, var(--card)) 0%,
            var(--card) 100%)`,
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 40% 40%,
              color-mix(in oklch, ${project.accent} 20%, transparent) 0%,
              transparent 65%)`,
            opacity: hov ? 1 : 0.5,
          }}
          aria-hidden
        />

        {/* Large number watermark */}
        <span
          className="absolute font-serif font-medium select-none pointer-events-none
                     transition-transform duration-500"
          style={{
            fontSize:      "clamp(120px, 18vw, 200px)",
            color:         `color-mix(in oklch, ${project.accent} 10%, transparent)`,
            letterSpacing: "-0.06em",
            lineHeight:    1,
            bottom:        -24,
            right:         -12,
            transform:     hov ? "scale(1.04)" : "scale(1)",
          }}
          aria-hidden
        >
          {project.number}
        </span>

        {/* Rotating corner ornament */}
        <motion.div
          className="absolute top-6 left-6"
          animate={{ rotate: hov ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE.spring }}
        >
          <div
            className="size-3 rounded-sm"
            style={{ background: `color-mix(in oklch, ${project.accent} 50%, transparent)` }}
          />
        </motion.div>

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${project.accent} 1px, transparent 1px),
                              linear-gradient(90deg, ${project.accent} 1px, transparent 1px)`,
            backgroundSize:  "40px 40px",
          }}
          aria-hidden
        />
      </div>
    </motion.article>
  );
}

// ─── Grid card (compact) ──────────────────────────────────────────────────────
/**
 * Compact vertical card for the secondary projects grid.
 * Owns its own `useRef`, `useInView`, and `useState` — no ref prop passing.
 */
function GridCard({ project, index }: CardProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: stagger(index, 100), duration: 0.7, ease: EASE.spring }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "border border-border bg-card cursor-default",
        "transition-[border-color,box-shadow,transform] duration-300",
      )}
      style={{
        borderColor: hov ? `color-mix(in oklch, ${project.accent} 40%, transparent)` : undefined,
        boxShadow:   hov ? `0 16px 48px color-mix(in oklch, ${project.accent} 12%, transparent)` : undefined,
        transform:   hov ? "translateY(-4px)" : undefined,
      }}
    >
      {/* Visual panel */}
      <div
        className="relative h-36 overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            color-mix(in oklch, ${project.accent} 12%, var(--card)) 0%,
            var(--card) 100%)`,
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 30% 50%,
              color-mix(in oklch, ${project.accent} 22%, transparent) 0%,
              transparent 70%)`,
            opacity: hov ? 1 : 0.4,
          }}
          aria-hidden
        />

        {/* Number watermark */}
        <span
          className="absolute font-serif font-medium select-none pointer-events-none"
          style={{
            fontSize:      96,
            color:         `color-mix(in oklch, ${project.accent} 12%, transparent)`,
            letterSpacing: "-0.06em",
            lineHeight:    1,
            bottom:        -18,
            right:         -6,
          }}
          aria-hidden
        >
          {project.number}
        </span>

        {/* Number badge — top left */}
        <span
          className="absolute top-4 left-4 text-[11px] font-bold tracking-widest"
          style={{ color: `color-mix(in oklch, ${project.accent} 60%, var(--muted-foreground))` }}
        >
          {project.number}
        </span>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${project.accent} 1px, transparent 1px),
                              linear-gradient(90deg, ${project.accent} 1px, transparent 1px)`,
            backgroundSize:  "28px 28px",
          }}
          aria-hidden
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-serif text-[17px] font-medium tracking-[-0.01em]
                         text-foreground leading-tight max-w-[80%]">
            {project.title}
          </h3>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.title} GitHub`}
              className="size-7 flex items-center justify-center rounded-full
                         text-muted-foreground hover:text-primary transition-colors duration-200">
              <IconGithub />
            </a>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.title} live`}
              className="size-7 flex items-center justify-center rounded-full
                         text-muted-foreground hover:text-primary transition-colors duration-200">
              <IconArrow />
            </a>
          </div>
        </div>

        <p className="text-[13px] leading-[1.75] text-muted-foreground mb-4 flex-1">
          {project.description}
        </p>

        <TagList tags={project.tags} accent={project.accent} compact />
      </div>
    </motion.article>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * `<ProjectCard />` — dispatcher component.
 *
 * Renders `FeaturedCard` or `GridCard` based on `variant`.
 * Sub-components own all their hooks internally so no ref is ever
 * passed as a JSX prop (which breaks in React 19 without forwardRef).
 *
 * @example
 *   <ProjectCard project={p} index={i} variant="featured" />
 *   <ProjectCard project={p} index={i} variant="grid" />
 */
export function ProjectCard({
  project,
  index,
  variant = "grid",
}: {
  project:  Project;
  index:    number;
  variant?: "featured" | "grid";
}) {
  if (variant === "featured") return <FeaturedCard project={project} index={index} />;
  return <GridCard project={project} index={index} />;
}