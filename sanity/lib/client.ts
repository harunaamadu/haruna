import { createClient }   from "next-sanity";
import imageUrlBuilder, { SanityImageSource }    from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/types";

// ─── Environment ──────────────────────────────────────────────────────────────
//
// Required in .env.local:
//
//   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
//   NEXT_PUBLIC_SANITY_DATASET=production
//   SANITY_API_WRITE_TOKEN=your_write_token    ← server-only (no NEXT_PUBLIC_)
//
const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

if (!projectId) {
  throw new Error(
    "[Sanity] Missing NEXT_PUBLIC_SANITY_PROJECT_ID — add it to .env.local",
  );
}

// ─── Read client — CDN-cached, safe for components ────────────────────────────
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// ─── Write client — server-only, uses token ───────────────────────────────────
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "[Sanity] Missing SANITY_API_WRITE_TOKEN — add a token with " +
      '"Editor" permissions to .env.local',
    );
  }
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token });
}

// ─── Image URL builder ────────────────────────────────────────────────────────
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ─── TypeScript types ─────────────────────────────────────────────────────────

export type BlogCategory =
  | "Engineering" | "Design" | "Career" | "Open Source" | "Tooling";

/** Card-level post shape — no body (loaded lazily on modal open) */
export interface SanityBlogPost {
  _id:         string;
  title:       string;
  slug:        string;   // flattened from slug.current in query
  excerpt:     string;
  category:    BlogCategory;
  tags:        string[];
  publishedAt: string;
  readTime:    number;
  coverGlyph:  string;
  accent:      "primary" | "secondary";
  featured:    boolean;
  likes:       number;
  dislikes:    number;
}

/** Full post including Portable Text body */
export interface SanityBlogPostFull extends SanityBlogPost {
  body: PortableTextBlock[];
}

/** Public comment shape — email is never exposed */
export interface SanityComment {
  _id:       string;
  name:      string;
  text:      string;
  createdAt: string;
}

// ─── GROQ queries ─────────────────────────────────────────────────────────────

/**
 * All published posts ordered newest-first.
 * Does NOT include body — kept lean for the blog grid.
 */
export const ALL_POSTS_QUERY = /* groq */ `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    tags,
    publishedAt,
    readTime,
    coverGlyph,
    accent,
    featured,
    "likes":    coalesce(likes,    0),
    "dislikes": coalesce(dislikes, 0)
  }
`;

/**
 * Post body fetched on-demand when the modal opens.
 * Uses _id so we don't need a second slug lookup.
 */
export const POST_BODY_BY_ID_QUERY = /* groq */ `
  *[_type == "post" && _id == $id][0] {
    _id,
    body
  }
`;

/**
 * All approved comments for a post, newest-first.
 * Email is deliberately excluded from the projection.
 */
export const COMMENTS_BY_POST_QUERY = /* groq */ `
  *[_type == "comment" && post._ref == $postId && approved == true]
  | order(createdAt desc) {
    _id,
    name,
    text,
    createdAt
  }
`;

// ─── Fetch helpers ────────────────────────────────────────────────────────────

/** Fetch all blog posts for the blog section grid. */
export async function getAllPosts(): Promise<SanityBlogPost[]> {
  return sanityClient.fetch<SanityBlogPost[]>(ALL_POSTS_QUERY, {}, {
    next: { revalidate: 60 },   // ISR — revalidate every 60 s
  });
}

/** Fetch a single post body by _id (modal on-demand load). */
export async function getPostBody(
  id: string,
): Promise<{ _id: string; body: PortableTextBlock[] } | null> {
  return sanityClient.fetch(POST_BODY_BY_ID_QUERY, { id }, {
    next: { revalidate: 120 },
  });
}

/** Fetch approved comments for a given post. */
export async function getComments(postId: string): Promise<SanityComment[]> {
  return sanityClient.fetch<SanityComment[]>(
    COMMENTS_BY_POST_QUERY,
    { postId },
    { next: { revalidate: 30 } },  // fresher — comments appear quicker after approval
  );
}