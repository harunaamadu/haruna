"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { cn } from "@/lib/utils";

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ value }: { value: { language?: string; code?: string } }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border">
      {value.language && (
        <div className="flex items-center px-4 py-2 border-b border-border"
          style={{ background: "color-mix(in oklch, var(--primary) 6%, var(--card))" }}>
          <span className="text-[11px] font-mono font-semibold uppercase
                           tracking-[0.12em] text-primary">
            {value.language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto p-5 m-0 text-[13px] leading-[1.75] bg-muted/60">
        <code className="font-mono text-foreground">{value.code}</code>
      </pre>
    </div>
  );
}

// ─── Component map ────────────────────────────────────────────────────────────
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15px] leading-[1.85] text-muted-foreground mb-5 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-[clamp(20px,2.5vw,26px)] font-medium
                     text-foreground tracking-[-0.02em] leading-tight mt-10 mb-4 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-[clamp(17px,2vw,21px)] font-medium
                     text-foreground tracking-[-0.01em] leading-tight mt-8 mb-3 first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative pl-5 my-6 border-l-2 border-primary">
        <p className="font-serif italic text-[16px] leading-[1.7] text-foreground/80 m-0">
          {children}
        </p>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-5 pl-5 flex flex-col gap-1.5 list-none">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 pl-5 flex flex-col gap-1.5 list-decimal">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="text-[15px] leading-[1.8] text-muted-foreground
                     flex items-start gap-2.5 before:content-['—']
                     before:text-primary before:shrink-0 before:mt-px before:text-[13px]">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[15px] leading-[1.8] text-muted-foreground pl-1">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground/80">{children}</em>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[13px] px-1.5 py-0.5 rounded-md"
        style={{
          background: "color-mix(in oklch, var(--primary) 10%, transparent)",
          color:      "color-mix(in oklch, var(--primary) 90%, var(--foreground))",
        }}>
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className={cn(
          "text-primary underline underline-offset-2 decoration-primary/40",
          "hover:decoration-primary transition-colors duration-150",
        )}>
        {children}
      </a>
    ),
  },

  types: {
    codeBlock: ({ value }) => <CodeBlock value={value} />,
  },
};

// ─── Export ───────────────────────────────────────────────────────────────────
export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  );
}