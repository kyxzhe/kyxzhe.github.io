"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSupersub from "remark-supersub";
import remarkDeflist from "remark-deflist";
import rehypeKatex from "rehype-katex";
import { lazy, Suspense, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/util";
import "katex/dist/katex.min.css";

const MarkdownCodeBlock = lazy(() => import("@/components/MarkdownCodeBlock"));

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

function PlainCodeBlock({
  children,
  className,
  ...props
}: { children?: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
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

function CodeBlock({
  children,
  className,
  ...props
}: { children?: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  const language =
    (className?.match(/language-([\w-]+)/)?.[1] as string | undefined) || undefined;

  if (!language) {
    return (
      <PlainCodeBlock className={className} {...props}>
        {children}
      </PlainCodeBlock>
    );
  }

  return (
    <Suspense
      fallback={
        <PlainCodeBlock className={className} {...props}>
          {children}
        </PlainCodeBlock>
      }
    >
      <MarkdownCodeBlock className={className} {...props}>
        {children}
      </MarkdownCodeBlock>
    </Suspense>
  );
}

const MarkdownMessage = ({ content, className }: MarkdownMessageProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkDeflist, remarkSupersub]}
        rehypePlugins={[rehypeKatex]}
        skipHtml
        components={{
          h1: ({ className, ...props }) => (
            <h2 className={cn("text-[22px] font-semibold leading-[1.35] mt-2 mb-3", className)} {...props} />
          ),
          h2: ({ className, ...props }) => (
            <h3 className={cn("text-[20px] font-semibold leading-[1.35] mt-2 mb-3", className)} {...props} />
          ),
          h3: ({ className, ...props }) => (
            <h4 className={cn("text-[18px] font-semibold leading-[1.35] mt-2 mb-2", className)} {...props} />
          ),
          h4: ({ className, ...props }) => (
            <h5 className={cn("text-[16px] font-semibold leading-[1.35] mt-2 mb-2", className)} {...props} />
          ),
          h5: ({ className, ...props }) => (
            <h6 className={cn("text-[15px] font-semibold leading-[1.35] mt-2 mb-2", className)} {...props} />
          ),
          h6: ({ className, ...props }) => (
            <p className={cn("text-[14px] font-semibold leading-[1.35] mt-2 mb-2", className)} {...props} />
          ),
          p: ({ className, ...props }) => (
            <p className={cn("whitespace-pre-line leading-[1.5]", className)} {...props} />
          ),
          ol: ({ className, children, ...props }) => (
            <ol
              className={cn("pl-5 space-y-1 leading-[1.5]", className)}
              style={{ listStyleType: "decimal", listStylePosition: "outside" }}
              {...props}
            >
              {children}
            </ol>
          ),
          ul: ({ className, children, ...props }) => (
            <ul
              className={cn("pl-5 space-y-1 leading-[1.5]", className)}
              style={{ listStyleType: "disc", listStylePosition: "outside" }}
              {...props}
            >
              {children}
            </ul>
          ),
          li: ({ className, children, ...props }) => (
            <li className={cn("leading-[1.5]", className)} {...props}>
              {children}
            </li>
          ),
          dl: ({ className, children, ...props }) => (
            <dl className={cn("space-y-2", className)} {...props}>
              {children}
            </dl>
          ),
          dt: ({ className, ...props }) => (
            <dt className={cn("font-semibold leading-[1.5]", className)} {...props} />
          ),
          dd: ({ className, ...props }) => (
            <dd className={cn("pl-4 leading-[1.5] text-foreground/80 dark:text-white/88", className)} {...props} />
          ),
          a: ({ className, ...props }) => (
            <a
              {...props}
              className={cn("underline decoration-from-font underline-offset-2 text-[var(--accent)]", className)}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
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
          table: ({ ...props }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[15px] leading-[1.5]" {...props} />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="[&_th]:border [&_th]:border-[rgba(0,0,0,0.1)] [&_th]:px-3 [&_th]:py-2 dark:[&_th]:border-white/20 bg-[rgba(0,0,0,0.02)] dark:bg-white/5" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="[&_td]:border [&_td]:border-[rgba(0,0,0,0.1)] [&_td]:px-3 [&_td]:py-2 dark:[&_td]:border-white/15" {...props} />
          ),
          img: ({ alt, ...props }) => (
            // Markdown images can be arbitrary external URLs without known dimensions.
            // Using a native img here avoids broken rendering for user-provided content.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="max-w-full rounded-md border border-[rgba(0,0,0,0.06)] bg-white dark:border-white/10"
              decoding="async"
              loading="lazy"
              referrerPolicy="no-referrer"
              alt={typeof alt === "string" && alt.length > 0 ? alt : "markdown image"}
              {...props}
            />
          ),
          sup: ({ className, ...props }) => (
            <sup className={cn("align-super text-[0.85em]", className)} {...props} />
          ),
          sub: ({ className, ...props }) => (
            <sub className={cn("align-sub text-[0.85em]", className)} {...props} />
          ),
          u: ({ className, ...props }) => (
            <u className={cn("underline underline-offset-2", className)} {...props} />
          ),
          hr: ({ className, ...props }) => (
            <hr className={cn("my-3 border-t border-[rgba(0,0,0,0.18)] dark:border-white/40", className)} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
