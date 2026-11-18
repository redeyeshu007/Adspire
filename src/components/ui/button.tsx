import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "default" &&
            "bg-[#EE4530] text-white hover:bg-[#FF5542] shadow-[0_0_20px_rgba(238,69,48,0.35)]",
          variant === "outline" &&
            "border border-white/20 bg-transparent hover:bg-white/10 text-white",
          variant === "ghost" && "hover:bg-white/10 text-white",
          size === "sm" && "h-9 px-3 text-xs",
          size === "default" && "h-10 px-4 py-2",
          size === "lg" && "h-11 px-8 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
