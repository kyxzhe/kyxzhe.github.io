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
          "flex items-center gap-2 rounded-full border border-[rgba(60,60,67,0.18)] bg-white/90 px-3 py-2 shadow-[0px_1px_3px_rgba(15,17,21,0.05)] backdrop-blur-sm transition focus-within:shadow-[0px_2px_6px_rgba(15,17,21,0.08)] dark:border-white/10 dark:bg-white/5",
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
          className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          aria-label={placeholder}
        />
        <button
          type="submit"
          onClick={() => {
            if (!disabled) onSubmit();
          }}
          aria-label="Send prompt to ChatGPT"
          disabled={disabled}
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-secondary-100 p-0 transition-colors hover:opacity-70 disabled:bg-primary-4 disabled:text-primary-44 disabled:hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:focus-visible:ring-offset-0"
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
    );
  }
);

ChatInputBar.displayName = "ChatInputBar";

export default ChatInputBar;
