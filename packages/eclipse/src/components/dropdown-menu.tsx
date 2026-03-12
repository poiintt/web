"use client";

import * as React from "react";
import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "../lib/cn";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> & {
    asChild?: boolean;
  }
>(({ asChild = false, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref as React.Ref<HTMLButtonElement>}
    render={
      asChild && React.isValidElement(children)
        ? (children as React.ReactElement)
        : undefined
    }
    {...props}
  >
    {asChild ? undefined : children}
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.SubmenuRoot;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubmenuTrigger
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-background-neutral data-[state=open]:bg-accent data-open:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className as string,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubmenuTrigger>
  );
}
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: DropdownMenuPrimitive.Popup.Props &
  Pick<
    DropdownMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
        className="fixed z-9999 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <DropdownMenuPrimitive.Popup
      className={cn(
        "z-50 max-h-(--available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--transform-origin)",
        className as string,
      )}
      {...props}
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuContent.displayName = "DropdownMenuContent";

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      className={cn(
        "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className as string,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

function DropdownMenuItem({
  className,
  inset,
  ...props
}: DropdownMenuPrimitive.Item.Props & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 last:mb-0 mb-1 py-1.5 text-sm outline-none transition-colors focus:bg-background-neutral data-[state=checked]:bg-background-neutral data-[state=checked]:font-medium data-checked:bg-background-neutral data-checked:font-medium focus:text-foreground-neutral data-[disabled]:pointer-events-none data-[disabled]:text-foreground-neutral-weaker [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className as string,
    )}
    {...props}
  />
  );
}
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: DropdownMenuPrimitive.CheckboxItem.Props) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm last:mb-0 mb-1 py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-background-neutral data-[state=checked]:bg-background-neutral data-[state=checked]:font-medium data-checked:bg-background-neutral data-checked:font-medium focus:text-foreground-neutral data-[disabled]:pointer-events-none data-[disabled]:text-foreground-neutral-weaker",
      className as string,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.CheckboxItemIndicator>
        <Check className="h-4 w-4 opacity-40" />
      </DropdownMenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
  );
}
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuPrimitive.RadioItem.Props) {
  return (
    <DropdownMenuPrimitive.RadioItem
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 last:mb-0 mb-1 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-background-neutral data-[state=checked]:bg-background-neutral data-[state=checked]:font-medium data-checked:bg-background-neutral data-checked:font-medium focus:text-foreground-neutral data-[disabled]:pointer-events-none data-[disabled]:text-foreground-neutral-weaker",
      className as string,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.RadioItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
  );
}
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.GroupLabel
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className as string,
    )}
    {...props}
  />
  );
}
DropdownMenuLabel.displayName = "DropdownMenuLabel";

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuPrimitive.Separator.Props) {
  return (
    <DropdownMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-muted", className as string)}
    {...props}
  />
  );
}
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
