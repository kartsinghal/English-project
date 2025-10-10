import React from "react";
import { cn } from "@/lib/utils"; // ✅ Tailwind merge helper (make sure it's correct)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"; // ✅ added destructive
  size?: "default" | "icon" | "sm" | "lg";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500", // ✅ added this
  };

  const sizes: Record<string, string> = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1 text-sm",
    lg: "px-5 py-3 text-base",
    icon: "p-2 w-10 h-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
