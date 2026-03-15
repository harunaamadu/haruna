"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn, EASE } from "@/lib/utils";
import { PROJECTS } from "@/lib/constants";
import { Eyebrow, Reveal, ProjectCard } from "@/components";

// ─── Filter tabs ──────────────────────────────────────────────────────────────
type Filter = "All" | "Featured" | "Frontend" | "Backend" | "Open Source";

const FILTERS: Filter[] = ["All", "Featured", "Frontend", "Backend", "Open Source"];

const FILTER_MAP: Record<Filter, (p: (typeof PROJECTS)[number]) => boolean> = {
  "All":         ()  => true,
  "Featured":    (p) => p.featured,
  "Frontend":    (p) => p.tags.some(t => ["React","Next.js","TypeScript","Tailwind CSS","Framer Motion","GSAP"].includes(t)),
  "Backend":     (p) => p.tags.some(t => ["Node.js","PostgreSQL","MongoDB","Prisma","Redis","GraphQL","tRPC"].includes(t)),
  "Open Source": (p) => !!p.githubUrl,
};

// ─── Filter tab button ────────────────────────────────────────────────────────
function FilterTab({
  label, active, count, onClick,
}: {
  label: Filter; active: boolean;
  count: number; onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-full border-none cursor-pointer",
        "text-[12px] font-semibold uppercase tracking-widest",
        "transition-all duration-300",
        active
          ? "bg-primary text-primary-foreground shadow-primary"
          : "bg-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <span
        className={cn(
          "text-[10px] font-bold px-1.5 py-px rounded-full",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-border text-muted-foreground",
        )}
      >
        {count}
      </span>
    </motion.button>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax background blob
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  const filtered = PROJECTS.filter(FILTER_MAP[activeFilter]);
  const featured = filtered.filter(p => p.featured);
  const rest      = filtered.filter(p => !p.featured);

  // When "Featured" filter is active, show all filtered as featured layout
  const showAllFeatured = activeFilter === "Featured";

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden container-haruna section-padding bg-background"
    >
      {/* ── Background blobs ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none top-[10%] right-[-12%]
                   w-[40vw] max-w-140 aspect-square rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%)",
          filter:     "blur(100px)",
          y:          blobY,
        }}
        aria-hidden
      />
      <motion.div
        className="absolute pointer-events-none bottom-[5%] left-[-10%]
                   w-[35vw] max-w-120 aspect-square rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--secondary) 10%, transparent) 0%, transparent 70%)",
          filter:     "blur(90px)",
          y:          useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]),
        }}
        aria-hidden
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize:  "36px 36px",
        }}
        aria-hidden
      />

      <div className="relative z-10">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <div className="flex flex-wrap justify-between items-end gap-6">
            {/* Headline */}
            <div className="max-w-150">
              <Eyebrow label="Selected Work" />
              <h2
                className="font-serif font-medium leading-none text-foreground m-0"
                style={{ fontSize: "clamp(38px, 6vw, 72px)" }}
              >
                Projects built with{" "}
                <em className="not-italic gradient-text">intention.</em>
              </h2>
            </div>

            {/* Count stat */}
            <div className="text-right shrink-0">
              <p
                className="font-serif font-medium tracking-[-0.03em] leading-none
                           text-foreground m-0"
                style={{ fontSize: "clamp(42px, 6vw, 68px)" }}
              >
                {PROJECTS.length}
                <span className="text-primary">+</span>
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground m-0">
                Projects shipped
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Filter tabs ───────────────────────────────────────────────── */}
        <Reveal className="mb-12">
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted rounded-full w-fit">
            {FILTERS.map(f => (
              <FilterTab
                key={f}
                label={f}
                active={activeFilter === f}
                count={PROJECTS.filter(FILTER_MAP[f]).length}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>
        </Reveal>

        {/* ── Project grid ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE.spring }}
          >
            {filtered.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <span className="text-[48px] opacity-20">◈</span>
                <p className="text-muted-foreground text-sm">
                  No projects match this filter.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">

                {/* Featured cards — full-width stacked */}
                {(showAllFeatured ? filtered : featured).length > 0 && (
                  <div className="flex flex-col gap-5">
                    {(showAllFeatured ? filtered : featured).map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        variant="featured"
                      />
                    ))}
                  </div>
                )}

                {/* Remaining projects — 3-col responsive grid */}
                {!showAllFeatured && rest.length > 0 && (
                  <div
                    className="grid gap-5"
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                    }}
                  >
                    {rest.map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        variant="grid"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <Reveal className="mt-20">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-14
                       border border-border"
            style={{
              background: "linear-gradient(135deg, color-mix(in oklch, var(--primary) 6%, var(--card)) 0%, var(--card) 60%, color-mix(in oklch, var(--secondary) 5%, var(--card)) 100%)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute -top-20 -right-20 size-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 70%)",
                filter:     "blur(40px)",
              }}
              aria-hidden
            />
            <div
              className="absolute -bottom-16 -left-16 size-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, color-mix(in oklch, var(--secondary) 12%, transparent) 0%, transparent 70%)",
                filter:     "blur(36px)",
              }}
              aria-hidden
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row
                            items-start md:items-center justify-between gap-8">
              <div className="max-w-lg">
                <h3
                  className="font-serif font-medium tracking-[-0.025em]
                             text-foreground leading-tight mb-3"
                  style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
                >
                  Have a project in mind?
                </h3>
                <p className="text-sm leading-[1.8] text-muted-foreground">
                  I'm always open to discussing new ideas, collaborations, or
                  freelance opportunities. Let's build something great together.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full
                             bg-primary text-primary-foreground
                             text-[12px] font-semibold uppercase tracking-widest
                             transition-all duration-300"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    boxShadow: "0 8px 32px color-mix(in oklch, var(--primary) 35%, transparent)",
                  }}
                >
                  Start a conversation
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor"
                      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>

                <motion.a
                  href="https://github.com/haruna"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full
                             border border-border text-foreground
                             text-[12px] font-semibold uppercase tracking-widest
                             transition-colors duration-300 hover:border-primary hover:text-primary"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  View GitHub
                </motion.a>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}