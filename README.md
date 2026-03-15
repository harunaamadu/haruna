import { NextRequest, NextResponse } from "next/server";
import { getComments, getWriteClient, sanityClient } from "../../../../sanity/lib/client";

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// For production, replace with Upstash Redis or similar edge KV store.
const store   = new Map<string, number[]>();
const WIN_MS  = 60_000; // 1-minute window
const MAX_REQ = 3;      // max 3 submissions per IP per window

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const hits = (store.get(ip) ?? []).filter((t) => now - t < WIN_MS);
  if (hits.length >= MAX_REQ) return true;
  store.set(ip, [...hits, now]);
  return false;
}

// ─── Spam patterns ────────────────────────────────────────────────────────────
const SPAM = [/<script/i, /href\s*=/i, /\bviagra\b/i, /\bcasino\b/i];

function isSpam(text: string, name: string): boolean {
  return SPAM.some((p) => p.test(text) || p.test(name));
}

// ─── GET /api/comments?postId=<id> ───────────────────────────────────────────
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId")?.trim();

  if (!postId) {
    return NextResponse.json(
      { error: "postId query param is required." },
      { status: 400 },
    );
  }

  try {
    const comments = await getComments(postId);
    return NextResponse.json(comments, {
      headers: {
        // Short cache — approved comments should appear within 30 s
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[GET /api/comments]", err);
    return NextResponse.json(
      { error: "Failed to fetch comments." },
      { status: 500 },
    );
  }
}

// ─── POST /api/comments ───────────────────────────────────────────────────────
// Body: { postId: string; name: string; email?: string; text: string }
export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions — please wait a moment." },
      { status: 429 },
    );
  }

  // Parse body
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { postId, name, email, text } =
    (raw ?? {}) as Record<string, string | undefined>;

  // ── Field validation ──────────────────────────────────────────────────────
  if (!postId?.trim()) {
    return NextResponse.json({ error: "postId is required." }, { status: 400 });
  }
  if (!name?.trim() || name.trim().length > 60) {
    return NextResponse.json(
      { error: "Name is required and must be under 60 characters." },
      { status: 400 },
    );
  }
  if (!text?.trim() || text.trim().length < 5) {
    return NextResponse.json(
      { error: "Comment must be at least 5 characters." },
      { status: 400 },
    );
  }
  if (text.trim().length > 600) {
    return NextResponse.json(
      { error: "Comment must be under 600 characters." },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (isSpam(text, name)) {
    // Silent reject — don't tell bots what triggered it
    return NextResponse.json(
      { message: "Comment submitted — awaiting moderation." },
      { status: 201 },
    );
  }

  // ── Verify post exists ────────────────────────────────────────────────────
  const postExists = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type == "post" && _id == $postId][0]{ _id }`,
    { postId },
  );
  if (!postExists) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  // ── Write to Sanity ───────────────────────────────────────────────────────
  try {
    await getWriteClient().create({
      _type:    "comment",
      post:     { _type: "reference", _ref: postId.trim() },
      name:     name.trim(),
      ...(email?.trim() ? { email: email.trim() } : {}),
      text:     text.trim(),
      approved: false,  // editor approves in Studio before it goes public
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Comment submitted — it will appear after moderation." },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/comments]", err);
    return NextResponse.json(
      { error: "Failed to save comment. Please try again." },
      { status: 500 },
    );
  }
}