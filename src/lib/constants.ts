// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export interface JourneyItem {
  year: string;
  title: string;
  body: string;
}

export const JOURNEY: JourneyItem[] = [
  {
    year: "2017",
    title: "Graphic Design & 3D Modeling",
    body: "Started my creative journey working with Adobe Illustrator, Photoshop, and Blender, building skills in visual design, digital illustration, and basic 3D modeling.",
  },
  {
    year: "2019",
    title: "The Spark",
    body: "Built my first webpage with HTML & CSS. Fell in love with the alchemy of turning code into something people could see and touch.",
  },
  {
    year: "2021",
    title: "Going Deeper",
    body: "Mastered JavaScript and React. Started shipping real products, learning that great software is equal parts empathy and engineering.",
  },
  {
    year: "2023",
    title: "Full-Stack Era",
    body: "Expanded into Node, databases, and cloud infrastructure. Delivered end-to-end solutions for clients across three continents.",
  },
  {
    year: "2024",
    title: "Bachelor Degree in Education",
    body: "Completed my Bachelor of Education at Accra College of Education, strengthening my foundation in pedagogy, leadership, and communication while continuing to grow as a web developer.",
  },
  {
    year: "2026",
    title: "Now",
    body: "Focused on crafting premium digital experiences where precision design meets performant engineering. Open to meaningful collaborations.",
  },
];

// ─── Skill data ───────────────────────────────────────────────────────────────
export type Category = "Frontend" | "Backend" | "Tools" | "Design";

interface Skill {
  name: string;
  level: number; // 0–100
  icon: string; // SVG path / emoji fallback
  category: Category;
  featured?: boolean;
}

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React", level: 95, icon: "⚛", category: "Frontend", featured: true },
  {
    name: "Next.js",
    level: 92,
    icon: "▲",
    category: "Frontend",
    featured: true,
  },
  {
    name: "TypeScript",
    level: 90,
    icon: "TS",
    category: "Frontend",
    featured: true,
  },
  { name: "Tailwind CSS", level: 93, icon: "🌊", category: "Frontend" },
  { name: "Framer Motion", level: 80, icon: "◍", category: "Frontend" },
  { name: "GSAP", level: 78, icon: "⚡", category: "Frontend" },
  { name: "HTML & CSS", level: 98, icon: "❯", category: "Frontend" },
  { name: "Shadcn/ui", level: 88, icon: "◈", category: "Frontend" },

  // Backend
  {
    name: "Node.js",
    level: 85,
    icon: "⬡",
    category: "Backend",
    featured: true,
  },
  { name: "Express", level: 83, icon: "Ex", category: "Backend" },
  { name: "PostgreSQL", level: 78, icon: "🐘", category: "Backend" },
  { name: "MongoDB", level: 75, icon: "🍃", category: "Backend" },
  { name: "Prisma", level: 80, icon: "◆", category: "Backend" },
  { name: "REST APIs", level: 90, icon: "⇄", category: "Backend" },
  { name: "GraphQL", level: 70, icon: "◉", category: "Backend" },

  // Tools
  {
    name: "Git & GitHub",
    level: 92,
    icon: "⑂",
    category: "Tools",
    featured: true,
  },
  { name: "VS Code", level: 95, icon: "{}", category: "Tools" },
  { name: "Docker", level: 68, icon: "🐳", category: "Tools" },
  { name: "Vercel", level: 88, icon: "▲", category: "Tools" },
  { name: "Figma", level: 75, icon: "✦", category: "Tools" },
  { name: "Linux/CLI", level: 80, icon: "$_", category: "Tools" },

  // Design
  { name: "Figma", level: 76, icon: "✦", category: "Design", featured: true },
  { name: "Design Systems", level: 82, icon: "⊞", category: "Design" },
  { name: "Typography", level: 85, icon: "Aa", category: "Design" },
  { name: "Motion Design", level: 74, icon: "◍", category: "Design" },
  { name: "Color Theory", level: 80, icon: "◑", category: "Design" },
];

export const CATEGORIES: Category[] = [
  "Frontend",
  "Backend",
  "Tools",
  "Design",
];

export const MARQUEE_ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "GSAP",
  "Framer Motion",
  "Docker",
  "Figma",
  "GraphQL",
  "Prisma",
  "Vercel",
  "Git",
  "REST APIs",
];

// ─── Project data ─────────────────────────────────────────────────────────────

export type ProjectTag =
  | "React"
  | "Next.js"
  | "TypeScript"
  | "Node.js"
  | "PostgreSQL"
  | "Tailwind CSS"
  | "Prisma"
  | "GraphQL"
  | "MongoDB"
  | "Stripe"
  | "Framer Motion"
  | "GSAP"
  | "Supabase"
  | "tRPC"
  | "Redis";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDesc: string;
  tags: ProjectTag[];
  liveUrl: string;
  githubUrl: string;
  /** Accent colour shown on the card — uses CSS var names */
  accent: string;
  /** Large display number / index shown on the card */
  number: string;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "look-book",
    title: "Look-book — E-commerce",
    description:
      "A full-stack analytics platform with real-time data visualisation, role-based access, and Stripe billing.",
    longDesc:
      "Built with Next.js App Router, tRPC for end-to-end type safety, Supabase for auth and storage, and Recharts for interactive dashboards. Supports multi-tenancy with per-organisation billing via Stripe.",
    tags: [
      "Next.js",
      "TypeScript",
      "tRPC",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
    ],
    liveUrl: "https://look-book-ecru.vercel.app",
    githubUrl: "https://github.com/haruna/nexus",
    accent: "var(--primary)",
    number: "01",
    featured: true,
  },
  {
    id: "craftbase",
    title: "CraftBase — Design System",
    description:
      "A production-ready component library and design system built on Radix UI and Tailwind CSS.",
    longDesc:
      "Covers 60+ accessible components, a token-driven theming system, dark-mode support, Storybook docs, and automated visual regression tests. Used across three client projects.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://craftbase.dev",
    githubUrl: "https://github.com/haruna/craftbase",
    accent: "var(--secondary)",
    number: "02",
    featured: true,
  },
  {
    id: "verdant",
    title: "Verdant — E-Commerce",
    description:
      "A headless e-commerce storefront with a focus on editorial storytelling and conversion-optimised UX.",
    longDesc:
      "Powered by Next.js, Prisma, PostgreSQL, and Stripe. Features server-side cart, wishlist, optimistic UI updates, and a content-rich homepage built with custom GSAP scroll animations.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "GSAP"],
    liveUrl: "https://verdant-store.vercel.app",
    githubUrl: "https://github.com/haruna/verdant",
    accent: "var(--primary)",
    number: "03",
    featured: true,
  },
  {
    id: "pulse-api",
    title: "Pulse — REST API",
    description:
      "A high-performance Node.js REST API serving 50k+ daily requests with Redis caching and JWT auth.",
    longDesc:
      "Designed with a layered architecture — controllers, services, repositories. Includes rate limiting, request validation with Zod, structured logging with Pino, and full OpenAPI documentation.",
    tags: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "GraphQL"],
    liveUrl: "https://pulse-api-docs.dev",
    githubUrl: "https://github.com/haruna/pulse-api",
    accent: "var(--secondary)",
    number: "04",
    featured: false,
  },
  {
    id: "lumina-portfolio",
    title: "Lumina — Portfolio Template",
    description:
      "An open-source Awwwards-inspired portfolio template with GSAP scroll storytelling.",
    longDesc:
      "Ships as a fully customisable Next.js starter. Includes 7 animated sections, dark mode, SEO metadata, and a Contentlayer-powered blog. 300+ GitHub stars.",
    tags: ["Next.js", "TypeScript", "GSAP", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://lumina-template.vercel.app",
    githubUrl: "https://github.com/haruna/lumina",
    accent: "var(--primary)",
    number: "05",
    featured: false,
  },
  {
    id: "graphflow",
    title: "GraphFlow — Data Viz",
    description:
      "An interactive graph visualisation tool for exploring complex relational datasets.",
    longDesc:
      "Built with React, D3.js for force-directed graphs, and a GraphQL API. Users can filter, zoom, export, and share graph snapshots. Supports datasets up to 10k nodes.",
    tags: ["React", "TypeScript", "GraphQL", "MongoDB"],
    liveUrl: "https://graphflow.app",
    githubUrl: "https://github.com/haruna/graphflow",
    accent: "var(--secondary)",
    number: "06",
    featured: false,
  },
];

// ─── Blog data ────────────────────────────────────────────────────────────────
 
export type BlogCategory =
  | "Engineering" | "Design" | "Career" | "Open Source" | "Tooling";
 
export interface BlogPost {
  id:          string;
  title:       string;
  excerpt:     string;
  content:     string;   // Markdown-style paragraphs separated by \n\n
  category:    BlogCategory;
  tags:        string[];
  date:        string;   // ISO date string
  readTime:    number;   // minutes
  coverGlyph:  string;   // decorative symbol for the card visual
  accent:      "primary" | "secondary";
}
 
export const BLOG_POSTS: BlogPost[] = [
  {
    id:         "craft-of-animation",
    title:      "The Craft of Web Animation: GSAP vs Framer Motion",
    excerpt:    "A deep dive into when to reach for GSAP's timeline power versus Framer Motion's declarative elegance — and how to use both together.",
    content:    `Animation is one of those disciplines where the tool you choose shapes the result as much as your skill does. After shipping dozens of animated interfaces, I've developed a clear mental model for when each library shines.\n\nGSAP is a sequencing engine. Its real power is the Timeline — a conductor's baton that lets you orchestrate dozens of elements with microsecond precision. When you need a hero entrance that coordinates 15 elements, or a scroll-driven narrative where things happen in exact relation to each other, GSAP is unmatched.\n\nFramer Motion, on the other hand, is a *state machine with physics*. Declare where something should be in a given state, and Framer handles the rest. It understands React's component lifecycle natively, which means enter/exit animations, shared layout transitions, and gesture handling feel natural rather than bolted on.\n\nMy rule of thumb: reach for Framer Motion when the animation is tied to UI state (hover, open/close, page transitions). Reach for GSAP when you're directing a scene — when the animation tells a story independent of user interaction.\n\nThe best portfolios I've seen use both. Framer Motion for micro-interactions and component choreography; GSAP for the hero section's theatrical entrance and scroll-based storytelling.`,
    category:   "Engineering",
    tags:       ["GSAP", "Framer Motion", "Animation", "React"],
    date:       "2025-02-14",
    readTime:   6,
    coverGlyph: "◍",
    accent:     "primary",
  },
  {
    id:         "design-systems-at-scale",
    title:      "Building a Design System That Actually Scales",
    excerpt:    "Hard-won lessons from building CraftBase — a token-driven component library used across multiple production projects.",
    content:    `The graveyard of failed design systems is enormous. Most die not from technical failure, but from adoption failure — engineers stop using them because they're inflexible, and designers stop maintaining them because the components drift from their Figma sources.\n\nThe single biggest insight from building CraftBase: **treat tokens as your API, not components**. Components change; the semantic meaning of "primary action" or "subtle surface" shouldn't. When you model your system around tokens — spacing, colour, radius, typography — the components become almost trivial to build correctly.\n\nThe second lesson: document the *why*, not just the *what*. Every component in CraftBase has a section called "When not to use this." This negative space documentation is what separates a useful system from a rigid one. Engineers who understand the intent can make good decisions at the edges.\n\nFinally, version your system like a public API. Breaking changes get a major bump. Deprecations get warnings in the console six months before removal. This discipline is what earns the trust of the teams using it.`,
    category:   "Design",
    tags:       ["Design Systems", "Tokens", "Components", "Figma"],
    date:       "2025-01-28",
    readTime:   8,
    coverGlyph: "⊞",
    accent:     "secondary",
  },
  {
    id:         "typescript-patterns",
    title:      "TypeScript Patterns I Wish I Knew Earlier",
    excerpt:    "Template literal types, const satisfies, and discriminated unions — the patterns that transformed how I model data.",
    content:    "TypeScript's type system is deep enough that even after years of daily use, I still discover patterns that make me rethink how I've been structuring code. Here are the three that changed my thinking most.\n\n**Template literal types** let you express string patterns as types. Instead of typing a CSS property as `string`, you can type it as `${number}px` | `${number}rem`. This sounds minor until you're building a design system and you want the compiler to catch `\"1.5\"` where `\"1.5rem\"` was expected.\n\n**Discriminated unions with exhaustive checking** are the closest TypeScript gets to pattern matching. Model your states as a union with a `type` discriminant, and a switch statement with a `never` default branch will surface unhandled cases at compile time. This technique alone has prevented more runtime bugs for me than any linting rule.\n\n**`satisfies`** (introduced in 4.9) is my most-used recent addition. It validates a value against a type *without widening it*. You get the benefits of type checking with the benefits of inference — the compiler knows the exact shape of your value, not just that it matches the constraint.",
    category:   "Engineering",
    tags:       ["TypeScript", "Patterns", "Developer Experience"],
    date:       "2025-01-10",
    readTime:   7,
    coverGlyph: "TS",
    accent:     "primary",
  },
  {
    id:         "open-source-lessons",
    title:      "What 300 GitHub Stars Taught Me About Open Source",
    excerpt:    "Lumina crossed 300 stars last month. Here's what I learned about documentation, community, and the unexpected weight of maintaining a public project.",
    content:    `When I published Lumina as an open source portfolio template, I expected a handful of developers to find it useful. 300 stars and 40 forks later, I've learned more about software maintenance than any job ever taught me.\n\nThe first thing that surprised me: **documentation is the product**. More issues were opened about unclear setup steps than about bugs. Every minute spent on a clear README is worth an hour of issue triage. I rewrote the docs three times before the issue rate dropped to a manageable level.\n\nThe second: **constraints breed contribution**. When I added a CONTRIBUTING.md with specific, scoped "good first issue" tasks, the PR rate tripled. Vague invitations to contribute produce nothing. Specific, bounded problems produce pull requests.\n\nThe hardest lesson: **you cannot maintain a public project the same way you maintain a private one**. Every breaking change carries real cost for people whose portfolios depend on the code working. I now treat semver as a social contract, not a version numbering convention.`,
    category:   "Open Source",
    tags:       ["Open Source", "Community", "GitHub", "Documentation"],
    date:       "2024-12-20",
    readTime:   5,
    coverGlyph: "⑂",
    accent:     "secondary",
  },
  {
    id:         "from-junior-to-senior",
    title:      "The Invisible Skill That Separates Junior from Senior Engineers",
    excerpt:    "It's not framework knowledge or algorithmic complexity — it's the ability to make and communicate tradeoffs.",
    content:    `Technical interviews are good at measuring a narrow band of skills: algorithmic thinking, syntax recall, framework knowledge. They're terrible at measuring the thing that most separates junior engineers from senior ones.\n\nThat thing is **tradeoff reasoning** — the ability to hold two competing goods in your head simultaneously and make a justified decision between them. Speed versus correctness. Flexibility versus simplicity. Developer experience versus runtime performance.\n\nJunior engineers often optimise a single axis because they don't yet see the others. A junior might reach for a complex abstraction because it's elegant, without considering that the team will spend more time understanding it than they saved writing it.\n\nSenior engineers make tradeoffs explicit. They say "I'm choosing X over Y because of Z, and here's what we give up." This transparency is what builds trust with teams and stakeholders. The decision matters less than the reasoning being visible and revisable.\n\nThe fastest path to senior thinking I've found: **narrate your decisions out loud** when pair programming or in code review. The act of explaining forces you to surface the tradeoffs you were making implicitly.`,
    category:   "Career",
    tags:       ["Career", "Engineering", "Growth", "Soft Skills"],
    date:       "2024-12-05",
    readTime:   6,
    coverGlyph: "◈",
    accent:     "primary",
  },
  {
    id:         "neovim-workflow",
    title:      "My Neovim Setup for Frontend Development in 2025",
    excerpt:    "After a year of daily Neovim use, here's the minimal configuration that makes TypeScript and React development genuinely fast.",
    content:    `I switched from VS Code to Neovim a year ago, driven partly by curiosity and partly by the embarrassment of watching a colleague navigate a codebase at what felt like superspeed. It was a rough month. Then it clicked.\n\nThe key insight: Neovim's value isn't speed for its own sake. It's that it trains you to think about editing as a *composable language* rather than a series of menu actions. Once you internalise verbs (delete, change, yank), motions (word, paragraph, inside brackets), and objects, editing becomes expressive in a way that mouse-driven editing never is.\n\nFor frontend specifically, my essential plugins are: \`nvim-lspconfig\` with \`typescript-tools.nvim\` for TypeScript LSP (faster than \`tsserver\` by a wide margin), \`conform.nvim\` for Prettier formatting on save, and \`blink.cmp\` for completions. The tree-sitter integration for TSX syntax highlighting is noticeably better than VS Code's TextMate grammar.\n\nThe plugin I recommend most for beginners: \`which-key.nvim\`. It surfaces your keybindings as you type them, which dramatically flattens the learning curve without training wheels that need to come off later.`,
    category:   "Tooling",
    tags:       ["Neovim", "Tooling", "Workflow", "TypeScript"],
    date:       "2024-11-18",
    readTime:   9,
    coverGlyph: "$_",
    accent:     "secondary",
  },
];