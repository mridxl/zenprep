import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-base border-2 border-border bg-clip-padding font-base whitespace-nowrap shadow-shadow transition-all outline-none select-none hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:translate-x-0 active:translate-y-0 active:scale-[0.98] active:shadow-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-main text-main-foreground",
        neutral: "bg-secondary-background text-foreground",
        outline:
          "border-border bg-secondary-background text-foreground hover:bg-background",
        ghost:
          "border-transparent bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-secondary-background hover:shadow-none",
        destructive:
          "border-chart-3 bg-chart-3/20 text-foreground hover:bg-chart-3/30",
        link: "border-transparent bg-transparent text-foreground underline-offset-4 shadow-none hover:translate-x-0 hover:translate-y-0 hover:underline hover:shadow-none",
      },
      size: {
        default: "h-10 gap-2 px-4 text-sm",
        xs: "h-7 gap-1 rounded-base px-2 text-xs",
        sm: "h-8 gap-1.5 rounded-base px-3 text-sm",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
