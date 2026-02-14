import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base layout
        "flex h-10 w-full rounded-md px-3 py-2 text-sm shadow-sm transition-colors",
        // Dark theme defaults (Cuckoo Block style)
        "bg-black/25 text-white placeholder:text-white/40",
        // White frame so fields are obvious
        "border border-white/35 hover:border-white/60",
        // Focus ring for clarity
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0",
        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/80",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
