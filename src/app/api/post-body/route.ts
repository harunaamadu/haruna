import { NextRequest, NextResponse } from "next/server";
import { getPostBody } from "../../../../sanity/lib/client";

// ─── GET /api/post-body?id=<_id> ─────────────────────────────────────────────
//
// Fetches the Portable Text body for a single post by its Sanity _id.
// Called lazily when the modal opens — the blog grid never loads body content,
// keeping the initial page payload lean.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json(
      { error: "id query param is required." },
      { status: 400 },
    );
  }

  try {
    const post = await getPostBody(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(
      { body: post.body ?? [] },
      {
        headers: {
          // Body content rarely changes — cache aggressively
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (err) {
    console.error("[GET /api/post-body]", err);
    return NextResponse.json(
      { error: "Failed to fetch post body." },
      { status: 500 },
    );
  }
}