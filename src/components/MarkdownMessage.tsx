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
          h1: ({ node, ...props }) => (
            <h1 className="text-[22px] font-semibold leading-[1.35] mt-2 mb-3" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-[20px] font-semibold leading-[1.35] mt-2 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-[18px] font-semibold leading-[1.35] mt-2 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-[16px] font-semibold leading-[1.35] mt-2 mb-2" {...props} />
          ),
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
                className="rounded bg-[rgba(0,0,0,0.06)] px-[4px] py-[2px] text-[0.95em] font-mono dark:bg-white/15"
                {...props}
              />
            ) : (
              <pre className="rounded bg-[rgba(0,0,0,0.06)] px-3 py-2 overflow-x-auto dark:bg-white/10">
                <code className="text-[0.95em] leading-[1.6] font-mono" {...props} />
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
