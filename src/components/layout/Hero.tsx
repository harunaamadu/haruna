"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";

// ─── Easing helpers (matches globals.css tokens) ─────────────────────────────
const SPRING = [0.22, 1, 0.36, 1] as const;
const SWIPE = [0.76, 0, 0.24, 1] as const;

// ─── Roles that cycle in the subtitle ────────────────────────────────────────
const ROLES = [
  "Web Developer",
  "Graphic Design",
  "UI/UX Enthusiast",
  "Software Engineer",
  "Creative Technologist",
  "Teaching",
];

// ─── Floating orb config ─────────────────────────────────────────────────────
const ORBS = [
  {
    w: 480,
    h: 480,
    top: "-12%",
    right: "-8%",
    blur: 120,
    opacity: 0.13,
    delay: 0,
  },
  {
    w: 320,
    h: 320,
    top: "55%",
    left: "-5%",
    blur: 90,
    opacity: 0.09,
    delay: 0.4,
  },
  {
    w: 200,
    h: 200,
    top: "20%",
    left: "38%",
    blur: 60,
    opacity: 0.07,
    delay: 0.8,
  },
];

// ─── Utility: split text into animated spans ─────────────────────────────────
function SplitWord({ word, baseDelay }: { word: string; baseDelay: number }) {
  return (
    <>
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            delay: baseDelay + i * 0.028,
            duration: 0.75,
            ease: SPRING,
          }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}

// ─── Cycling role ticker ──────────────────────────────────────────────────────
function RoleTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((v) => (v + 1) % ROLES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ minWidth: "22ch" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: SPRING }}
          style={{ color: "var(--primary)" }}
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── Magnetic CTA button ──────────────────────────────────────────────────────
function MagneticButton({
  children,
  href,
  variant = "filled",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "filled" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const filled = variant === "filled";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }}
      whileTap={{ scale: 0.96 }}
      className="group relative flex items-center gap-3 rounded-full select-none cursor-pointer overflow-hidden text-sm tracking-widest font-bold uppercase p-4 px-8"
      style={{
        x,
        y,
        background: filled ? "var(--primary)" : "transparent",
        color: filled ? "var(--primary-foreground)" : "var(--primary)",
        border: filled
          ? "none"
          : "1.5px solid color-mix(in oklch, var(--foreground) 25%, transparent)",
      }}
    >
      {/* Hover shimmer */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: filled
            ? "linear-gradient(105deg, transparent 35%, color-mix(in oklch, var(--primary-foreground) 15%, transparent) 50%, transparent 65%)"
            : "color-mix(in oklch, var(--foreground) 5%, transparent)",
          transform: "skewX(-15deg)",
        }}
      />
      {children}
      {/* Arrow icon */}
      <motion.svg
        width="13"
        height="13"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0"
        initial={{ x: 0 }}
        whileHover={{ x: 3 }}
        transition={{ duration: 0.25 }}
      >
        <path
          d="M1 11L11 1M11 1H4M11 1V8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.a>
  );
}

// ─── Animated stat pill ───────────────────────────────────────────────────────
function StatPill({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: SPRING }}
      className="flex flex-col"
    >
      <span
        className="leading-none"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 500,
          color: "var(--foreground)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span className="mt-1 text-xs uppercase tracking-[0.15em] text-blue-600">
        {label}
      </span>
    </motion.div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 600], [0, 140]);
  const bgY = useSpring(rawY, { stiffness: 60, damping: 20 });

  // GSAP: animate the decorative horizontal rule on mount
  useEffect(() => {
    if (!lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1.4, delay: 1.6, ease: "power3.inOut" },
    );
  }, []);

  // GSAP: subtle cursor-following highlight on the large name
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const el = section.querySelector<HTMLElement>(".hero-name-highlight");
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const rx = ((e.clientX - rect.left) / rect.width) * 100;
      const ry = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.backgroundPosition = `${rx}% ${ry}%`;
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col justify-center overflow-hidden container-haruna section-padding"
      style={{
        minHeight: "100dvh",
        paddingTop: "var(--navbar-height, 72px)",
        background: "var(--background)",
      }}
    >
      {/* ── Background layer (parallax) ──────────────────────────────────── */}
      <motion.div
        ref={bgRef}
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        {/* Warm radial glow — top-right */}
        <div
          className="absolute opacity-25"
          style={{
            top: "-20%",
            right: "-10%",
            width: "70vw",
            height: "70vw",
            maxWidth: 800,
            maxHeight: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--foreground) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        {/* Subtle warm glow — bottom-left */}
        <div
          className="absolute"
          style={{
            bottom: "-15%",
            left: "-8%",
            width: "50vw",
            height: "50vw",
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--foreground) 12%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* Floating orbs */}
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-50"
            style={{
              width: orb.w,
              height: orb.h,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              background: `radial-gradient(circle, color-mix(in oklch, var(--foreground) 35%, transparent) 0%, transparent 70%)`,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
            }}
            animate={{
              y: [0, -24, 0],
              x: [0, 12, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 9 + i * 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay,
            }}
          />
        ))}

        {/* Fine grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Grain noise */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px",
          }}
        />
      </motion.div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="container-haruna section-padding relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-8 items-center">
        <div className="absolute inset-0 border bg-[url('/hero.png')] bg-cover mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] rounded-2xl -scale-x-100 z-0 brightness-150 opacity-40" />

        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col z-1">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: SPRING }}
            className="flex items-center gap-3 mb-8 self-start"
          >
            <span
              className="w-8 h-[1.5px]"
              style={{ background: "var(--primary)" }}
            />
            <span className="text-xs uppercase -tracking-tight font-semibold">
              Portfolio — 2026
            </span>
          </motion.div>

          {/* Name headline — character-by-character reveal */}
          <h1
            className="leading-tight overflow-hidden font-serif font-semibold tracking-wider"
            style={{ fontSize: "clamp(64px, 10vw, 140px)" }}
          >
            <span
              className="hero-name-highlight block"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, var(--primary) 0%, var(--secondary) 40%)",
                backgroundColor: "#333333",
                textShadow: "0 0 2px rgba(0 0 0 / 0.5)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                transition: "background-position 0.1s ease",
              }}
            >
              {"Haruna".split("").map((c, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    delay: 0.4 + i * -0.055,
                    duration: 0.8,
                    ease: SPRING,
                  }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Animated horizontal rule */}
          <div
            ref={lineRef}
            className="mb-7"
            style={{
              height: "1px",
              width: "100%",
              maxWidth: 480,
              background: "linear-gradient(90deg, var(--border), transparent)",
              transformOrigin: "left",
            }}
          />

          {/* Role ticker + short descriptor */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: SPRING }}
            className="mb-4"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(18px, 2.5vw, 26px)",
              color: "var(--muted-foreground)",
              letterSpacing: "-0.01em",
            }}
          >
            <RoleTicker />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: SPRING }}
            className="mb-10 max-w-120 text-shadow-2xs"
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              lineHeight: 1.8,
              fontFamily: "var(--font-sans)",
            }}
          >
            I craft elegant digital experiences where design precision meets
            engineering depth — building interfaces that feel as good as they
            look.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: SPRING }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <MagneticButton href="#projects" variant="filled">
              View My Work
            </MagneticButton>
            <MagneticButton href="#contact" variant="outline">
              Get In Touch
            </MagneticButton>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.5 }}
            className="flex items-start gap-8 sm:gap-12"
            style={{
              paddingTop: "clamp(0.8rem, 1.8vw, 1rem)",
              borderTop: "1px solid var(--border)",
              maxWidth: 480,
            }}
          >
            <StatPill value="5+" label="Years exp." delay={1.4} />
            <div className="w-px self-stretch bg-border" />
            <StatPill value="20+" label="Projects built" delay={1.5} />
            <div className="w-px self-stretch bg-border" />
            <StatPill value="100%" label="Passion" delay={1.6} />
          </motion.div>
        </div>

        {/* ── RIGHT: Decorative avatar / card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: SPRING }}
          className="hidden lg:flex items-center justify-center z-1"
        >
          <div className="relative" style={{ width: 340, height: 420 }}>
            {/* Card frame */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, color-mix(in oklch, var(--brand-light) 18%, var(--background)) 0%, var(--background) 100%)",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 32px 80px color-mix(in oklch, var(--brand-dark) 12%, transparent), 0 4px 20px color-mix(in oklch, var(--brand-medium) 8%, transparent)",
              }}
            />

            {/* Avatar placeholder — initials */}
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 35%, color-mix(in oklch, var(--foreground) 28%, transparent) 0%, transparent 65%)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 120,
                  fontWeight: 500,
                  letterSpacing: "-0.06em",
                  color:
                    "color-mix(in oklch, var(--foreground) 30%, transparent)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                H
              </span>
            </div>

            <motion.div
              className="absolute flex items-center gap-2 rounded-full px-4 py-2 -top-5 -right-5 bg-background border border-border/30 text-xs font-semibold tracking-wider text-foreground"
              style={{
                boxShadow:
                  "0 8px 24px color-mix(in oklch, var(--foreground) 10%, transparent)",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "oklch(70% 0.18 145)",
                  boxShadow: "0 0 0 4px oklch(70% 0.18 145 / 0.2)",
                }}
              />
              Available for work
            </motion.div>

            {/* Floating badge — stack */}
            <motion.div
              className="absolute flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                bottom: -18,
                left: -18,
                background: "var(--primary)",
                boxShadow:
                  "0 8px 24px color-mix(in oklch, var(--primary) 35%, transparent)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--primary-foreground)",
                letterSpacing: "0.04em",
              }}
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
            >
              React · Next.js · TypeScript
            </motion.div>

            {/* Corner ornament */}
            <svg
              className="absolute"
              style={{ bottom: 20, right: 20, opacity: 0.12 }}
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle
                cx="24"
                cy="24"
                r="23"
                stroke="var(--foreground)"
                strokeWidth="1"
              />
              <circle
                cx="24"
                cy="24"
                r="15"
                stroke="var(--foreground)"
                strokeWidth="0.75"
              />
              <circle
                cx="24"
                cy="24"
                r="7"
                stroke="var(--foreground)"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.7, ease: SPRING }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        aria-hidden
      >
        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--prmary)" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px rounded-full bg-primary/50 h-10"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.2,
          }}
        />
      </motion.div>

      {/* ── Decorative rotated label ─────────────────────────────────────── */}
      <motion.span
        className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 -rotate-90 z-10 uppercase text-muted-foreground whitespace-nowrap text-xs tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        harunadev.com — Web Developer
      </motion.span>
    </section>
  );
}
