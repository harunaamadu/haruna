import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name:  "post",
  title: "Blog Post",
  type:  "document",

  fields: [
    defineField({
      name:        "title",
      title:       "Title",
      type:        "string",
      validation:  (R) => R.required().min(10).max(120),
    }),

    defineField({
      name:  "slug",
      title: "Slug",
      type:  "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),

    defineField({
      name:        "excerpt",
      title:       "Excerpt",
      description: "Short summary shown on the card (1–2 sentences).",
      type:        "text",
      rows:        3,
      validation:  (R) => R.required().max(280),
    }),

    defineField({
      name:  "body",
      title: "Body",
      type:  "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal",      value: "normal"  },
            { title: "Heading 2",   value: "h2"      },
            { title: "Heading 3",   value: "h3"      },
            { title: "Quote",       value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold",      value: "strong" },
              { title: "Italic",    value: "em"     },
              { title: "Code",      value: "code"   },
            ],
            annotations: [
              {
                name:  "link",
                type:  "object",
                title: "Link",
                fields: [
                  defineField({
                    name:    "href",
                    type:    "url",
                    title:   "URL",
                    validation: (R) =>
                      R.uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                  defineField({
                    name:    "blank",
                    type:    "boolean",
                    title:   "Open in new tab",
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        },
        // Inline code block
        {
          type: "object",
          name: "codeBlock",
          title: "Code Block",
          fields: [
            defineField({ name: "language", title: "Language", type: "string",
              options: { list: ["typescript", "javascript", "bash", "json", "css", "html"] },
              initialValue: "typescript",
            }),
            defineField({ name: "code", title: "Code", type: "text" }),
          ],
          preview: {
            select: { title: "language", subtitle: "code" },
            prepare({ title, subtitle }) {
              return { title: `Code: ${title}`, subtitle: subtitle?.slice(0, 60) };
            },
          },
        },
      ],
    }),

    defineField({
      name:    "category",
      title:   "Category",
      type:    "string",
      options: {
        list: [
          { title: "Engineering",  value: "Engineering"  },
          { title: "Design",       value: "Design"       },
          { title: "Career",       value: "Career"       },
          { title: "Open Source",  value: "Open Source"  },
          { title: "Tooling",      value: "Tooling"      },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),

    defineField({
      name:  "tags",
      title: "Tags",
      type:  "array",
      of:    [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name:        "publishedAt",
      title:       "Published at",
      type:        "datetime",
      initialValue: () => new Date().toISOString(),
      validation:   (R) => R.required(),
    }),

    defineField({
      name:        "readTime",
      title:       "Read time (minutes)",
      type:        "number",
      validation:  (R) => R.required().min(1).max(60),
    }),

    defineField({
      name:    "coverGlyph",
      title:   "Cover glyph",
      description: "Single character / emoji / symbol used on the card visual.",
      type:    "string",
      validation: (R) => R.required().max(4),
    }),

    defineField({
      name:    "accent",
      title:   "Accent colour",
      type:    "string",
      options: {
        list: [
          { title: "Primary (purple)", value: "primary"   },
          { title: "Secondary (amber)", value: "secondary" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (R) => R.required(),
    }),

    defineField({
      name:         "featured",
      title:        "Featured",
      type:         "boolean",
      description:  "Featured posts appear in the large horizontal card layout.",
      initialValue: false,
    }),

    // Reaction counters — managed by the API route, not editors
    defineField({
      name:         "likes",
      title:        "Likes",
      type:         "number",
      initialValue: 0,
      readOnly:     true,
    }),
    defineField({
      name:         "dislikes",
      title:        "Dislikes",
      type:         "number",
      initialValue: 0,
      readOnly:     true,
    }),
  ],

  preview: {
    select: {
      title:    "title",
      subtitle: "category",
      media:    "coverGlyph",
    },
    prepare({ title, subtitle }) {
      return { title, subtitle: `${subtitle ?? ""}` };
    },
  },

  orderings: [
    {
      title: "Published (newest first)",
      name:  "publishedAtDesc",
      by:    [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});