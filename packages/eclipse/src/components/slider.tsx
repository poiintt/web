"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "../lib/cn";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    isErrored?: boolean;
  }
>(({ isErrored, className, ...props }, ref) => {
  const sliderValue = props.defaultValue ?? props.value ?? [0];
  const values = Array.isArray(sliderValue) ? sliderValue : [sliderValue];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center data-disabled:pointer-events-none",
        className as string,
      )}
      {...props}
    >
      <SliderPrimitive.Control className="flex w-full touch-none items-center py-2 select-none">
        <SliderPrimitive.Track className="relative h-1.5 w-full rounded-full bg-background-default select-none">
          <SliderPrimitive.Indicator
            className={cn(
              "absolute h-full rounded-full bg-background-ppg-reverse data-disabled:bg-background-neutral-strong transition-colors",
              isErrored && "bg-background-error-reverse",
            )}
          />
          {values.map((_, index) => (
            <SliderPrimitive.Thumb
              key={`thumb-${index}`}
              index={index}
              className="block h-4 w-4 rounded-full border data-disabled:border-stroke-neutral-weak border-stroke-neutral bg-background-default transition-colors cursor-grab active:cursor-grabbing"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = "Slider";

export { Slider };
