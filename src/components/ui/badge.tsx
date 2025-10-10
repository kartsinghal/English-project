import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Badge component — used for small highlighted labels
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-200 text-gray-800",
      secondary: "bg-purple-100 text-purple-700",
      outline: "border border-gray-300 text-gray-700",
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
          variantClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
