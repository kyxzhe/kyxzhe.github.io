"use client";

import { useState, type HTMLAttributes, type ReactNode } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { cn } from "@/lib/utils/util";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c++", cpp);

interface MarkdownCodeBlockProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

function getCodeText(children: ReactNode) {
  return typeof children === "string"
    ? children
    : Array.isArray(children)
      ? children.join("")
      : "";
}

function PlainCodeBlock({
  children,
  className,
  ...props
}: MarkdownCodeBlockProps) {
  return (
    <div
      className="relative max-w-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] dark:border-white/10"
      style={{ background: "var(--pill-background)" }}
    >
      <pre
        className="overflow-x-auto rounded-lg px-4 py-3 text-[var(--foreground)]"
        style={{ background: "var(--pill-background)" }}
      >
        <code className={cn("block text-[0.95em] leading-[1.6] font-mono text-inherit", className)} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownCodeBlock({
  children,
  className,
  ...props
}: MarkdownCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const text = getCodeText(children);
  const language =
    (className?.match(/language-([\w-]+)/)?.[1] as string | undefined) || undefined;
  const codeBackground = "var(--pill-background)";
  const codeLabel = (language ?? "text").toLowerCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore clipboard errors
    }
  };

  if (!language) {
    return <PlainCodeBlock className={className} {...props}>{children}</PlainCodeBlock>;
  }

  return (
    <div
      className="relative group max-w-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] dark:border-white/10"
      style={{ background: codeBackground }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 text-[12px] tracking-[0.12em] text-[rgb(93,93,93)] dark:text-[rgb(243,243,243)]"
        style={{ background: codeBackground }}
      >
        <span className="flex-1 text-left truncate lowercase">{codeLabel}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 bg-transparent px-1.5 py-[4px] text-[12px] text-[rgb(93,93,93)] transition hover:opacity-80 dark:text-[rgb(243,243,243)]"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <span aria-hidden="true">✓</span>
              <span>Copied</span>
            </>
          ) : (
            <span>Copy</span>
          )}
        </button>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: "0 0 10px 10px",
            background: codeBackground,
            padding: "12px 16px",
          }}
          codeTagProps={{
            className: "text-[0.95em] leading-[1.6] font-mono",
          }}
          wrapLongLines={false}
        >
          {text}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
