import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ value, className = "", ...props }: ProgressProps) {
  return (
    <div
      className={`progress bg-gray-200 h-2 w-full rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="progress-bar bg-blue-500 h-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
