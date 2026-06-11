"use client";

import { useEffect, useRef, useState, type ComponentType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/util";

type SyntaxHighlighterComponent = ComponentType<{
  children: string;
  language?: string;
  style: Record<string, unknown>;
  PreTag: "div";
  customStyle: Record<string, string | number>;
  codeTagProps: {
    className: string;
  };
  wrapLongLines: boolean;
}> & {
  registerLanguage: (name: string, grammar: unknown) => void;
};

interface SyntaxBundle {
  SyntaxHighlighter: SyntaxHighlighterComponent;
  oneDark: Record<string, unknown>;
}

type DefaultExportModule = {
  default: unknown;
};

let syntaxBundlePromise: Promise<SyntaxBundle> | null = null;

const highlightedLanguages = new Set([
  "jsx",
  "tsx",
  "ts",
  "typescript",
  "javascript",
  "js",
  "py",
  "python",
  "bash",
  "shell",
  "json",
  "markdown",
  "sql",
]);

interface MarkdownCodeBlockProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

function loadSyntaxBundle() {
  syntaxBundlePromise ??= Promise.all([
    import("react-syntax-highlighter/dist/esm/prism-light"),
    import("react-syntax-highlighter/dist/esm/languages/prism/jsx"),
    import("react-syntax-highlighter/dist/esm/languages/prism/tsx"),
    import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
    import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
    import("react-syntax-highlighter/dist/esm/languages/prism/python"),
    import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
    import("react-syntax-highlighter/dist/esm/languages/prism/json"),
    import("react-syntax-highlighter/dist/esm/languages/prism/markdown"),
    import("react-syntax-highlighter/dist/esm/languages/prism/sql"),
    import("react-syntax-highlighter/dist/esm/styles/prism/one-dark"),
  ])
    .then(([
      highlighterModule,
      jsxModule,
      tsxModule,
      typescriptModule,
      javascriptModule,
      pythonModule,
      bashModule,
      jsonModule,
      markdownModule,
      sqlModule,
      oneDarkModule,
    ]) => {
      const SyntaxHighlighter = (highlighterModule as DefaultExportModule).default as SyntaxHighlighterComponent;

      SyntaxHighlighter.registerLanguage("jsx", (jsxModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("tsx", (tsxModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("ts", (typescriptModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("typescript", (typescriptModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("javascript", (javascriptModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("js", (javascriptModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("py", (pythonModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("python", (pythonModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("bash", (bashModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("shell", (bashModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("json", (jsonModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("markdown", (markdownModule as DefaultExportModule).default);
      SyntaxHighlighter.registerLanguage("sql", (sqlModule as DefaultExportModule).default);

      return {
        SyntaxHighlighter,
        oneDark: (oneDarkModule as DefaultExportModule).default as Record<string, unknown>,
      };
    })
    .catch((error: unknown) => {
      syntaxBundlePromise = null;
      throw error;
    });

  return syntaxBundlePromise;
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
  const [syntaxBundle, setSyntaxBundle] = useState<SyntaxBundle | null>(null);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = getCodeText(children);
  const language =
    (className?.match(/language-([\w-]+)/)?.[1] as string | undefined) || undefined;
  const normalizedLanguage = language?.toLowerCase();
  const canHighlight = normalizedLanguage ? highlightedLanguages.has(normalizedLanguage) : false;
  const LazySyntaxHighlighter = syntaxBundle?.SyntaxHighlighter ?? null;
  const syntaxStyle = syntaxBundle?.oneDark ?? null;
  const codeBackground = "var(--pill-background)";
  const codeLabel = normalizedLanguage ?? "text";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
      copyResetTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyResetTimerRef.current = null;
      }, 1400);
    } catch {
      // ignore clipboard errors
    }
  };

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!canHighlight) {
      return;
    }

    let isMounted = true;

    loadSyntaxBundle()
      .then((bundle) => {
        if (isMounted) {
          setSyntaxBundle(bundle);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSyntaxBundle(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [canHighlight]);

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
          className="inline-flex min-h-8 items-center gap-1 rounded-full bg-transparent px-2 text-[12px] text-[rgb(93,93,93)] transition hover:opacity-80 dark:text-[rgb(243,243,243)]"
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? (
            <>
              <span aria-hidden="true">✓</span>
              <span aria-live="polite">Copied</span>
            </>
          ) : (
            <span aria-live="polite">Copy</span>
          )}
        </button>
      </div>
      <div className="max-h-[420px] overflow-auto">
        {canHighlight && LazySyntaxHighlighter && syntaxStyle ? (
          <LazySyntaxHighlighter
            language={normalizedLanguage}
            style={syntaxStyle}
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
          </LazySyntaxHighlighter>
        ) : (
          <pre className="overflow-x-auto px-4 py-3 text-[var(--foreground)]" style={{ background: codeBackground }}>
            <code className="block text-[0.95em] leading-[1.6] font-mono text-inherit">
              {text}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
