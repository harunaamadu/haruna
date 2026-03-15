import { NextStudio } from "next-sanity/studio";
import sanityConfig from "../../../../../sanity.config";
// import config from "../../../../sanity.config";

// ─── Sanity Studio page ───────────────────────────────────────────────────────
//
// Mounts the full Sanity Studio at /studio in your Next.js app.
// Access it at: http://localhost:3000/studio
//
// The [[...tool]] catch-all segment is required so that Studio's internal
// routing (e.g. /studio/desk/post, /studio/vision) works correctly.
//
// force-static tells Next.js not to attempt server rendering this page —
// the Studio is a fully client-side SPA and must be rendered in the browser.

export const dynamic = "force-static";

// Opt this route out of the Content Security Policy if you have one set,
// since the Studio loads external scripts and fonts from Sanity's CDN.
export const metadata = {
  title: "Haruna — Studio",
};

export default function StudioPage() {
  return <NextStudio config={sanityConfig} />;
}