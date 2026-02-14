import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Base layout
        "flex min-h-[96px] w-full rounded-md px-3 py-2 text-sm shadow-sm transition-colors",
        // Dark theme defaults
        "bg-black/25 text-white placeholder:text-white/40",
        // White frame
        "border border-white/35 hover:border-white/60",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
