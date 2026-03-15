import Link from "next/link";

// ─── Links shown on the 404 page ─────────────────────────────────────────────
const LINKS = [
  { label: "Home",       href: "/"           },
  { label: "About",      href: "/#about"     },
  { label: "Projects",   href: "/#projects"  },
  { label: "Blog",       href: "/#blog"      },
  { label: "Contact",    href: "/#contact"   },
];

export default function NotFound() {
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
        @keyframes float-404 {
          0%,100% { transform: translateY(0px)   rotate(-2deg); }
          50%     { transform: translateY(-18px) rotate(1deg);  }
        }
        @keyframes fade-in-up-nf {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes draw-line {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes blink-cursor {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        .nf-eyebrow    { animation: fade-in-up-nf 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .nf-heading    { animation: fade-in-up-nf 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .nf-body       { animation: fade-in-up-nf 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .nf-links      { animation: fade-in-up-nf 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .nf-actions    { animation: fade-in-up-nf 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
        .nf-divider    {
          animation: draw-line 0.8s cubic-bezier(0.87,0,0.13,1) 0.55s both;
          transform-origin: left;
        }
        .nf-link-item:hover { color: var(--primary) !important; }
        .nf-link-item:hover .nf-link-arrow { transform: translateX(3px) !important; }
        .nf-link-arrow { transition: transform 0.2s ease; }
      `}</style>

      {/* ── Ambient glow blobs ── */}
      <div aria-hidden style={{
        position:     "absolute",
        top:          "-15%",
        right:        "-10%",
        width:        520,
        height:       520,
        borderRadius: "50%",
        background:   "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 70%)",
        filter:       "blur(90px)",
        pointerEvents:"none",
      }} />
      <div aria-hidden style={{
        position:     "absolute",
        bottom:       "-10%",
        left:         "-8%",
        width:        400,
        height:       400,
        borderRadius: "50%",
        background:   "radial-gradient(circle, color-mix(in oklch, var(--secondary) 9%, transparent) 0%, transparent 70%)",
        filter:       "blur(70px)",
        pointerEvents:"none",
      }} />

      {/* Dot grid */}
      <div aria-hidden style={{
        position:        "absolute",
        inset:           0,
        opacity:         0.025,
        backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
        backgroundSize:  "32px 32px",
        pointerEvents:   "none",
      }} />

      {/* Diagonal label — top left */}
      <div aria-hidden style={{
        position:      "absolute",
        top:           48,
        left:          40,
        fontSize:      10,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color:         "var(--muted-foreground)",
        opacity:       0.5,
        transform:     "rotate(-90deg) translateX(-100%)",
        transformOrigin:"left top",
        whiteSpace:    "nowrap",
        fontFamily:    "var(--font-sans)",
      }}>
        404 — Page not found
      </div>

      {/* ── Floating 404 ── */}
      <div
        aria-hidden
        style={{
          position:   "relative",
          marginBottom: 24,
          animation:  "float-404 5s ease-in-out infinite",
        }}
      >
        {/* Large background number */}
        <span style={{
          fontFamily:              "var(--font-serif)",
          fontSize:                "clamp(120px, 24vw, 220px)",
          fontWeight:              500,
          letterSpacing:           "-0.06em",
          lineHeight:              1,
          background:              "linear-gradient(135deg, color-mix(in oklch, var(--primary) 18%, var(--background)) 0%, color-mix(in oklch, var(--secondary) 12%, var(--background)) 100%)",
          WebkitBackgroundClip:    "text",
          WebkitTextFillColor:     "transparent",
          backgroundClip:          "text",
          userSelect:              "none",
          display:                 "block",
        }}>
          404
        </span>

        {/* Cursor blink on the last digit */}
        <span
          aria-hidden
          style={{
            position:   "absolute",
            right:      -6,
            bottom:     8,
            width:      3,
            height:     "clamp(40px, 8vw, 72px)",
            background: "var(--primary)",
            borderRadius: 2,
            animation:  "blink-cursor 1s step-end infinite",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 520 }}>

        {/* Eyebrow */}
        <div
          className="nf-eyebrow"
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            12,
            justifyContent: "center",
            marginBottom:   20,
          }}
        >
          <span style={{
            width: 28, height: 1.5,
            background: "var(--primary)", display: "block",
          }} />
          <span style={{
            fontSize:      11,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight:    600,
            color:         "var(--primary)",
          }}>
            Page not found
          </span>
          <span style={{
            width: 28, height: 1.5,
            background: "var(--primary)", display: "block",
          }} />
        </div>

        {/* Headline */}
        <h1
          className="nf-heading"
          style={{
            fontFamily:    "var(--font-serif)",
            fontSize:      "clamp(22px, 3.5vw, 34px)",
            fontWeight:    500,
            letterSpacing: "-0.025em",
            color:         "var(--foreground)",
            margin:        "0 0 14px",
            lineHeight:    1.2,
          }}
        >
          This page doesn't exist{" "}
          <em style={{ fontStyle: "italic" }}>— yet.</em>
        </h1>

        {/* Body */}
        <p
          className="nf-body"
          style={{
            fontSize:   15,
            lineHeight: 1.8,
            color:      "var(--muted-foreground)",
            margin:     "0 0 36px",
          }}
        >
          The URL might be mistyped, the page may have moved, or it simply
          hasn't been built yet. Here are some places worth visiting:
        </p>

        {/* Divider */}
        <div
          className="nf-divider"
          style={{
            height:     1,
            background: "linear-gradient(90deg, var(--border), transparent)",
            marginBottom: 28,
          }}
          aria-hidden
        />

        {/* Navigation links */}
        <nav
          className="nf-links"
          aria-label="Available pages"
          style={{
            display:        "flex",
            flexWrap:       "wrap",
            gap:            "8px 24px",
            justifyContent: "center",
            marginBottom:   36,
          }}
        >
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="nf-link-item"
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           5,
                fontSize:      13,
                fontWeight:    500,
                color:         "var(--muted-foreground)",
                textDecoration:"none",
                letterSpacing: "0.02em",
                transition:    "color 0.2s ease",
              }}
            >
              {label}
              <svg
                className="nf-link-arrow"
                width="11" height="11" viewBox="0 0 12 12" fill="none"
                aria-hidden
              >
                <path d="M1 11L11 1M11 1H4M11 1V8"
                  stroke="currentColor" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Primary CTA */}
        <div className="nf-actions">
          <Link
            href="/"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           8,
              padding:       "13px 32px",
              borderRadius:  99,
              background:    "var(--primary)",
              color:         "var(--primary-foreground)",
              fontSize:      13,
              fontWeight:    600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration:"none",
              boxShadow:     "0 8px 28px color-mix(in oklch, var(--primary) 30%, transparent)",
              transition:    "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity   = "0.88";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity   = "1";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden>
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}