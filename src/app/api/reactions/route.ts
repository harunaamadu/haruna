import { NextRequest, NextResponse } from "next/server";
import { getWriteClient, sanityClient } from "../../../../sanity/lib/client";

// ─── Reactions are stored as fields directly on the `post` document ──────────
// This avoids a separate `reaction` schema entirely and keeps reads simple.
// The post schema has  `likes: number`  and  `dislikes: number` fields.

// ─── GROQ query for current reaction counts ───────────────────────────────────
const REACTION_QUERY = /* groq */ `
  *[_type == "post" && _id == $postId][0] {
    "likes":    coalesce(likes,    0),
    "dislikes": coalesce(dislikes, 0)
  }
`;

// ─── GET /api/reactions?postId=<id> ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId")?.trim();

  if (!postId) {
    return NextResponse.json(
      { error: "postId query param is required." },
      { status: 400 },
    );
  }

  try {
    const data = await sanityClient.fetch<{ likes: number; dislikes: number } | null>(
      REACTION_QUERY,
      { postId },
      { next: { revalidate: 30 } },
    );

    return NextResponse.json({
      likes:    data?.likes    ?? 0,
      dislikes: data?.dislikes ?? 0,
    });
  } catch (err) {
    console.error("[GET /api/reactions]", err);
    return NextResponse.json(
      { error: "Failed to fetch reactions." },
      { status: 500 },
    );
  }
}

// ─── POST /api/reactions ─────────────────────────────────────────────────────
// Body: { postId: string; type: "like" | "dislike"; delta: 1 | -1 }
//
//  delta  +1 → cast vote
//  delta  -1 → undo vote
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { postId, type, delta } = (raw ?? {}) as {
    postId?: string;
    type?:   string;
    delta?:  number;
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  if (!postId?.trim()) {
    return NextResponse.json({ error: "postId is required." }, { status: 400 });
  }
  if (type !== "like" && type !== "dislike") {
    return NextResponse.json(
      { error: "type must be 'like' or 'dislike'." },
      { status: 400 },
    );
  }
  if (delta !== 1 && delta !== -1) {
    return NextResponse.json(
      { error: "delta must be 1 or -1." },
      { status: 400 },
    );
  }

  const field = type === "like" ? "likes" : "dislikes";

  try {
    // Fetch the current value so we can floor at 0
    const current = await sanityClient.fetch<{ likes: number; dislikes: number } | null>(
      REACTION_QUERY,
      { postId },
      { cache: "no-store" },
    );

    const currentValue = (current?.[field] ?? 0) as number;
    const newValue     = Math.max(0, currentValue + delta);

    // Patch the post document directly — no separate reaction doc needed
    await getWriteClient()
      .patch(postId.trim())
      .set({ [field]: newValue })
      .commit({ autoGenerateArrayKeys: true });

    // Return the fresh totals after the patch
    const updated = await sanityClient.fetch<{ likes: number; dislikes: number } | null>(
      REACTION_QUERY,
      { postId },
      { cache: "no-store" },
    );

    return NextResponse.json({
      likes:    updated?.likes    ?? 0,
      dislikes: updated?.dislikes ?? 0,
    });
  } catch (err) {
    console.error("[POST /api/reactions]", err);
    return NextResponse.json(
      { error: "Failed to update reaction. Please try again." },
      { status: 500 },
    );
  }
}