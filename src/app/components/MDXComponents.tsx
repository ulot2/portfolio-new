import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";

export const mdxComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="prose-h1" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="prose-h2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="prose-h3" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="prose-p" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="prose-ul" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="prose-ol" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="prose-li" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="prose-blockquote" {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="prose-hr" {...props} />
  ),
  pre: ({ children }: { children?: React.ReactNode }) => {
    return <div className="prose-pre-container">{children}</div>;
  },
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className || !className.includes("language-");
    if (isInline) {
      return (
        <code className="prose-inline-code" {...props}>
          {children}
        </code>
      );
    }
    return (
      <CodeBlock className={className}>
        {children}
      </CodeBlock>
    );
  },
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link href={href} className="prose-link" {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="prose-link prose-external-link"
        {...props}
      >
        <span>{children}</span>
        <ArrowUpRight size={13} className="prose-link-icon" />
      </a>
    );
  },
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="prose-table-wrapper">
      <table className="prose-table" {...props}>
        {children}
      </table>
    </div>
  ),
  Callout,
  CodeBlock,
};
