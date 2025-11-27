"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSupersub from "remark-supersub";
import remarkDeflist from "remark-deflist";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { useState, type HTMLAttributes, type ReactNode } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import c from "react-syntax-highlighter/dist/cjs/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/cjs/languages/prism/cpp";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "@/lib/utils/util";
import "katex/dist/katex.min.css";

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

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

const MarkdownMessage = ({ content, className }: MarkdownMessageProps) => {
  const CodeBlock = ({
    children,
    className,
    ...props
  }: { children?: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) => {
    const [copied, setCopied] = useState(false);
    const text =
      typeof children === "string"
        ? children
        : Array.isArray(children)
          ? children.join("")
          : "";
    const language =
      (className?.match(/language-([\w-]+)/)?.[1] as string | undefined) || undefined;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } catch {
        // ignore clipboard errors
      }
    };

    return (
      <div className="relative group">
        {language ? (
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: "10px",
              background: "rgba(0,0,0,0.08)",
            }}
            codeTagProps={{
              className: "text-[0.95em] leading-[1.6] font-mono",
            }}
            wrapLongLines
          >
            {text}
          </SyntaxHighlighter>
        ) : (
          <pre className="rounded-lg bg-[rgba(0,0,0,0.08)] px-4 py-3 overflow-x-auto text-[var(--foreground)] dark:bg-white/10">
            <code className={cn("block text-[0.95em] leading-[1.6] font-mono text-inherit", className)} {...props}>
              {children}
            </code>
          </pre>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 inline-flex items-center gap-1 bg-transparent px-2 py-[6px] text-[12.5px] text-white/90 transition hover:opacity-80 dark:text-white"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkDeflist, remarkSupersub]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        skipHtml={false}
        components={{
          h1: ({ node, className, ...props }) => (
            <h1 className={cn("text-[22px] font-semibold leading-[1.35] mt-2 mb-3", className)} {...props} />
          ),
          h2: ({ node, className, ...props }) => (
            <h2 className={cn("text-[20px] font-semibold leading-[1.35] mt-2 mb-3", className)} {...props} />
          ),
          h3: ({ node, className, ...props }) => (
            <h3 className={cn("text-[18px] font-semibold leading-[1.35] mt-2 mb-2", className)} {...props} />
          ),
          h4: ({ node, className, ...props }) => (
            <h4 className={cn("text-[16px] font-semibold leading-[1.35] mt-2 mb-2", className)} {...props} />
          ),
          p: ({ node, className, ...props }) => (
            <div className={cn("whitespace-pre-line leading-[1.5]", className)} {...props} />
          ),
          ol: ({ node, className, children, ...props }) => (
            <ol
              className={cn("pl-5 space-y-1 leading-[1.5]", className)}
              style={{ listStyleType: "decimal", listStylePosition: "outside" }}
              {...props}
            >
              {children}
            </ol>
          ),
          ul: ({ node, className, children, ...props }) => (
            <ul
              className={cn("pl-5 space-y-1 leading-[1.5]", className)}
              style={{ listStyleType: "disc", listStylePosition: "outside" }}
              {...props}
            >
              {children}
            </ul>
          ),
          li: ({ node, className, children, ...props }) => (
            <li className={cn("leading-[1.5]", className)} {...props}>
              {children}
            </li>
          ),
          dl: ({ node, className, children, ...props }) => (
            <dl className={cn("space-y-2", className)} {...props}>
              {children}
            </dl>
          ),
          dt: ({ node, className, ...props }) => (
            <dt className={cn("font-semibold leading-[1.5]", className)} {...props} />
          ),
          dd: ({ node, className, ...props }) => (
            <dd className={cn("pl-4 leading-[1.5] text-[rgba(255,255,255,0.88)] dark:text-white", className)} {...props} />
          ),
          a: ({ node, className, ...props }) => (
            <a
              className={cn("underline decoration-from-font underline-offset-2 text-[var(--accent)]", className)}
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          code: ({
            inline,
            children,
            ...props
          }: { inline?: boolean; children?: ReactNode } & HTMLAttributes<HTMLElement>) =>
            inline ? (
              <code
                className="rounded bg-[rgba(0,0,0,0.08)] px-[4px] py-[2px] text-[0.95em] font-mono text-[var(--foreground)] dark:bg-white/15"
                {...props}
              >
                {children}
              </code>
            ) : (
              <CodeBlock {...props}>{children}</CodeBlock>
            ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[15px] leading-[1.5]" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="[&_th]:border [&_th]:border-[rgba(0,0,0,0.1)] [&_th]:px-3 [&_th]:py-2 dark:[&_th]:border-white/20 bg-[rgba(0,0,0,0.02)] dark:bg-white/5" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="[&_td]:border [&_td]:border-[rgba(0,0,0,0.1)] [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-white/15" {...props} />
          ),
          img: ({ node, alt, ...props }) => (
            <img
              className="max-w-full rounded-md border border-[rgba(0,0,0,0.06)] bg-white dark:border-white/10"
              loading="lazy"
              referrerPolicy="no-referrer"
              alt={typeof alt === "string" && alt.length > 0 ? alt : "markdown image"}
              {...props}
            />
          ),
          sup: ({ node, className, ...props }) => (
            <sup className={cn("align-super text-[0.85em]", className)} {...props} />
          ),
          sub: ({ node, className, ...props }) => (
            <sub className={cn("align-sub text-[0.85em]", className)} {...props} />
          ),
          u: ({ node, className, ...props }) => (
            <u className={cn("underline underline-offset-2", className)} {...props} />
          ),
          hr: ({ node, className, ...props }) => (
            <hr className={cn("my-3 border-t border-[rgba(255,255,255,0.3)] dark:border-white/40", className)} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
