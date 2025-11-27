"use client";

import { forwardRef, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/util";

interface ChatInputBarProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
  className?: string;
}

const ChatInputBar = forwardRef<HTMLInputElement, ChatInputBarProps>(
  (
    {
      value,
      placeholder = "Ask anything",
      disabled = false,
      isLoading = false,
      onChange,
      onSubmit,
      className,
    },
    ref
  ) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!disabled) {
          onSubmit();
        }
      }
    };

    return (
      <div
        className={cn(
          "relative flex items-center rounded-full border border-[rgba(60,60,67,0.18)] bg-white/90 px-3 py-3 pr-[52px] pe-[52px] shadow-[0px_1px_3px_rgba(15,17,21,0.05)] backdrop-blur-sm transition focus-within:shadow-[0px_2px_6px_rgba(15,17,21,0.08)] dark:border-white/10 dark:bg-white/5 min-h-[60px]",
          disabled && "opacity-80",
          className
        )}
      >
        <input
          ref={ref}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          aria-label={placeholder}
        />
        <div className="ie-3 absolute bottom-4 right-4 mt-auto flex justify-end">
          <button
            type="submit"
            onClick={() => {
              if (!disabled) onSubmit();
            }}
            aria-label="Send prompt to ChatGPT"
            disabled={disabled}
            className="relative flex h-9 w-9 items-center justify-center rounded-full p-0 transition-colors hover:opacity-70 disabled:hover:opacity-100 bg-[rgba(0,0,0,0.06)] text-[rgba(0,0,0,0.35)] dark:bg-white/15 dark:text-white/60 enabled:bg-primary-100 enabled:text-secondary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:focus-visible:ring-offset-0"
          >
            <span className="sr-only">Send prompt to ChatGPT</span>
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <svg
                width="36"
                height="36"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16 22L16 10M16 10L11 15M16 10L21 15"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }
);

ChatInputBar.displayName = "ChatInputBar";

export default ChatInputBar;
