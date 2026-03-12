"use client";
import { Collapsible as Primitive } from "@base-ui/react/collapsible";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";

const Collapsible = Primitive.Root;

const CollapsibleTrigger = Primitive.Trigger;

const CollapsibleContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Panel>
>(({ children, ...props }, ref) => {
  return (
    <Primitive.Panel
      ref={ref}
      {...props}
      className={(state) =>
        cn(
          "overflow-hidden border-t border-background-neutral-weak h-(--collapsible-panel-height) transition-[height] data-starting-style:h-0 data-ending-style:h-0",
          typeof props.className === "function"
            ? props.className(state)
            : props.className,
        )
      }
    >
      {children}
    </Primitive.Panel>
  );
});

CollapsibleContent.displayName = Primitive.Panel.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

export type CollapsibleProps = Primitive.Root.Props;
export type CollapsibleContentProps = Primitive.Panel.Props;
export type CollapsibleTriggerProps = Primitive.Trigger.Props;
