import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

// ─── Replace YOUR_PROJECT_ID with your actual Sanity project ID ───────────────
// Find it at: https://sanity.io/manage → your project → Settings
//
// The standalone Studio (pnpm sanity dev) runs via Vite, which does NOT load
// Next.js .env.local files. The projectId must be a literal string here.
// projectId is NOT a secret — it is safe to commit to version control.
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "mlvqjij0";
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    ?? "production";

export default defineConfig({
  name:      "haruna-portfolio",
  title:     "Haruna — Portfolio Studio",

  projectId: PROJECT_ID,
  dataset:   DATASET,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Blog Posts")
              .child(S.documentTypeList("post").title("Blog Posts")),
            S.divider(),
            S.listItem()
              .title("Comments (pending)")
              .child(
                S.documentTypeList("comment")
                  .title("Pending Comments")
                  .filter('_type == "comment" && approved == false'),
              ),
            S.listItem()
              .title("Comments (approved)")
              .child(
                S.documentTypeList("comment")
                  .title("Approved Comments")
                  .filter('_type == "comment" && approved == true'),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
});