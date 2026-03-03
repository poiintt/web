"use client";

import * as React from "react";

import { cn } from "../lib/cn";
import { Badge } from "./badge";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount = false, maxLength, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          data-slot="textarea"
          className={cn(
            "border border-stroke-neutral bg-background-default text-foreground-neutral-weak disabled:cursor-not-allowed disabled:text-foreground-neutral-weaker disabled:bg-background-neutral-weak disabled:stroke-neutral-weak focus-visible:text-foreground-neutral aria-invalid:border-stroke-error aria-invalid:text-foreground-error rounded-square p-2 text-sm transition-colors flex field-sizing-content min-h-16 w-full outline-none",
            showCharCount && maxLength && "pb-8",
            className,
          )}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {showCharCount && maxLength && (
          <Badge
            color="neutral"
            className="absolute bottom-1 right-1 text-foreground-neutral font-mono"
            label={`${charCount}/${maxLength}`}
          ></Badge>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
