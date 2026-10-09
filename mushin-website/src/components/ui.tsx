import type { CSSProperties, ReactNode } from "react";

// Two-tone heading from the profile: outlined first word, solid second word, cyan full stop.
export function SectionTitle({
  outline,
  solid,
  className = "",
}: {
  outline: string;
  solid: string;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight md:text-7xl ${className}`}
    >
      <span className="text-outline block">{outline}</span>
      <span className="block text-text">
        {solid}
        <span className="text-cyan">.</span>
      </span>
    </h2>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
      {children}
    </p>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      data-reveal
      className={className}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
