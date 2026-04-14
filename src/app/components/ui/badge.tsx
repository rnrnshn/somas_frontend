import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius)] border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[--ring] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        success: "border-transparent text-[--success-foreground]",
        warning: "border-transparent text-[--warning-foreground]",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        active: "border-transparent bg-[--success] text-[--success-foreground]",
        locked: "border-transparent bg-[--warning] text-[--warning-foreground]",
        disabled: "border-transparent bg-[--muted] text-[--muted-foreground]",
        pending: "border-transparent bg-[--accent] text-[--accent-foreground]"}},
    defaultVariants: {
      variant: "default"}}
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)}
      {...props} 
    />
  );
}

export { Badge, badgeVariants };