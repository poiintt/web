"use client";

import { Accordion as Primitive } from "@base-ui/react/accordion";
import { ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/cn";

type AccordionValue = string | string[];

type PrimitiveAccordionRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.Root>,
  "className" | "multiple" | "value" | "defaultValue" | "onValueChange"
>;

export interface AccordionProps extends PrimitiveAccordionRootProps {
  className?: string;
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: AccordionValue) => void;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      type = "single",
      collapsible: _collapsible,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) => (
    <Primitive.Root
      ref={ref}
      multiple={type === "multiple"}
      value={
        value === undefined
          ? undefined
          : Array.isArray(value)
            ? value
            : value
              ? [value]
              : []
      }
      defaultValue={
        defaultValue === undefined
          ? undefined
          : Array.isArray(defaultValue)
            ? defaultValue
            : defaultValue
              ? [defaultValue]
              : []
      }
      onValueChange={(nextValue) => {
        if (!onValueChange) return;
        onValueChange(type === "multiple" ? nextValue : (nextValue[0] ?? ""));
      }}
      className={cn(
        "divide-y divide-fd-border overflow-hidden rounded-lg border bg-fd-card",
        className,
      )}
      {...props}
    />
  ),
);
Accordion.displayName = "Accordion";

type PrimitiveAccordionItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.Item>,
  "className"
> & {
  className?: string;
};

export function AccordionItem({
  className,
  children,
  ...props
}: PrimitiveAccordionItemProps) {
  return (
    <Primitive.Item className={cn("scroll-m-24", className)} {...props}>
      {children}
    </Primitive.Item>
  );
}

type PrimitiveAccordionHeaderProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.Header>,
  "className"
> & {
  className?: string;
};

export function AccordionHeader({
  className,
  children,
  ...props
}: PrimitiveAccordionHeaderProps) {
  return (
    <Primitive.Header
      className={cn(
        "not-prose flex flex-row items-center text-foreground-neutral font-medium has-focus-visible:bg-fd-accent",
        className,
      )}
      {...props}
    >
      {children}
    </Primitive.Header>
  );
}

type PrimitiveAccordionTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.Trigger>,
  "className"
> & {
  className?: string;
};

export function AccordionTrigger({
  className,
  children,
  ...props
}: PrimitiveAccordionTriggerProps) {
  return (
    <Primitive.Trigger
      className={cn(
        "group flex flex-1 items-center gap-2 px-3 py-2.5 text-start focus-visible:outline-none cursor-pointer",
        className,
      )}
      {...props}
    >
      <ChevronRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-90" />
      {children}
    </Primitive.Trigger>
  );
}

type PrimitiveAccordionContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.Panel>,
  "className"
> & {
  className?: string;
};

export function AccordionContent({
  className,
  children,
  ...props
}: PrimitiveAccordionContentProps) {
  return (
    <Primitive.Panel
      className={cn(
        "overflow-hidden text-foreground-neutral-weak h-(--accordion-panel-height) transition-[height] data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      {children}
    </Primitive.Panel>
  );
}
