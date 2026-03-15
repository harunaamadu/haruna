"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn, EASE, stagger } from "@/lib/utils";
import { Eyebrow, Reveal, MasteryBar, SkillChip, Marquee } from "@/components";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "Frontend" | "Backend" | "Tools" | "Design";

interface Skill {
  name:      string;
  level:     number;
  icon:      string;
  category:  Category;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SKILLS: Skill[] = [
  // Frontend
  { name: "React",         level: 95, icon: "⚛",  category: "Frontend" },
  { name: "Next.js",       level: 92, icon: "▲",   category: "Frontend" },
  { name: "TypeScript",    level: 90, icon: "TS",  category: "Frontend" },
  { name: "Tailwind CSS",  level: 93, icon: "🌊",  category: "Frontend" },
  { name: "Framer Motion", level: 80, icon: "◍",   category: "Frontend" },
  { name: "GSAP",          level: 78, icon: "⚡",  category: "Frontend" },
  { name: "HTML & CSS",    level: 98, icon: "❯",   category: "Frontend" },
  { name: "Shadcn/ui",     level: 88, icon: "◈",   category: "Frontend" },
  // Backend
  { name: "Node.js",       level: 85, icon: "⬡",   category: "Backend"  },
  { name: "Express",       level: 83, icon: "Ex",  category: "Backend"  },
  { name: "PostgreSQL",    level: 78, icon: "🐘",  category: "Backend"  },
  { name: "MongoDB",       level: 75, icon: "🍃",  category: "Backend"  },
  { name: "Prisma",        level: 80, icon: "◆",   category: "Backend"  },
  { name: "REST APIs",     level: 90, icon: "⇄",   category: "Backend"  },
  { name: "GraphQL",       level: 70, icon: "◉",   category: "Backend"  },
  // Tools
  { name: "Git & GitHub",  level: 92, icon: "⑂",   category: "Tools"    },
  { name: "VS Code",       level: 95, icon: "{}",  category: "Tools"    },
  { name: "Docker",        level: 68, icon: "🐳",  category: "Tools"    },
  { name: "Vercel",        level: 88, icon: "▲",   category: "Tools"    },
  { name: "Linux / CLI",   level: 80, icon: "$_",  category: "Tools"    },
  // Design
  { name: "Figma",         level: 76, icon: "✦",   category: "Design"   },
  { name: "Design Systems",level: 82, icon: "⊞",   category: "Design"   },
  { name: "Typography",    level: 85, icon: "Aa",  category: "Design"   },
  { name: "Motion Design", level: 74, icon: "◍",   category: "Design"   },
  { name: "Color Theory",  level: 80, icon: "◑",   category: "Design"   },
];

const CATEGORIES: Category[] = ["Frontend", "Backend", "Tools", "Design"];

const MARQUEE_ITEMS = [
  "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
  "PostgreSQL", "GSAP", "Framer Motion", "Docker", "Figma",
  "GraphQL", "Prisma", "Vercel", "Git", "REST APIs",
];

const APPROACH = [
  { num: "01", heading: "Always Learning",    body: "Tech evolves fast. I dedicate time every week to exploring new tools and deepening existing skills." },
  { num: "02", heading: "Depth Over Breadth", body: "I'd rather go 200m deep in a few areas than 5m deep in many — true expertise requires sustained focus." },
  { num: "03", heading: "Ship & Iterate",     body: "Skills are only as valuable as what they produce. I believe in shipping, then relentlessly refining." },
  { num: "04", heading: "Cross-Domain",       body: "Design sensibility makes me a better engineer, and engineering instincts make me a better designer." },
] as const;

// ─── CategoryTab ──────────────────────────────────────────────────────────────
interface CategoryTabProps {
  label:   Category;
  active:  boolean;
  count:   number;
  onClick: () => void;
}

function CategoryTab({ label, active, count, onClick }: CategoryTabProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "flex items-center gap-1.75",
        "px-5 py-2.5 rounded-full border-none cursor-pointer",
        "text-[12px] font-semibold uppercase tracking-widest",
        "transition-colors duration-300",
        active
          ? "bg-primary text-primary-foreground"
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

// ─── ApproachCard ─────────────────────────────────────────────────────────────
interface ApproachCardProps {
  num:     string;
  heading: string;
  body:    string;
  index:   number;
}

function ApproachCard({ num, heading, body, index }: ApproachCardProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "p-8 border-r border-border cursor-default",
        "transition-colors duration-300",
        hov ? "bg-primary/5" : "bg-card",
      )}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: stagger(index, 100), duration: 0.65, ease: EASE.spring }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Number */}
      <p className="font-serif text-[13px] text-primary mb-4 tracking-[0.04em]">
        {num}
      </p>

      {/* Accent line — expands on hover */}
      <motion.div
        className="h-[1.5px] rounded-full bg-primary mb-4"
        style={{ transformOrigin: "left" }}
        animate={{ scaleX: hov ? 1 : 0.2 }}
        transition={{ duration: 0.4, ease: EASE.spring }}
      />

      <h4 className="font-serif text-[17px] font-medium text-foreground tracking-[-0.01em] mb-2.5">
        {heading}
      </h4>
      <p className="text-[13px] leading-[1.75] text-muted-foreground">
        {body}
      </p>
    </motion.div>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────
export default function Skills() {
  const [activeTab, setActiveTab] = useState<Category>("Frontend");

  const filtered  = SKILLS.filter(s => s.category === activeTab);
  const topSkills = [...filtered].sort((a, b) => b.level - a.level).slice(0, 6);

  return (
    <section
      id="skills"
      className="section-padding container-haruna bg-background relative overflow-hidden"
    >
      {/* Background accent blob */}
      <div
        className="absolute -bottom-[10%] -left-[8%] w-[45vw] h-[45vw] max-w-150 max-h-150
                   rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%)",
          filter:     "blur(90px)",
        }}
        aria-hidden
      />

      <div className="relative z-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <div className="flex flex-wrap justify-between items-end gap-6">
            {/* Headline */}
            <div className="max-w-145">
              <Eyebrow label="Skills & Expertise" />
              <h2 className="font-serif text-[clamp(38px,6vw,68px)] font-medium
                             tracking-[-0.03em] leading-none text-foreground m-0">
                The tools I{" "}
                <em className="not-italic gradient-text">wield</em>
                {" "}with precision.
              </h2>
            </div>

            {/* Big count stat */}
            <div className="text-right">
              <p className="font-serif text-[clamp(42px,6vw,72px)] font-medium
                            tracking-[-0.03em] leading-none text-foreground m-0">
                {SKILLS.length}
                <span className="text-primary">+</span>
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground m-0">
                Technologies mastered
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Marquee ─────────────────────────────────────────────────────── */}
        <Reveal className="mb-16">
          <Marquee items={MARQUEE_ITEMS} />
        </Reveal>

        {/* ── Category tabs ───────────────────────────────────────────────── */}
        <Reveal className="mb-12">
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted rounded-full w-fit">
            {CATEGORIES.map(cat => (
              <CategoryTab
                key={cat}
                label={cat}
                active={activeTab === cat}
                count={SKILLS.filter(s => s.category === cat).length}
                onClick={() => setActiveTab(cat)}
              />
            ))}
          </div>
        </Reveal>

        {/* ── Bars + Chips grid ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid gap-12 mb-20"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE.spring }}
          >
            {/* Mastery bars */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold
                            text-muted-foreground mb-7">
                Mastery Levels
              </p>
              {topSkills.map((s, i) => (
                <MasteryBar key={s.name} name={s.name} level={s.level} index={i} />
              ))}
            </div>

            {/* Skill chips */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold
                            text-muted-foreground mb-7">
                All Technologies
              </p>
              <div
                className="grid gap-2.5"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))" }}
              >
                {filtered.map((s, i) => (
                  <SkillChip
                    key={`${s.name}-${s.category}`}
                    name={s.name}
                    icon={s.icon}
                    level={s.level}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Approach cards ───────────────────────────────────────────────── */}
        <Reveal>
          <div
            className="grid gap-px rounded-[20px] overflow-hidden border border-border"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}
          >
            {APPROACH.map((card, i) => (
              <ApproachCard key={card.num} {...card} index={i} />
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}