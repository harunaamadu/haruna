import { NextResponse } from "next/server";
import { getAllPosts } from "../../../../sanity/lib/client";

// ─── GET /api/posts ───────────────────────────────────────────────────────────
//
// Returns all published blog posts ordered newest-first.
// Body content is excluded — loaded lazily per-post via /api/post-body.
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts ?? [], {
      headers: {
        // ISR-style caching: serve stale while revalidating in background
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[GET /api/posts]", err);
    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 },
    );
  }
}