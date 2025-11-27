"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSupersub from "remark-supersub";
import remarkDeflist from "remark-deflist";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/util";
import "katex/dist/katex.min.css";

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
        <pre className="rounded-lg bg-[rgba(0,0,0,0.08)] px-4 py-3 overflow-x-auto text-[var(--foreground)] dark:bg-white/10">
          <code className={cn("block text-[0.95em] leading-[1.6] font-mono text-inherit", className)} {...props}>
            {children}
          </code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 inline-flex items-center gap-1 bg-transparent px-2 py-[6px] text-[12.5px] text-white/90 transition hover:opacity-80 dark:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <span aria-hidden="true">✓</span>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-white/80"
              >
                <path
                  fill="currentColor"
                  d="M12.668 10.667c0-.71 0-1.204-.031-1.587-.023-.282-.061-.472-.112-.615l-.056-.13a1.788 1.788 0 0 0-.675-.732l-.127-.071c-.158-.08-.37-.137-.745-.168-.384-.031-.877-.031-1.588-.031H6.5c-.711 0-1.204 0-1.587.032-.282.022-.472.06-.615.11l-.13.056a1.79 1.79 0 0 0-.732.675l-.07.127c-.081.158-.138.37-.168.745-.032.384-.032.877-.032 1.588v2.833c0 .711 0 1.204.032 1.588.03.375.087.586.168.744l.07.127c.176.288.43.522.732.676l.13.056c.143.051.333.088.615.11.383.032.876.033 1.587.033h2.833c.71 0 1.204 0 1.587-.033.376-.03.587-.087.745-.168l.127-.07c.288-.176.522-.43.676-.732l.055-.13c.052-.143.09-.333.113-.615.031-.383.031-.876.031-1.587v-2.833Zm1.33 2c.455-.002.803-.005 1.09-.028.375-.031.587-.088.745-.168l.126-.07c.288-.176.522-.429.676-.732l.057-.13c.052-.143.088-.332.111-.615.032-.383.033-.876.033-1.587V6.5c0-.7110-1.205.032-1.588.03-.375.032-.587.089-.745.169l-.126.07a1.788 1.788 0 0 0-.676.732l-.056.127c-.08.159-.137.37-.168.745-.032.383-.033.877-.033 1.588v1.998Zm-13-3.334c0 .689 0 1.246.037 1.696.037.45.116.856.308 1.233l.122.218c.304.495.741.899 1.262 1.165l.142.072c.335.145.696.21 1.097.243.45.037 1.008.037 1.697.037H9.333c.69 0 1.247 0 1.697-.037.4-.033.762-.098 1.097-.243l.142-.072c.52-.266.957-.67 1.261-1.165l.122-.218c.192-.377.271-.783.308-1.233.037-.45.037-1.007.037-1.696v-2.833c0-.69 0-1.247-.037-1.697-.037-.449-.116-.855-.308-1.232l-.122-.218a2.854 2.854 0 0 0-1.261-1.165l-.142-.072c-.335-.145-.697-.21-1.097-.243C10.58 2.334 10.022 2.333 9.333 2.333H6.5c-.69 0-1.247 0-1.697.037-.4.033-.762.098-1.097.243l-.142.072a2.854 2.854 0 0 0-1.262 1.165l-.122.218c-.192.377-.271.783-.308 1.233C1.834 6.42 1.834 6.977 1.834 7.667v2.833Z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
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
