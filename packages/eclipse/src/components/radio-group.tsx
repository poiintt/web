"use client";

import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Circle } from "lucide-react";

import { cn } from "../lib/cn";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      className={cn("grid gap-2", className as string)}
      {...props}
    />
  );
}
RadioGroup.displayName = "RadioGroup";

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      className={cn(
        "group aspect-square h-4 w-4 rounded-circle border border-stroke-neutral text-background-default bg-background-default outline-none disabled:border-stroke-neutral-weak disabled:bg-background-neutral-weak disabled:text-background-neutral-weak disabled:cursor-not-allowed disabled:opacity-50",
        className as string,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-foreground-neutral group-disabled:fill-foreground-neutral-weaker outline-none stroke-4" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
