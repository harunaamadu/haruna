"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, EASE } from "@/lib/utils";
import type { PortableTextBlock } from "@portabletext/types";
import { SanityBlogPost, SanityComment } from "../../../sanity/lib/client";
import { PortableTextRenderer } from "../../../sanity/lib/portable-text";

// ─── localStorage helper (vote preference only — counts live in Sanity) ───────
const LS = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try { return JSON.parse(localStorage.getItem(key) ?? "") as T; }
    catch { return fallback; }
  },
  set(key: string, value: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  },
};

type Reaction = "like" | "dislike" | null;

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconThumbUp({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  );
}

function IconThumbDown({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}

// ─── Reaction bar — fetches counts from /api/reactions, vote in localStorage ──
function ReactionBar({ postId }: { postId: string }) {
  const myKey = `blog:${postId}:myreaction`;

  const [likes,    setLikes]    = useState<number | null>(null);
  const [dislikes, setDislikes] = useState<number | null>(null);
  const [myVote,   setMyVote]   = useState<Reaction>(null);
  const [loading,  setLoading]  = useState(false);

  // Fetch server totals on open
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reactions?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setLikes(data.likes    ?? 0);
        setDislikes(data.dislikes ?? 0);
      })
      .catch(() => { if (!cancelled) { setLikes(0); setDislikes(0); } });
    setMyVote(LS.get<Reaction>(myKey, null));
    return () => { cancelled = true; };
  }, [postId, myKey]);

  const react = useCallback(async (vote: "like" | "dislike") => {
    if (loading) return;
    setLoading(true);

    const prevVote = myVote;
    const isUndo   = prevVote === vote;
    const isSwitch = prevVote !== null && prevVote !== vote;

    // Optimistic update
    const nextVote: Reaction = isUndo ? null : vote;
    setMyVote(nextVote);
    setLikes((prev) => {
      if (prev === null) return null;
      if (vote === "like")    return prev + (isUndo ? -1 : 1);
      if (isSwitch && prevVote === "like") return prev - 1;
      return prev;
    });
    setDislikes((prev) => {
      if (prev === null) return null;
      if (vote === "dislike") return prev + (isUndo ? -1 : 1);
      if (isSwitch && prevVote === "dislike") return prev - 1;
      return prev;
    });

    try {
      // If switching, undo previous vote first
      if (isSwitch && prevVote) {
        await fetch("/api/reactions", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ postId, type: prevVote, delta: -1 }),
        });
      }
      // Apply new vote (or undo)
      const res  = await fetch("/api/reactions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ postId, type: vote, delta: isUndo ? -1 : 1 }),
      });
      const data = await res.json();
      // Sync with server's authoritative counts
      setLikes(data.likes       ?? 0);
      setDislikes(data.dislikes ?? 0);
      LS.set(myKey, nextVote);
    } catch {
      // Revert on error
      setMyVote(prevVote);
    } finally {
      setLoading(false);
    }
  }, [loading, myVote, postId, myKey]);

  const total       = (likes ?? 0) + (dislikes ?? 0);
  const likePercent = total > 0 ? Math.round(((likes ?? 0) / total) * 100) : 50;
  const isHydrated  = likes !== null;

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-muted/50 border border-border">
      <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        Was this helpful?
      </p>

      <div className="flex items-center gap-3">
        {/* Like */}
        <motion.button
          onClick={() => react("like")}
          disabled={loading || !isHydrated}
          whileTap={{ scale: 0.93 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium",
            "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
            myVote === "like"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary",
          )}
        >
          <IconThumbUp filled={myVote === "like"} />
          <span>{isHydrated ? likes : "—"}</span>
        </motion.button>

        {/* Dislike */}
        <motion.button
          onClick={() => react("dislike")}
          disabled={loading || !isHydrated}
          whileTap={{ scale: 0.93 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium",
            "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
            myVote === "dislike"
              ? "bg-destructive/10 text-destructive border-destructive/30"
              : "bg-card text-muted-foreground border-border hover:border-destructive/50 hover:text-destructive",
          )}
        >
          <IconThumbDown filled={myVote === "dislike"} />
          <span>{isHydrated ? dislikes : "—"}</span>
        </motion.button>

        {/* Ratio bar */}
        {isHydrated && total > 0 && (
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden ml-2">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "50%" }}
              animate={{ width: `${likePercent}%` }}
              transition={{ duration: 0.5, ease: EASE.spring }}
            />
          </div>
        )}
      </div>

      {isHydrated && total > 0 && (
        <p className="text-[11px] text-muted-foreground">
          {likePercent}% of {total} reader{total !== 1 ? "s" : ""} found this helpful
        </p>
      )}
    </div>
  );
}

// ─── Comment section — fetches from /api/comments, posts to /api/comments ─────
function CommentSection({ postId }: { postId: string }) {
  const [comments,    setComments]    = useState<SanityComment[]>([]);
  const [fetching,    setFetching]    = useState(true);
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [text,        setText]        = useState("");
  const [error,       setError]       = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");

  // Fetch approved comments
  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setComments(Array.isArray(data) ? data : []); })
      .catch(()  => { if (!cancelled) setComments([]); })
      .finally(() => { if (!cancelled) setFetching(false); });
    return () => { cancelled = true; };
  }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim())       { setError("Please enter your name.");       return; }
    if (!text.trim())       { setError("Please write a comment.");       return; }
    if (text.length > 600)  { setError("Keep it under 600 characters."); return; }

    setSubmitState("loading");

    try {
      const res = await fetch("/api/comments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          postId,
          name:  name.trim(),
          email: email.trim() || undefined,
          text:  text.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        setSubmitState("idle");
        return;
      }

      setSubmitState("success");
      setName(""); setEmail(""); setText("");
      setTimeout(() => setSubmitState("idle"), 4000);
    } catch {
      setError("Network error. Please try again.");
      setSubmitState("idle");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="block w-6 h-0.5 bg-primary shrink-0" aria-hidden />
        <h4 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-primary">
          Comments ({fetching ? "…" : comments.length})
        </h4>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name *"
            maxLength={60}
            className="px-4 py-3 rounded-xl border border-border bg-card text-sm
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-primary/25
                       focus:border-primary transition-colors duration-200"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional, not shown)"
            className="px-4 py-3 rounded-xl border border-border bg-card text-sm
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:ring-2 focus:ring-primary/25
                       focus:border-primary transition-colors duration-200"
          />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts…"
          rows={4}
          maxLength={600}
          className="px-4 py-3 rounded-xl border border-border bg-card text-sm
                     text-foreground placeholder:text-muted-foreground/50
                     resize-none focus:outline-none focus:ring-2
                     focus:ring-primary/25 focus:border-primary
                     transition-colors duration-200"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p key="err"
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] text-destructive">
                  {error}
                </motion.p>
              )}
              {submitState === "success" && (
                <motion.p key="ok"
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[12px] text-primary font-medium">
                  ✓ Comment submitted — awaiting moderation.
                </motion.p>
              )}
            </AnimatePresence>
            <span className="text-[11px] text-muted-foreground/50">{text.length}/600</span>
          </div>

          <motion.button
            type="submit"
            disabled={submitState === "loading"}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full
                       bg-primary text-primary-foreground text-[12px] font-semibold
                       uppercase tracking-widest border-none cursor-pointer
                       disabled:opacity-60 disabled:cursor-not-allowed
                       hover:opacity-90 transition-opacity duration-200"
          >
            {submitState === "loading" && (
              <motion.span
                className="size-3.5 rounded-full border-2
                           border-primary-foreground/30 border-t-primary-foreground"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                aria-hidden />
            )}
            {submitState === "loading" ? "Posting…" : "Post comment"}
          </motion.button>
        </div>
      </form>

      {/* Comment list */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <motion.span
            className="size-5 rounded-full border-2 border-border border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            aria-label="Loading comments" />
        </div>
      ) : comments.length > 0 ? (
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE.spring }}
                className="flex flex-col gap-2 p-4 rounded-xl bg-muted/40 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-7 rounded-full flex items-center justify-center
                               text-[11px] font-bold text-primary-foreground shrink-0"
                    style={{ background: "color-mix(in oklch, var(--primary) 80%, transparent)" }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short",
                    })}
                  </span>
                </div>
                <p className="text-[13px] leading-[1.75] text-muted-foreground pl-10">
                  {c.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-[13px] text-muted-foreground/60 text-center py-6">
          No comments yet — be the first to leave one.
          <br />
          <span className="text-[11px] opacity-70">
            Comments are reviewed before appearing.
          </span>
        </p>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface BlogPostModalProps {
  post:    SanityBlogPost | null;
  onClose: () => void;
}

export function BlogPostModal({ post, onClose }: BlogPostModalProps) {
  const scrollRef                       = useRef<HTMLDivElement>(null);
  const [body,        setBody]          = useState<PortableTextBlock[] | null>(null);
  const [bodyLoading, setBodyLoading]   = useState(false);

  const accentVar = post?.accent === "primary" ? "var(--primary)" : "var(--secondary)";

  // Fetch post body lazily when the modal opens (card list has no body)
  useEffect(() => {
    if (!post) return;
    setBody(null);
    setBodyLoading(true);
    fetch(`/api/post-body?id=${post._id}`)
      .then((r) => r.json())
      .then((data) => setBody(data.body ?? []))
      .catch(()  => setBody([]))
      .finally(() => setBodyLoading(false));
  }, [post?._id]);

  // Scroll to top when post changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [post?._id]);

  // Body scroll lock + Escape
  useEffect(() => {
    if (!post) return;
    const prev  = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-60 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer */}
          <motion.div
            key="modal"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%",   opacity: 1 }}
            exit={{   y: "100%",  opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE.spring }}
            className="fixed bottom-0 left-0 right-0 z-70
                       flex flex-col bg-background rounded-t-[28px] shadow-2xl"
            style={{ maxHeight: "93dvh" }}
            role="dialog"
            aria-modal="true"
            aria-label={post.title}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" aria-hidden />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-5 size-9 flex items-center justify-center
                         rounded-full border border-border text-muted-foreground
                         hover:text-foreground hover:border-foreground/30
                         transition-colors duration-200 z-10"
              aria-label="Close post"
            >
              <IconX />
            </button>

            {/* Scrollable body */}
            <div ref={scrollRef} className="overflow-y-auto overscroll-contain flex-1">
              <div className="max-w-180 mx-auto px-6 md:px-10 pb-16 pt-4">

                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    {/* Category pill */}
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.16em]
                                 px-3 py-1 rounded-full"
                      style={{
                        background: `color-mix(in oklch, ${accentVar} 12%, transparent)`,
                        color:      `color-mix(in oklch, ${accentVar} 90%, var(--foreground))`,
                        border:     `1px solid color-mix(in oklch, ${accentVar} 22%, transparent)`,
                      }}
                    >
                      {post.category}
                    </span>
                    {/* Date */}
                    <span className="text-[12px] text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                    <span className="size-1 rounded-full bg-border" aria-hidden />
                    {/* Read time */}
                    <span className="text-[12px] text-muted-foreground">
                      {post.readTime} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-serif font-medium text-foreground leading-tight
                               tracking-[-0.025em] mb-5"
                    style={{ fontSize: "clamp(24px, 4vw, 38px)" }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-base leading-[1.8] text-muted-foreground
                                border-l-2 border-primary pl-4 italic font-serif">
                    {post.excerpt}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="h-px w-full mb-8 opacity-30"
                  style={{ background: `linear-gradient(90deg, ${accentVar}, transparent)` }}
                  aria-hidden
                />

                {/* Body — Portable Text rendered via PortableTextRenderer */}
                {bodyLoading ? (
                  <div className="flex justify-center py-16">
                    <motion.span
                      className="size-6 rounded-full border-2 border-border border-t-primary"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      aria-label="Loading content" />
                  </div>
                ) : body && body.length > 0 ? (
                  <PortableTextRenderer value={body} />
                ) : body && body.length === 0 ? (
                  <p className="text-sm text-muted-foreground/60 text-center py-8">
                    No content yet.
                  </p>
                ) : null}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 mb-8">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-3 py-1 rounded-full
                                 bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="h-px w-full bg-border mb-8" aria-hidden />

                {/* Reactions — counts stored in Sanity via /api/reactions */}
                <ReactionBar postId={post._id} />

                <div className="h-8" aria-hidden />

                {/* Comments — stored in Sanity via /api/comments, moderated */}
                <CommentSection postId={post._id} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}