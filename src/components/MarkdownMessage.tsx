"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/util";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

const MarkdownMessage = ({ content, className }: MarkdownMessageProps) => {
  return (
    <ReactMarkdown
      className={cn("space-y-2", className)}
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => (
          <p className="whitespace-pre-line leading-[1.5]" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-4 space-y-1 leading-[1.5]" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-4 space-y-1 leading-[1.5]" {...props} />
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
  );
};

export default MarkdownMessage;
