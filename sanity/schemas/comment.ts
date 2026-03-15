import { defineField, defineType } from "sanity";

export const commentSchema = defineType({
  name:  "comment",
  title: "Comment",
  type:  "document",

  // In Sanity v3 the "Create new" button is suppressed by removing the
  // document type from the desk structure's new-document list rather than
  // via the removed __experimental_actions field.
  // The sanity.config.ts structure only shows comment lists filtered by
  // approved status — there is no raw "create comment" entry point.
  //
  // If you also want to hide comments from the global "Create" search palette,
  // wrap the schema registration in the `__experimental_omnisearch_visibility`
  // option once Sanity stabilises that API, or restrict it via RBAC roles.

  fields: [
    defineField({
      name:       "post",
      title:      "Post",
      type:       "reference",
      to:         [{ type: "post" }],
      readOnly:   true,
      validation: (R) => R.required(),
    }),

    defineField({
      name:       "name",
      title:      "Name",
      type:       "string",
      readOnly:   true,
      validation: (R) => R.required(),
    }),

    defineField({
      name:        "email",
      title:       "Email (private)",
      type:        "string",
      readOnly:    true,
      description: "Never exposed publicly — for moderation use only.",
    }),

    defineField({
      name:       "text",
      title:      "Comment",
      type:       "text",
      rows:       4,
      readOnly:   true,
      validation: (R) => R.required().max(600),
    }),

    defineField({
      name:         "approved",
      title:        "Approved",
      type:         "boolean",
      description:  "Toggle on then Publish to make this comment publicly visible.",
      initialValue: false,
      // The only field editors should be able to change
    }),

    defineField({
      name:      "createdAt",
      title:     "Submitted at",
      type:      "datetime",
      readOnly:  true,
    }),
  ],

  preview: {
    select: {
      name:     "name",
      text:     "text",
      approved: "approved",
      post:     "post.title",
    },
    prepare({ name, text, approved, post }) {
      return {
        title:    `${approved ? "✓" : "⏳"} ${name ?? "Anonymous"}`,
        subtitle: `${post ?? "unknown post"} — ${(text ?? "").slice(0, 60)}…`,
      };
    },
  },

  orderings: [
    {
      title: "Newest first",
      name:  "createdAtDesc",
      by:    [{ field: "createdAt", direction: "desc" }],
    },
  ],
});