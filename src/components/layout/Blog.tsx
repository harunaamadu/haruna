"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn, EASE } from "@/lib/utils";
import type { BlogCategory } from "@/lib/constants";
import { Eyebrow, Reveal } from "@/components";
import { BlogCard, BlogPostModal } from "@/components";
import { SanityBlogPost } from "../../../sanity/lib/client";

// ─── Filter config ────────────────────────────────────────────────────────────
type Filter = "All" | BlogCategory;

const FILTERS: Filter[] = [
  "All", "Engineering", "Design", "Career", "Open Source", "Tooling",
];

// ─── Filter tab ───────────────────────────────────────────────────────────────
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

// ─── Skeleton card (loading state) ───────────────────────────────────────────
function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden animate-pulse",
        featured ? "h-80 md:h-65" : "h-70",
      )}
    >
      <div className="h-full w-full bg-muted/60" />
    </div>
  );
}

// ─── Newsletter box ───────────────────────────────────────────────────────────
function NewsletterBox() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email."); return; }
    setError("");
    setSubmitted(true);
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-10 md:p-14 border border-border"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--primary) 6%, var(--card)) 0%, var(--card) 60%, color-mix(in oklch, var(--secondary) 5%, var(--card)) 100%)",
      }}
    >
      {/* Glows */}
      <div
        className="absolute -top-16 -right-16 size-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-12 -left-12 size-44 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--secondary) 12%, transparent) 0%, transparent 70%)",
          filter: "blur(36px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-md">
          <h3
            className="font-serif font-medium tracking-[-0.025em] text-foreground leading-tight mb-3"
            style={{ fontSize: "clamp(20px, 3vw, 28px)" }}
          >
            Stay in the loop.
          </h3>
          <p className="text-sm leading-[1.8] text-muted-foreground">
            New articles on engineering, design, and building things worth
            building. No spam, unsubscribe anytime.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.p
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-semibold text-primary"
            >
              ✓ You're subscribed!
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2 w-full md:w-auto"
            >
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="your@email.com"
                  className="flex-1 md:w-60 px-4 py-3 rounded-full border border-border
                             bg-background text-sm text-foreground
                             placeholder:text-muted-foreground/60
                             focus:outline-none focus:ring-2 focus:ring-primary/30
                             focus:border-primary transition-colors duration-200"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className="px-5 py-3 rounded-full bg-primary text-primary-foreground
                             text-[12px] font-semibold uppercase tracking-widest
                             border-none cursor-pointer shrink-0
                             hover:opacity-90 transition-opacity duration-200"
                >
                  Subscribe
                </motion.button>
              </div>
              {error && (
                <p className="text-[12px] text-destructive pl-1">{error}</p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Blog Section ─────────────────────────────────────────────────────────────
export default function Blog() {
  const [posts,        setPosts]        = useState<SanityBlogPost[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState(false);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [openPost,     setOpenPost]     = useState<SanityBlogPost | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Fetch posts from Sanity via API route ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(false);

    fetch("/api/posts")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: SanityBlogPost[]) => {
        if (!cancelled) setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // ── Parallax blobs ────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });
  const blobY1 = useTransform(scrollYProgress, [0, 1], ["-6%",  "6%"]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [ "4%", "-4%"]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const filtered = activeFilter === "All"
    ? posts
    : posts.filter((p) => p.category === activeFilter);

  const [featured, ...rest] = filtered;

  const countFor = (f: Filter) =>
    f === "All"
      ? posts.length
      : posts.filter((p) => p.category === f).length;

  return (
    <>
      <section
        ref={sectionRef}
        id="blog"
        className="relative overflow-hidden container-haruna section-padding bg-background"
      >
        {/* ── Background blobs ─────────────────────────────────────────── */}
        <motion.div
          className="absolute pointer-events-none top-[5%] left-[-12%]
                     w-[45vw] max-w-145 aspect-square rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 9%, transparent) 0%, transparent 70%)",
            filter: "blur(100px)",
            y:      blobY1,
          }}
          aria-hidden
        />
        <motion.div
          className="absolute pointer-events-none bottom-[10%] right-[-10%]
                     w-[38vw] max-w-125 aspect-square rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--secondary) 9%, transparent) 0%, transparent 70%)",
            filter: "blur(90px)",
            y:      blobY2,
          }}
          aria-hidden
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(var(--foreground) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
          aria-hidden
        />

        <div className="relative z-10">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <Reveal className="mb-16">
            <div className="flex flex-wrap justify-between items-end gap-6">
              <div className="max-w-150">
                <Eyebrow label="Blog" />
                <h2
                  className="font-serif font-medium leading-none text-foreground m-0"
                  style={{ fontSize: "clamp(38px, 6vw, 72px)" }}
                >
                  Thoughts on{" "}
                  <em className="not-italic gradient-text">craft</em>{" "}
                  & code.
                </h2>
              </div>

              <div className="text-right shrink-0">
                <p
                  className="font-serif font-medium tracking-[-0.03em] leading-none
                             text-foreground m-0"
                  style={{ fontSize: "clamp(42px, 5.5vw, 68px)" }}
                >
                  {loading ? (
                    <span className="inline-block w-12 h-10 rounded-lg bg-muted animate-pulse" />
                  ) : (
                    <>{posts.length}<span className="text-primary">+</span></>
                  )}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground m-0">
                  Articles written
                </p>
              </div>
            </div>
          </Reveal>

          {/* ── Filter tabs ─────────────────────────────────────────────── */}
          <Reveal className="mb-12">
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted rounded-full w-fit">
              {FILTERS.map((f) => (
                <FilterTab
                  key={f}
                  label={f}
                  active={activeFilter === f}
                  count={countFor(f)}
                  onClick={() => setActiveFilter(f)}
                />
              ))}
            </div>
          </Reveal>

          {/* ── Posts ───────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{   opacity: 0, y: -8  }}
              transition={{ duration: 0.4, ease: EASE.spring }}
              className="flex flex-col gap-5 mb-16"
            >
              {/* Loading skeletons */}
              {loading && (
                <div className="flex flex-col gap-5">
                  <SkeletonCard featured />
                  <div className="grid gap-5"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))" }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Fetch error */}
              {!loading && fetchError && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <span className="text-[48px] opacity-20">⚠</span>
                  <p className="text-sm text-muted-foreground">
                    Failed to load posts. Please refresh the page.
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!loading && !fetchError && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <span className="text-[48px] opacity-20">◈</span>
                  <p className="text-sm text-muted-foreground">
                    {posts.length === 0
                      ? "No posts published yet."
                      : "No posts in this category yet."}
                  </p>
                </div>
              )}

              {/* Posts */}
              {!loading && !fetchError && filtered.length > 0 && (
                <>
                  {/* Featured — first post always gets the large layout */}
                  {featured && (
                    <BlogCard
                      post={featured}
                      index={0}
                      onClick={setOpenPost}
                      variant="featured"
                    />
                  )}

                  {/* Grid of remaining posts */}
                  {rest.length > 0 && (
                    <div
                      className="grid gap-5"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                      }}
                    >
                      {rest.map((post, i) => (
                        <BlogCard
                          key={post._id}
                          post={post}
                          index={i + 1}
                          onClick={setOpenPost}
                          variant="grid"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Newsletter ──────────────────────────────────────────────── */}
          <Reveal>
            <NewsletterBox />
          </Reveal>

        </div>
      </section>

      {/* Post modal — outside section so overflow:hidden doesn't clip it */}
      <BlogPostModal post={openPost} onClose={() => setOpenPost(null)} />
    </>
  );
}