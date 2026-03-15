"use client";

/**
 * Sanity Studio page — /studio
 *
 * The Studio MUST be loaded with `ssr: false` via Next.js dynamic import.
 * It calls React.createContext and accesses browser globals (window,
 * localStorage) at module evaluation time — which crashes the Node.js
 * SSR runtime during `next build`.
 *
 * `dynamic(..., { ssr: false })` defers the entire module to the browser,
 * completely bypassing server-side evaluation.
 */

import dynamic from "next/dynamic";
import sanityConfig from "../../../../../sanity.config";

// NextStudio is only ever evaluated in the browser
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr:     false,
    loading: () => (
      <div
        style={{
          minHeight:      "100dvh",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "#101010",
          color:          "rgba(255,255,255,0.4)",
          fontFamily:     "system-ui, sans-serif",
          fontSize:       14,
          letterSpacing:  "0.08em",
        }}
      >
        Loading Studio…
      </div>
    ),
  },
);

// Import config lazily too — it references process.env which is fine,
// but keeping it alongside the dynamic import is cleaner

export default function StudioPage() {
  return <NextStudio config={sanityConfig} />;
}