"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE } from "@/lib/utils";
import { JOURNEY } from "@/lib/constants";
import { Eyebrow, Reveal } from "@/components";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ValueCardData {
  icon:  React.ReactNode;
  label: string;
  desc:  string;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const VALUES: ValueCardData[] = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    label: "Craft-first",
    desc:  "Every pixel and every function deserves intentional thought.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    label: "Iterative",
    desc:  "Ship early, learn fast, and relentlessly improve over time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Human-centred",
    desc:  "Technology is a tool. People are the point.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    label: "Performance",
    desc:  "Beautiful interfaces that are also blazing fast.",
  },
];

// ─── ValueCard ────────────────────────────────────────────────────────────────
function ValueCard({ icon, label, desc, index }: ValueCardData & { index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: EASE.spring }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: EASE.spring } }}
      // Base styles via Tailwind; dynamic hover shadows via onMouse handlers
      // because color-mix() expressions can't be expressed as static classes.
      className="group relative flex flex-col gap-4 rounded-2xl p-6 cursor-default
                 bg-card border border-border
                 transition-[box-shadow,border-color] duration-300"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow  = "0 12px 40px color-mix(in oklch, var(--primary) 12%, transparent)";
        el.style.borderColor = "color-mix(in oklch, var(--primary) 35%, transparent)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow  = "";
        el.style.borderColor = "";
      }}
    >
      {/* Icon badge */}
      <div
        className="flex items-center justify-center size-10 rounded-xl
                   text-primary transition-colors duration-300"
        style={{ background: "color-mix(in oklch, var(--primary) 10%, transparent)" }}
      >
        {icon}
      </div>

      <div>
        <h5 className="font-serif text-base font-medium text-foreground
                       tracking-[-0.01em] mb-1">
          {label}
        </h5>
        <p className="text-[13px] leading-[1.7] text-muted-foreground">
          {desc}
        </p>
      </div>

      {/* Corner accent — fades in on hover */}
      <div className="absolute top-0 right-0 size-16 opacity-0 group-hover:opacity-100
                      transition-opacity duration-500 pointer-events-none
                      overflow-hidden rounded-2xl">
        <div
          className="absolute -top-8 -right-8 size-16 rounded-full"
          style={{ background: "color-mix(in oklch, var(--primary) 8%, transparent)" }}
        />
      </div>
    </motion.div>
  );
}

// ─── JourneyItem ──────────────────────────────────────────────────────────────
function JourneyItem({
  year, title, body, index, isLast,
}: {
  year: string; title: string; body: string;
  index: number; isLast: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const isActive = index === JOURNEY.length - 1;

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6 sm:gap-8"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: EASE.spring }}
    >
      {/* ── Spine ── */}
      <div className="flex flex-col items-center shrink-0 w-9">
        {/* Node dot */}
        <motion.div
          className="relative z-10 flex items-center justify-center rounded-full shrink-0 size-9"
          style={{
            // Active (last) node uses primary fill; others are outlined
            background:   isActive ? "var(--primary)"    : "var(--background)",
            border:       `1.5px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
          }}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.2, duration: 0.5, type: "spring", stiffness: 260 }}
        >
          <span
            className="text-[10px] font-bold tracking-tight"
            style={{ color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
          >
            {year.slice(2)}
          </span>
        </motion.div>

        {/* Connecting line */}
        {!isLast && (
          <motion.div
            className="flex-1 w-px mt-1.5 bg-border"
            style={{ minHeight: 32 }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.35, duration: 0.6, ease: EASE.spring }}
          />
        )}
      </div>

      {/* ── Content ── */}
      <div className={isLast ? "pb-0" : "pb-10"}>
        <p className="text-[11px] uppercase tracking-[0.18em] font-semibold
                      text-primary mb-1">
          {year}
        </p>
        <h4 className="font-serif text-[clamp(17px,2vw,20px)] font-medium
                       text-foreground tracking-[-0.01em] mb-2">
          {title}
        </h4>
        <p className="text-sm leading-[1.8] text-muted-foreground max-w-95">
          {body}
        </p>
      </div>
    </motion.div>
  );
}

// ─── ProfileFrame ─────────────────────────────────────────────────────────────
function ProfileFrame() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  // GSAP continuous float
  useEffect(() => {
    if (!ref.current) return;
    const tween = gsap.to(ref.current, {
      y:        "-10px",
      duration: 4,
      repeat:   -1,
      yoyo:     true,
      ease:     "sine.inOut",
    });
    return () => { tween.kill(); };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, x: 40 }}
      animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: EASE.spring }}
      className="relative mx-auto lg:mx-0"
      style={{ width: "min(360px, 90vw)", aspectRatio: "3/4" }}
    >
      {/* Offset decorative border — purely visual, behind the card */}
      <div
        className="absolute inset-0 top-4 left-4 rounded-3xl z-0"
        style={{ border: "1.5px solid color-mix(in oklch, var(--primary) 30%, transparent)" }}
        aria-hidden
      />

      {/* Card */}
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden z-1 border border-border/70"
        style={{
          // Subtle gradient from a tinted primary to neutral card
          background:  "linear-gradient(155deg, color-mix(in oklch, var(--primary) 8%, var(--card)) 0%, var(--card) 100%)",
          boxShadow:   "0 24px 64px color-mix(in oklch, var(--foreground) 10%, transparent)",
        }}
      >
        {/* Inner radial glow */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 55% 30%, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 65%)" }}
          aria-hidden
        />

        {/* Large monogram */}
        <Image
          src='/haruna.png'
          alt="admin profile picture"
          fill
          className="absolute inset-0 select-none pointer-events-none object-cover"
          aria-hidden
        />

        {/* Name tag */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5"
          style={{ background: "linear-gradient(to top, color-mix(in oklch, var(--foreground) 55%, transparent), transparent)" }}
        >
          <h4 className="font-serif text-xl font-medium tracking-[-0.01em] leading-[1.2]
                        text-primary-foreground">
            Haruna
          </h4>
          <p className="text-xs uppercase tracking-[0.16em] mt-0.5"
            style={{ color: "color-mix(in oklch, var(--primary-foreground) 80%, transparent)" }}>
            Web Developer
          </p>
        </div>
      </div>

      {/* Badge — location */}
      <motion.div
        className="absolute flex items-center gap-2 rounded-full px-3.5 py-2
                   bg-background border border-border z-2
                   text-xs font-semibold text-foreground tracking-[0.03em] whitespace-nowrap"
        style={{
          top:       -16,
          left:      -20,
          boxShadow: "0 8px 24px color-mix(in oklch, var(--foreground) 8%, transparent)",
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-primary" aria-hidden>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Based in Ghana
      </motion.div>

      {/* Badge — experience */}
      <motion.div
        className="absolute rounded-2xl z-2 text-center whitespace-nowrap
                   bg-primary px-4.5 py-3"
        style={{
          bottom:    -16,
          right:     -20,
          boxShadow: "0 12px 32px color-mix(in oklch, var(--primary) 40%, transparent)",
        }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <p className="font-serif text-[26px] font-medium tracking-[-0.02em] leading-none
                      text-primary-foreground">
          5+
        </p>
        <p className="text-[10px] uppercase tracking-[0.14em] mt-0.75"
          style={{ color: "color-mix(in oklch, var(--primary-foreground) 70%, transparent)" }}>
          Yrs. Experience
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
export default function About() {
  const sectionRef   = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

  // GSAP: staggered paragraph reveal on scroll
  useEffect(() => {
    if (!textBlockRef.current) return;
    const lines = textBlockRef.current.querySelectorAll<HTMLElement>(".gsap-line");
    const ctx   = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.85,
          stagger:  0.14,
          ease:     "power3.out",
          scrollTrigger: {
            trigger: textBlockRef.current,
            start:   "top 78%",
            once:    true,
          },
        },
      );
    }, textBlockRef);
    return () => ctx.revert();
  }, []);

  // Parallax blob on scroll
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden container-haruna section-padding bg-background"
    >
      {/* ── Background blob ──────────────────────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none top-[5%] right-[-15%]
                   w-[55svw] max-w-175 aspect-square rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%)",
          filter:     "blur(80px)",
          y:          blobY,
        }}
        aria-hidden
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.028]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize:  "32px 32px",
        }}
        aria-hidden
      />

      <div className="relative z-10">

        {/* ── Headline ──────────────────────────────────────────────────── */}
        <Reveal className="mb-16 lg:mb-20">
          <Eyebrow label="About Me" />
          <h2
            className="font-serif font-medium leading-none text-foreground max-w-180"
            style={{ fontSize: "clamp(38px, 6vw, 72px)" }}
          >
            A developer who{" "}
            <em className="not-italic gradient-text py-1">
              thinks in systems
            </em>{" "}
            and builds with soul.
          </h2>
        </Reveal>

        {/* ── Profile + Bio grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr]
                        gap-16 xl:gap-24 items-start mb-24 lg:mb-32">
          <ProfileFrame />

          <div>
            {/* Bio — GSAP line-by-line reveal */}
            <div ref={textBlockRef} className="mb-10">
              <Eyebrow label="Who I Am" />
              {[
                "I'm Haruna, a full-stack web developer with a deep passion for crafting digital experiences that sit at the intersection of engineering and design. I believe the best software is invisible: it works so intuitively that users never have to think about it.",
                "My journey started with a single HTML file and grew into a love for building entire systems from pixel-perfect UIs to robust APIs. I thrive in the details: the micro-interaction that surprises, the architecture that scales, the line of code that's exactly right.",
                "When I'm not coding, I'm exploring design systems, contributing to open source, or mentoring developers earlier in their journey.",
              ].map((text, i) => (
                <p
                  key={i}
                  className="gsap-line mb-5 text-[clamp(14px,1.5vw,16px)] leading-[1.85]
                             text-muted-foreground font-sans"
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Pull quote */}
            <Reveal delay={0.1} className="mb-10">
              <blockquote className="relative pl-6 border-l-2 border-primary">
                <p className="font-serif italic text-[clamp(16px,2vw,20px)]
                              text-foreground tracking-[-0.01em] leading-[1.55]">
                  "I don't just write code, I craft experiences that make people feel something."
                </p>
              </blockquote>
            </Reveal>

            {/* Values grid */}
            <Reveal delay={0.15}>
              <Eyebrow label="What I Stand For" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VALUES.map((v, i) => (
                  <ValueCard key={v.label} {...v} index={i} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Journey timeline ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr]
                        gap-12 xl:gap-20 items-start">
          {/* Sticky heading */}
          <Reveal className="lg:sticky lg:top-24">
            <Eyebrow label="My Journey" />
            <h3
              className="font-serif font-medium tracking-[-0.025em] leading-[1.15]
                         text-foreground max-w-[320px]"
              style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
            >
              How I got <em className="not-italic font-serif text-primary">here</em> from there.
            </h3>

            {/* Download CV */}
            <motion.a
              href="/cv.pdf"
              className="inline-flex items-center gap-2 mt-8 rounded-full
                         text-xs font-semibold uppercase tracking-widest
                         border border-border px-5.5 py-3
                         text-foreground transition-colors duration-300"
              whileHover={{
                background:  "var(--primary)",
                color:       "var(--primary-foreground)",
                borderColor: "var(--primary)",
                scale:       1.02,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </motion.a>
          </Reveal>

          {/* Timeline */}
          <div className="relative">
            {JOURNEY.map((item, i) => (
              <JourneyItem
                key={item.year}
                {...item}
                index={i}
                isLast={i === JOURNEY.length - 1}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}