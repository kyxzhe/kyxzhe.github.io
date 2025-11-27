"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSupersub from "remark-supersub";
import remarkDeflist from "remark-deflist";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/util";
import "katex/dist/katex.min.css";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

const MarkdownMessage = ({ content, className }: MarkdownMessageProps) => {
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
              <pre className="rounded-lg bg-[rgba(0,0,0,0.08)] px-4 py-3 overflow-x-auto text-[var(--foreground)] dark:bg-white/10">
                <code className="block text-[0.95em] leading-[1.6] font-mono text-inherit" {...props}>
                  {children}
                </code>
              </pre>
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
