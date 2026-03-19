import * as React from "react";
import { cn } from "~/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground/60 resize-y min-h-[80px]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
