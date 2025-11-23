"use client";

import { forwardRef, type KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
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
          className="flex-1 bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          aria-label={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            if (!disabled) onSubmit();
          }}
          aria-label="Send message"
          disabled={disabled}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-[var(--accent-soft)] disabled:text-white/70 dark:focus-visible:ring-offset-0"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowUp size={16} />
          )}
        </button>
      </div>
    );
  }
);

ChatInputBar.displayName = "ChatInputBar";

export default ChatInputBar;
