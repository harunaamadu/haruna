"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated hamburger → X */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-6 h-5 flex flex-col justify-between" aria-hidden>
      <motion.span
        className="block h-px w-full bg-current origin-center rounded-full"
        animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.span
        className="block h-px w-full bg-current rounded-full"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-px w-full bg-current origin-center rounded-full"
        animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

/** Desktop nav link — consumes --foreground / --primary CSS vars */
function DesktopLink({
  href,
  label,
  index,
}: {
  href: string;
  label: string;
  index: number;
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 * index + 0.3,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="link-underline text-[13px] tracking-[0.12em] uppercase font-medium
                 transition-colors duration-300"
      style={{
        color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.color =
          "color-mix(in oklch, var(--foreground) 70%, transparent)")
      }
      onClick={(e) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {label}
    </motion.a>
  );
}

/** Mobile drawer link */
function MobileLink({
  href,
  label,
  index,
  onClose,
}: {
  href: string;
  label: string;
  index: number;
  onClose: () => void;
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        delay: 0.05 * index + 0.1,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex items-center gap-4 leading-none py-2 font-serif text-primary-foreground font-semibold transition-colors tracking-wide"
      style={{
        fontSize: "clamp(26px, 5.5vw, 44px)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.color =
          "var(--muted-foreground)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.color =
          "var(--primary-foreground)")
      }
      onClick={(e) => {
        e.preventDefault();
        onClose();
        setTimeout(
          () =>
            document
              .querySelector(href)
              ?.scrollIntoView({ behavior: "smooth" }),
          500,
        );
      }}
    >
      {/* Index number */}
      <span
        className="text-[11px] tracking-[0.15em] uppercase font-medium w-6 shrink-0"
        style={{ color: "var(--primary-foreground)", opacity: 0.35 }}
      >
        0{index + 1}
      </span>

      {/* Label with underline */}
      <span className="relative">
        {label}
        <span
          className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-500 bg-primary-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)",
          }}
        />
      </span>
    </motion.a>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const diff = y - lastScrollY.current;
    setScrolled(y > 40);
    if (y > 200) {
      if (diff > 4) setHidden(true);
      if (diff < -4) setHidden(false);
    } else {
      setHidden(false);
    }
    lastScrollY.current = y;
  });

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── Bar ────────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className="transition-all duration-700"
          style={{
            background: scrolled ? "var(--navbar-bg-scrolled)" : "transparent",
            backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
            WebkitBackdropFilter: scrolled
              ? "blur(18px) saturate(160%)"
              : "none",
            borderBottom: scrolled
              ? "1px solid var(--navbar-border-scrolled)"
              : "1px solid transparent",
            boxShadow: scrolled ? "var(--navbar-shadow-scrolled)" : "none",
          }}
        >
          <nav className="container-haruna flex items-center justify-between h-20">
            {/* ── Logo ── */}
            <motion.a
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex items-baseline gap-0.75 select-none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span
                className={`text-xl md:text-2xl font-serif leading-4 tracking-wide transition-colors ${
                  menuOpen ? "text-white!" : ""
                }`}
              >
                Haruna
              </span>

              <motion.span
                className={`self-end mb-1 w-1.25 aspect-square rounded-full bg-primary ${menuOpen && "bg-white"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.65,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 320,
                }}
              />
            </motion.a>

            {/* ── Desktop links ── */}
            <ul className="hidden md:flex items-center gap-8 lg:gap-10 list-none m-0 p-0">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href}>
                  <DesktopLink {...link} index={i} />
                </li>
              ))}
            </ul>

            {/* ── Desktop CTA — var(--primary) + var(--primary-foreground) ── */}
            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.55,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hidden md:flex items-center justify-center gap-2.5
                        w-fit p-4 rounded-xl text-white! border-none cursor-pointer
                        text-sm font-semibold uppercase tracking-[0.12em]
                        transition-all duration-300 overflow-hidden"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--primary)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 24px color-mix(in oklch, var(--primary) 45%, transparent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--primary)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Hire Me
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                className="translate-y-px"
              >
                <path
                  d="M1 11L11 1M11 1H4M11 1V8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>

            {/* ── Mobile toggle ── */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center
                         rounded-full transition-colors duration-300"
              style={{
                color: menuOpen
                  ? "var(--primary-foreground)"
                  : "var(--foreground)",
              }}
            >
              <MenuIcon open={menuOpen} />
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* ── Mobile full-screen drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 backdrop-blur-sm"
              style={{
                background:
                  "color-mix(in oklch, var(--foreground) 15%, transparent)",
              }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel — var(--navbar-drawer-bg) */}
            <motion.div
              key="drawer"
              initial={{ clipPath: "circle(0% at calc(100% - 52px) 52px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 52px) 52px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 52px) 52px)" }}
              transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-40 flex flex-col overflow-hidden"
              style={{ background: "var(--navbar-drawer-bg)" }}
            >
              {/* Grain texture */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: 0.045,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px",
                }}
              />

              {/* Decorative rings */}
              {[
                { size: 520, offset: -40, delay: 0, opacity: 0.07 },
                { size: 300, offset: -16, delay: 0.06, opacity: 0.04 },
              ].map(({ size, offset, delay, opacity }) => (
                <motion.div
                  key={size}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 0.7 + delay,
                    delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: size,
                    height: size,
                    bottom: offset * 4,
                    right: offset * 4,
                    border: "1px solid var(--primary-foreground)",
                  }}
                />
              ))}

              {/* Nav links */}
              <div className="relative z-10 flex flex-col justify-center flex-1 px-8 pt-20 pb-10 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <MobileLink
                    key={link.href}
                    {...link}
                    index={i}
                    onClose={() => setMenuOpen(false)}
                  />
                ))}

                {/* Drawer CTA */}
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: 0.38,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-8 self-start flex items-center gap-2 rounded-full
                             text-[12px] uppercase tracking-[0.14em] font-bold
                             transition-opacity duration-300 hover:opacity-85"
                  style={{
                    padding: "12px 24px",
                    background: "var(--primary-foreground)",
                    color: "var(--navbar-drawer-bg)",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setTimeout(
                      () =>
                        document
                          .querySelector("#contact")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      500,
                    );
                  }}
                >
                  Hire Me
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 11L11 1M11 1H4M11 1V8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.a>
              </div>

              {/* Drawer footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45 }}
                className="relative z-10 px-8 pb-8 flex items-center justify-between"
              >
                <span
                  className="text-[11px] tracking-[0.15em] uppercase"
                  style={{ color: "var(--primary-foreground)", opacity: 0.4 }}
                >
                  © 2025 Haruna
                </span>
                <div className="flex items-center gap-5">
                  {[
                    { label: "GH", href: "https://github.com" },
                    { label: "LI", href: "https://linkedin.com" },
                    { label: "TW", href: "https://twitter.com" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] tracking-widest uppercase transition-opacity duration-300"
                      style={{
                        color: "var(--primary-foreground)",
                        opacity: 0.4,
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.opacity = "0.4")
                      }
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
