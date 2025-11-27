"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
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
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => (
            <p className="whitespace-pre-line leading-[1.5]" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 space-y-1 leading-[1.5]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 space-y-1 leading-[1.5]" {...props} />
          ),
          li: ({ node, ...props }) => <li className="leading-[1.5]" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="underline decoration-from-font underline-offset-2 text-[var(--accent)]"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          code: ({ inline, ...props }) =>
            inline ? (
              <code
                className="rounded bg-[rgba(0,0,0,0.06)] px-[4px] py-[2px] text-[0.95em] dark:bg-white/15"
                {...props}
              />
            ) : (
              <code
                className="block rounded bg-[rgba(0,0,0,0.06)] px-3 py-2 text-[0.95em] dark:bg-white/10"
                {...props}
              />
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
