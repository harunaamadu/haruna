"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { cn, EASE, stagger } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "About",    href: "#about"      },
  { label: "Skills",   href: "#skills"     },
  { label: "Projects", href: "#projects"   },
  { label: "Blog",     href: "#blog"       },
  { label: "Contact",  href: "#contact"    },
];

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com/haruna",          Icon: Github   },
  { label: "LinkedIn", href: "https://linkedin.com/in/haruna",     Icon: Linkedin },
  { label: "Twitter",  href: "https://twitter.com/harunadev",      Icon: Twitter  },
  { label: "Instagram",href: "https://instagram.com/harunadev",    Icon: Instagram},
  { label: "Email",    href: "mailto:hello@haruna.dev",            Icon: Mail     },
];

// Smooth-scroll helper shared across nav items
function scrollTo(href: string) {
  if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden bg-primary text-primary-foreground"
    >
      {/* ── Top gradient border ─────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary-foreground) 30%, transparent) 40%, var(--secondary) 60%, transparent)",
        }}
        aria-hidden
      />

      {/* ── Background texture ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--primary-foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      {/* ── Ambient glow ────────────────────────────────────────────────── */}
      <div
        className="absolute -top-24 right-[-8%] size-90 rounded-full
                   pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--secondary) 18%, transparent) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-16 left-[-5%] size-70 rounded-full
                   pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary-foreground) 6%, transparent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden
      />

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="container-haruna relative z-10">

        {/* ── Upper block ─────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 xl:gap-16
                     py-14 border-b"
          style={{
            borderColor:
              "color-mix(in oklch, var(--primary-foreground) 12%, transparent)",
          }}
        >
          {/* Left — logo + tagline */}
          <div className="flex flex-col gap-5 max-w-sm">
            {/* Logo */}
            <button
              onClick={() => scrollTo("#")}
              className="flex items-baseline gap-1 w-fit bg-transparent border-none
                         cursor-pointer p-0 group"
              aria-label="Back to top"
            >
              <span
                className="font-serif text-2xl tracking-tight leading-none
                           text-primary-foreground transition-opacity duration-300
                           group-hover:opacity-80"
                style={{ letterSpacing: "-0.01em" }}
              >
                Haruna
              </span>
              <motion.span
                className="self-end mb-1 size-1.25 rounded-full bg-secondary"
                whileHover={{ scale: 1.4 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
            </button>

            {/* Tagline */}
            <p
              className="text-sm leading-[1.8]"
              style={{
                color:
                  "color-mix(in oklch, var(--primary-foreground) 65%, transparent)",
              }}
            >
              Full-stack web developer crafting elegant digital experiences
              at the intersection of engineering and design.
            </p>

            {/* Availability pill */}
            <div className="flex items-center gap-2.5 w-fit">
              <span
                className="size-2 rounded-full shrink-0"
                style={{
                  background: "oklch(70% 0.18 145)",
                  boxShadow:  "0 0 0 3px oklch(70% 0.18 145 / 0.25)",
                }}
                aria-hidden
              />
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{
                  color:
                    "color-mix(in oklch, var(--primary-foreground) 70%, transparent)",
                }}
              >
                Available for new projects
              </span>
            </div>
          </div>

          {/* Right — nav + socials */}
          <div className="flex flex-col gap-8">
            {/* Quick nav */}
            <div className="flex flex-col gap-1">
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-3"
                style={{
                  color:
                    "color-mix(in oklch, var(--primary-foreground) 40%, transparent)",
                }}
              >
                Navigation
              </p>
              <nav
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1
                           lg:grid-cols-3 gap-x-8 gap-y-1"
                aria-label="Footer navigation"
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: stagger(i, 60),
                      duration: 0.5,
                      ease: EASE.spring,
                    }}
                    className={cn(
                      "group flex items-center gap-1.5 w-fit",
                      "bg-transparent border-none cursor-pointer p-0",
                      "text-[13px] font-medium transition-colors duration-200",
                    )}
                    style={{
                      color:
                        "color-mix(in oklch, var(--primary-foreground) 65%, transparent)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--primary-foreground)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "color-mix(in oklch, var(--primary-foreground) 65%, transparent)";
                    }}
                  >
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100
                                 group-hover:translate-x-0 transition-all duration-200"
                      aria-hidden
                    />
                    {link.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Social icons */}
            <div className="flex flex-col gap-3">
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-semibold"
                style={{
                  color:
                    "color-mix(in oklch, var(--primary-foreground) 40%, transparent)",
                }}
              >
                Follow
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ label, href, Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: stagger(i, 55),
                      duration: 0.4,
                      ease: EASE.spring,
                    }}
                  >
                    <Link
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="group flex items-center justify-center size-9
                                 rounded-xl transition-all duration-200"
                      style={{
                        background:
                          "color-mix(in oklch, var(--primary-foreground) 8%, transparent)",
                        color:
                          "color-mix(in oklch, var(--primary-foreground) 65%, transparent)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background =
                          "color-mix(in oklch, var(--secondary) 22%, transparent)";
                        el.style.color = "var(--secondary)";
                        el.style.boxShadow =
                          "0 4px 16px color-mix(in oklch, var(--secondary) 25%, transparent)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background =
                          "color-mix(in oklch, var(--primary-foreground) 8%, transparent)";
                        el.style.color =
                          "color-mix(in oklch, var(--primary-foreground) 65%, transparent)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      <Icon size={16} strokeWidth={1.6} aria-hidden />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Lower bar ───────────────────────────────────────────────── */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 py-6"
        >
          {/* Copyright */}
          <p
            className="text-[12px]"
            style={{
              color:
                "color-mix(in oklch, var(--primary-foreground) 45%, transparent)",
            }}
          >
            © {year}{" "}
            <span className="uppercase font-semibold tracking-[0.08em]">
              Haruna
            </span>
            . All rights reserved.
          </p>

          {/* Built-with note */}
          <p
            className="text-[11px]"
            style={{
              color:
                "color-mix(in oklch, var(--primary-foreground) 35%, transparent)",
            }}
          >
            Built with{" "}
            <span
              className="font-medium"
              style={{
                color:
                  "color-mix(in oklch, var(--secondary) 80%, var(--primary-foreground))",
              }}
            >
              Next.js
            </span>
            {" · "}
            <span
              className="font-medium"
              style={{
                color:
                  "color-mix(in oklch, var(--secondary) 80%, var(--primary-foreground))",
              }}
            >
              Tailwind CSS
            </span>
            {" · "}
            <span
              className="font-medium"
              style={{
                color:
                  "color-mix(in oklch, var(--secondary) 80%, var(--primary-foreground))",
              }}
            >
              Framer Motion
            </span>
          </p>

          {/* Back to top */}
          <motion.button
            onClick={() => scrollTo("#")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 bg-transparent border-none
                       cursor-pointer p-0 text-[11px] font-semibold uppercase
                       tracking-[0.14em] transition-colors duration-200"
            style={{
              color:
                "color-mix(in oklch, var(--primary-foreground) 45%, transparent)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "var(--primary-foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "color-mix(in oklch, var(--primary-foreground) 45%, transparent)";
            }}
            aria-label="Back to top"
          >
            Back to top
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              aria-hidden
            >
              <path
                d="M6 10V2M2 6l4-4 4 4"
                stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

      </div>
    </footer>
  );
}