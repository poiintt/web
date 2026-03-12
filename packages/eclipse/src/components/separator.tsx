"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "../lib/cn";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive> & {
    decorative?: boolean;
  }
>(
  (
    { className, orientation = "horizontal", decorative: _decorative, ...props },
    ref,
  ) => (
    <SeparatorPrimitive
      ref={ref}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className as string,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.displayName;

export { Separator };
