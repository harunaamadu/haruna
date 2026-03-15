"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import { cn, EASE, stagger } from "@/lib/utils";
import { Eyebrow, Reveal } from "@/components";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Static data ──────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    label:  "Facebook",
    handle: "Haruna Amadu",
    href:   "https://facebook.com/harunaamadu95",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label:  "GitHub",
    handle: "@cupidruna95-design",
    href:   "https://github.com/cupidruna95-design",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label:  "LinkedIn",
    handle: "Haruna Amadu",
    href:   "https://linkedin.com/in/harunaamadu",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label:  "Twitter / X",
    handle: "@haruna_amadu01",
    href:   "https://twitter.com/haruna_amadu01",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label:  "Email",
    handle: "harunaamadu@gmail.com",
    href:   "mailto:harunaamadu@gmail.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

const AVAILABILITY = [
  { label: "Freelance",   available: true },
  { label: "Full-time",   available: true },
  { label: "Consulting",  available: true },
  { label: "Open Source", available: true },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormValues {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?:    string;
  email?:   string;
  subject?: string;
  message?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim())
    errors.name = "Name is required.";
  if (!values.email.trim())
    errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (!values.subject.trim())
    errors.subject = "Subject is required.";
  if (!values.message.trim())
    errors.message = "Message is required.";
  else if (values.message.trim().length < 20)
    errors.message = "Please write at least 20 characters.";
  return errors;
}

// ─── Form field ───────────────────────────────────────────────────────────────
interface FieldProps {
  label:       string;
  id:          string;
  value:       string;
  onChange:    (v: string) => void;
  error?:      string;
  touched?:    boolean;
  type?:       string;
  placeholder: string;
  multiline?:  boolean;
  rows?:       number;
  required?:   boolean;
}

function Field({
  label, id, value, onChange, error, touched,
  type = "text", placeholder, multiline = false,
  rows = 4, required = true,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const hasError = touched && !!error;
  const isValid  = touched && !error && value.trim().length > 0;

  const baseClass = cn(
    "w-full px-4 py-3.5 rounded-xl border bg-card text-sm text-foreground",
    "placeholder:text-muted-foreground/50 transition-all duration-200",
    "focus:outline-none",
    focused
      ? "border-primary ring-2 ring-primary/20"
      : hasError
        ? "border-destructive ring-2 ring-destructive/15"
        : isValid
          ? "border-primary/40"
          : "border-border",
    multiline ? "resize-none" : "",
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground/70"
        >
          {label}
          {required && (
            <span className="text-primary ml-0.5" aria-hidden>*</span>
          )}
        </label>

        <AnimatePresence mode="wait">
          {hasError && (
            <motion.span key="err"
              initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="text-[11px] text-destructive">
              {error}
            </motion.span>
          )}
          {isValid && (
            <motion.span key="ok"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="text-[11px] text-primary font-medium">
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {multiline ? (
        <textarea
          id={id} value={value} rows={rows} placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={baseClass}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id} type={type} value={value} placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={baseClass}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ─── Social link card ─────────────────────────────────────────────────────────
function SocialCard({
  label, handle, href, icon, index,
}: (typeof SOCIAL_LINKS)[0] & { index: number }) {
  const ref    = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [hov, setHov] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: stagger(index, 80), duration: 0.6, ease: EASE.spring }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-border
                 bg-card transition-all duration-300 cursor-pointer no-underline"
      style={{
        borderColor: hov ? "color-mix(in oklch, var(--primary) 35%, transparent)" : undefined,
        boxShadow:   hov ? "0 8px 28px color-mix(in oklch, var(--primary) 10%, transparent)" : undefined,
        transform:   hov ? "translateX(4px)" : undefined,
      }}
      aria-label={`${label}: ${handle}`}
    >
      <div
        className="size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
        style={{
          background: hov
            ? "color-mix(in oklch, var(--primary) 14%, transparent)"
            : "color-mix(in oklch, var(--primary) 8%, transparent)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[11px] uppercase tracking-[0.14em] font-semibold
                         text-muted-foreground leading-none mb-1">
          {label}
        </span>
        <span className="text-[13px] font-medium text-foreground truncate">{handle}</span>
      </div>

      <motion.svg className="ml-auto shrink-0 text-muted-foreground"
        width="13" height="13" viewBox="0 0 12 12" fill="none"
        animate={{ x: hov ? 3 : 0, opacity: hov ? 1 : 0.4 }}
        transition={{ duration: 0.2 }} aria-hidden>
        <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.a>
  );
}

// ─── Decorative GSAP-drawn orbit ──────────────────────────────────────────────
function OrbitDecoration() {
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, margin: "-80px 0px" });

  useEffect(() => {
    if (!svgRef.current || !inView) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement | SVGCircleElement>(".gsap-draw");
    paths.forEach((el) => {
      const len = (el as SVGGeometryElement).getTotalLength?.() ?? 200;
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to(".gsap-draw", {
      strokeDashoffset: 0, duration: 1.6, stagger: 0.18, ease: "power2.out",
      scrollTrigger: { trigger: svgRef.current, start: "top 80%", once: true },
    });
  }, [inView]);

  return (
    <svg ref={svgRef} viewBox="0 0 340 340" fill="none"
      className="w-full max-w-85 mx-auto opacity-60" aria-hidden>
      <circle className="gsap-draw" cx="170" cy="170" r="160"
        stroke="color-mix(in oklch, var(--primary) 20%, transparent)" strokeWidth="1" />
      <circle className="gsap-draw" cx="170" cy="170" r="110"
        stroke="color-mix(in oklch, var(--primary) 30%, transparent)"
        strokeWidth="1" strokeDasharray="6 10" />
      <circle className="gsap-draw" cx="170" cy="170" r="62"
        stroke="color-mix(in oklch, var(--secondary) 40%, transparent)" strokeWidth="1" />
      <path className="gsap-draw" d="M170 10 L170 330"
        stroke="color-mix(in oklch, var(--primary) 12%, transparent)" strokeWidth="1" />
      <path className="gsap-draw" d="M10 170 L330 170"
        stroke="color-mix(in oklch, var(--primary) 12%, transparent)" strokeWidth="1" />
      <path className="gsap-draw" d="M57 57 L283 283"
        stroke="color-mix(in oklch, var(--primary) 8%, transparent)" strokeWidth="1" />
      <path className="gsap-draw" d="M283 57 L57 283"
        stroke="color-mix(in oklch, var(--primary) 8%, transparent)" strokeWidth="1" />
      <circle cx="170" cy="170" r="5"
        fill="color-mix(in oklch, var(--primary) 60%, transparent)" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x   = 170 + 110 * Math.cos(rad);
        const y   = 170 + 110 * Math.sin(rad);
        return (
          <motion.circle key={deg} cx={x} cy={y} r="3.5"
            fill={deg % 120 === 0
              ? "color-mix(in oklch, var(--secondary) 70%, transparent)"
              : "color-mix(in oklch, var(--primary) 50%, transparent)"}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.2 + (deg / 360) * 0.6, duration: 0.4, type: "spring" }} />
        );
      })}
      <motion.text x="170" y="176" textAnchor="middle"
        style={{
          fontSize: 14, fill: "color-mix(in oklch, var(--primary) 55%, transparent)",
          fontFamily: "var(--font-serif)", letterSpacing: "-0.02em",
        }}
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 0.6 }}>
        Let's build
      </motion.text>
    </svg>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  const [values,      setValues]      = useState<FormValues>({
    name: "", email: "", subject: "", message: "",
  });
  const [touched,     setTouched]     = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const errors  = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const set = (field: keyof FormValues) => (v: string) => {
    setValues((prev) => ({ ...prev, [field]: v }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ── Submit to /api/contact ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) return;

    setSubmitState("loading");

    // Loading toast with a promise-style ID so we can update it
    const toastId = toast.loading("Sending your message…", {
      description: "This will just take a moment.",
    });

    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Message not sent", {
          id:          toastId,
          description: data.error ?? "Something went wrong. Please try again.",
          duration:    6000,
        });
        setSubmitState("error");
        return;
      }

      toast.success("Message sent!", {
        id:          toastId,
        description: "Thanks for reaching out — I'll reply within 24 hours.",
        duration:    6000,
      });
      setSubmitState("success");
    } catch {
      toast.error("Network error", {
        id:          toastId,
        description: "Check your connection and try again, or email me directly.",
        duration:    6000,
      });
      setSubmitState("error");
    }
  };

  const handleReset = () => {
    setValues({ name: "", email: "", subject: "", message: "" });
    setTouched({});
    setSubmitState("idle");
  };

  // Parallax blobs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden container-haruna section-padding bg-background"
    >
      {/* Background blobs */}
      <motion.div
        className="absolute pointer-events-none top-0 right-[-10%]
                   w-[50vw] max-w-160 aspect-square rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 9%, transparent) 0%, transparent 70%)",
          filter: "blur(110px)", y: blobY,
        }}
        aria-hidden
      />
      <motion.div
        className="absolute pointer-events-none bottom-0 left-[-8%]
                   w-[40vw] max-w-130 aspect-square rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--secondary) 9%, transparent) 0%, transparent 70%)",
          filter: "blur(100px)",
          y: useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]),
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize:  "36px 36px",
        }}
        aria-hidden
      />

      <div className="relative z-10">

        {/* Header */}
        <Reveal className="mb-16">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="max-w-155">
              <Eyebrow label="Get In Touch" />
              <h2
                className="font-serif font-medium leading-none text-foreground m-0"
                style={{ fontSize: "clamp(38px, 6vw, 72px)" }}
              >
                Let's build something{" "}
                <em className="not-italic gradient-text">remarkable.</em>
              </h2>
            </div>

            {/* Availability */}
            <Reveal delay={0.15}>
              <div className="flex flex-col gap-2">
                {AVAILABILITY.map(({ label, available }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{
                        background: available ? "oklch(70% 0.18 145)" : "var(--muted-foreground)",
                        boxShadow:  available ? "0 0 0 3px oklch(70% 0.18 145 / 0.2)" : "none",
                      }}
                      aria-hidden
                    />
                    <span className="text-[12px] font-medium text-muted-foreground">
                      {label}
                      <span className="ml-1.5 text-[11px]">
                        {available ? "— Open" : "— Closed"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 xl:gap-20 items-start">

          {/* LEFT */}
          <div className="flex flex-col gap-10">
            <Reveal>
              <p className="text-[clamp(14px,1.5vw,16px)] leading-[1.85] text-muted-foreground">
                Whether you have a project in mind, want to collaborate, or just
                want to say hello — my inbox is always open. I typically respond
                within 24 hours.
              </p>
            </Reveal>

            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((s, i) => (
                <SocialCard key={s.label} {...s} index={i} />
              ))}
            </div>

            <Reveal className="hidden lg:block mt-4">
              <OrbitDecoration />
            </Reveal>
          </div>

          {/* RIGHT: form */}
          <Reveal delay={0.1}>
            <div
              className="relative rounded-3xl border border-border bg-card
                         p-8 md:p-10 overflow-hidden"
              style={{
                boxShadow: "0 24px 80px color-mix(in oklch, var(--primary) 7%, transparent)",
              }}
            >
              {/* Card glow */}
              <div
                className="absolute -top-16 -right-16 size-48 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 16%, transparent) 0%, transparent 70%)",
                  filter: "blur(32px)",
                }}
                aria-hidden
              />

              <AnimatePresence mode="wait">
                {/* Success state */}
                {submitState === "success" ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE.spring }}
                    className="flex flex-col items-center justify-center text-center
                               py-16 gap-6 relative z-10">
                    <motion.div
                      className="size-16 rounded-full flex items-center justify-center"
                      style={{ background: "color-mix(in oklch, var(--primary) 12%, transparent)" }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        strokeLinejoin="round" className="text-primary" aria-hidden>
                        <motion.path d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }} />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-serif text-[22px] font-medium text-foreground
                                     tracking-[-0.02em] mb-2">
                        Message sent!
                      </h3>
                      <p className="text-sm text-muted-foreground leading-[1.8] max-w-xs mx-auto">
                        Thanks for reaching out. I'll get back to you within 24 hours.
                      </p>
                    </div>
                    <motion.button onClick={handleReset} whileTap={{ scale: 0.96 }}
                      className="px-6 py-2.5 rounded-full border border-border text-[12px]
                                 font-semibold uppercase tracking-widest text-muted-foreground
                                 hover:text-foreground hover:border-foreground/30
                                 transition-colors duration-200 cursor-pointer bg-transparent">
                      Send another
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Form */
                  <motion.form key="form" onSubmit={handleSubmit} noValidate
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="relative z-10 flex flex-col gap-5">

                    <div className="mb-1">
                      <h3 className="font-serif text-[clamp(18px,2.5vw,24px)] font-medium
                                     text-foreground tracking-[-0.02em] leading-tight">
                        Send a message
                      </h3>
                      <p className="text-[13px] text-muted-foreground mt-1.5">
                        Fields marked{" "}
                        <span className="text-primary font-medium" aria-label="required">*</span>{" "}
                        are required.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Name" id="contact-name" value={values.name}
                        onChange={set("name")} error={errors.name} touched={touched.name}
                        placeholder="Akosua Mensah" />
                      <Field label="Email" id="contact-email" type="email" value={values.email}
                        onChange={set("email")} error={errors.email} touched={touched.email}
                        placeholder="you@example.com" />
                    </div>

                    <Field label="Subject" id="contact-subject" value={values.subject}
                      onChange={set("subject")} error={errors.subject} touched={touched.subject}
                      placeholder="Project collaboration / Freelance inquiry…" />

                    <Field label="Message" id="contact-message" value={values.message}
                      onChange={set("message")} error={errors.message} touched={touched.message}
                      placeholder="Tell me about your project, timeline, and budget…"
                      multiline rows={5} />

                    <div className="flex justify-between text-[10px] text-muted-foreground/90 -mt-2">
                      <p>Please send attachments via email.</p>
                      <p>{values.message.length} characters</p>
                    </div>

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={submitState === "loading"}
                      whileTap={submitState === "loading" ? {} : { scale: 0.97 }}
                      className={cn(
                        "relative flex items-center justify-center gap-2.5",
                        "w-full py-4 rounded-xl border-none cursor-pointer",
                        "text-[13px] font-semibold uppercase tracking-[0.12em]",
                        "transition-all duration-300 overflow-hidden",
                        submitState === "loading"
                          ? "bg-primary/70 text-primary-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:opacity-90",
                      )}
                      style={{
                        boxShadow: submitState !== "loading"
                          ? "0 8px 32px color-mix(in oklch, var(--primary) 35%, transparent)"
                          : "none",
                      }}>
                      {submitState === "loading" ? (
                        <>
                          <motion.span
                            className="size-4 rounded-full border-2 border-primary-foreground/30
                                       border-t-primary-foreground"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            aria-hidden />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor"
                              strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                      {/* Shimmer */}
                      <span
                        className="absolute inset-0 opacity-0 hover:opacity-100
                                   pointer-events-none transition-opacity duration-500"
                        style={{
                          background: "linear-gradient(105deg, transparent 35%, color-mix(in oklch, var(--primary-foreground) 12%, transparent) 50%, transparent 65%)",
                          transform: "skewX(-15deg)",
                        }}
                        aria-hidden />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}