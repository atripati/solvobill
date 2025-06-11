import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition";
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100"
    };
    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], className)} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button };
