"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const SPRING = [0.22, 1, 0.36, 1] as const;

interface ErrorProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error-tracking service (Sentry, etc.) here
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight:      "100dvh",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background:     "var(--background)",
        position:       "relative",
        overflow:       "hidden",
        fontFamily:     "var(--font-sans)",
        padding:        "2rem",
        textAlign:      "center",
      }}
    >
      {/* ── CSS animations ── */}
      <style>{`
        @keyframes glitch-1 {
          0%,95%,100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
          96%          { clip-path: inset(20% 0 60% 0); transform: translate(-4px, 2px); }
          97%          { clip-path: inset(60% 0 20% 0); transform: translate(4px, -2px); }
          98%          { clip-path: inset(40% 0 40% 0); transform: translate(-3px, 1px); }
          99%          { clip-path: inset(10% 0 70% 0); transform: translate(3px, -1px); }
        }
        @keyframes glitch-2 {
          0%,95%,100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
          96%          { clip-path: inset(60% 0 20% 0); transform: translate(4px, -2px); }
          97%          { clip-path: inset(10% 0 70% 0); transform: translate(-4px, 2px); }
          98%          { clip-path: inset(80% 0 10% 0); transform: translate(2px, 3px);  }
          99%          { clip-path: inset(30% 0 50% 0); transform: translate(-2px,-3px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* ── Ambient glow ── */}
      <div aria-hidden style={{
        position:     "absolute", top: "-10%", left: "50%",
        transform:    "translateX(-50%)", width: 500, height: 500,
        borderRadius: "50%",
        background:   "radial-gradient(circle, color-mix(in oklch, var(--destructive) 10%, transparent) 0%, transparent 70%)",
        filter:       "blur(80px)", pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position:     "absolute", bottom: "-10%", left: "50%",
        transform:    "translateX(-50%)", width: 350, height: 350,
        borderRadius: "50%",
        background:   "radial-gradient(circle, color-mix(in oklch, var(--primary) 8%, transparent) 0%, transparent 70%)",
        filter:       "blur(60px)", pointerEvents: "none",
      }} />

      {/* Dot grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
        backgroundSize: "32px 32px", pointerEvents: "none",
      }} />

      {/* ── Glitch number ── */}
      <div style={{ position: "relative", marginBottom: 32 }}>
        {/* Base layer */}
        <h1
          aria-label="Error"
          style={{
            fontFamily:    "var(--font-serif)",
            fontSize:      "clamp(100px, 20vw, 180px)",
            fontWeight:    500,
            letterSpacing: "-0.06em",
            lineHeight:    1,
            margin:        0,
            color:         "var(--foreground)",
            userSelect:    "none",
          }}
        >
          Err
        </h1>

        {/* Glitch layer 1 — primary colour */}
        <h1 aria-hidden style={{
          fontFamily:    "var(--font-serif)",
          fontSize:      "clamp(100px, 20vw, 180px)",
          fontWeight:    500,
          letterSpacing: "-0.06em",
          lineHeight:    1,
          margin:        0,
          position:      "absolute",
          inset:         0,
          color:         "var(--primary)",
          animation:     "glitch-1 6s steps(1) infinite",
          pointerEvents: "none",
        }}>
          Err
        </h1>

        {/* Glitch layer 2 — secondary colour */}
        <h1 aria-hidden style={{
          fontFamily:    "var(--font-serif)",
          fontSize:      "clamp(100px, 20vw, 180px)",
          fontWeight:    500,
          letterSpacing: "-0.06em",
          lineHeight:    1,
          margin:        0,
          position:      "absolute",
          inset:         0,
          color:         "var(--secondary)",
          animation:     "glitch-2 6s steps(1) infinite 0.05s",
          pointerEvents: "none",
        }}>
          Err
        </h1>
      </div>

      {/* ── Text content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.15, duration: 0.7, ease: SPRING }}
        style={{ maxWidth: 480 }}
      >
        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          justifyContent: "center", marginBottom: 20,
        }}>
          <span style={{
            width: 28, height: 1.5,
            background: "var(--destructive)", display: "block",
          }} />
          <span style={{
            fontSize: 11, textTransform: "uppercase" as const,
            letterSpacing: "0.22em", fontWeight: 600,
            color: "var(--destructive)",
          }}>
            Something went wrong
          </span>
          <span style={{
            width: 28, height: 1.5,
            background: "var(--destructive)", display: "block",
          }} />
        </div>

        <h2
          style={{
            fontFamily:    "var(--font-serif)",
            fontSize:      "clamp(20px, 3vw, 28px)",
            fontWeight:    500,
            letterSpacing: "-0.02em",
            color:         "var(--foreground)",
            margin:        "0 0 12px",
            lineHeight:    1.2,
          }}
        >
          An unexpected error occurred.
        </h2>

        <p style={{
          fontSize:   15,
          lineHeight: 1.8,
          color:      "var(--muted-foreground)",
          margin:     "0 0 8px",
        }}>
          The page encountered a problem it couldn't recover from. Try
          refreshing — if the issue persists, it's on our end.
        </p>

        {/* Digest for debugging */}
        {error.digest && (
          <p style={{
            fontSize:      11,
            fontFamily:    "var(--font-mono, monospace)",
            color:         "var(--muted-foreground)",
            opacity:       0.5,
            margin:        "0 0 32px",
            letterSpacing: "0.04em",
          }}>
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div style={{
          display:        "flex",
          flexWrap:       "wrap" as const,
          gap:            12,
          justifyContent: "center",
          marginTop:      error.digest ? 0 : 32,
        }}>
          {/* Retry */}
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97  }}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            8,
              padding:        "12px 28px",
              borderRadius:   99,
              border:         "none",
              cursor:         "pointer",
              background:     "var(--primary)",
              color:          "var(--primary-foreground)",
              fontSize:       13,
              fontWeight:     600,
              letterSpacing:  "0.1em",
              textTransform:  "uppercase" as const,
              boxShadow:      "0 8px 28px color-mix(in oklch, var(--primary) 30%, transparent)",
              transition:     "opacity 0.2s",
            }}
          >
            {/* Retry icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Try again
          </motion.button>

          {/* Go home */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97  }}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           8,
              padding:       "12px 28px",
              borderRadius:  99,
              border:        "1.5px solid var(--border)",
              cursor:        "pointer",
              background:    "transparent",
              color:         "var(--foreground)",
              fontSize:      13,
              fontWeight:    600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              textDecoration:"none",
              transition:    "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
              (e.currentTarget as HTMLElement).style.color       = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.color       = "var(--foreground)";
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden>
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Go home
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}