import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type PopoverProps = ComponentProps<typeof BasePopover.Root>;

export function Popover(props: PopoverProps): ReactElement {
  return <BasePopover.Root {...props} />;
}

export type PopoverTriggerProps = ComponentProps<typeof BasePopover.Trigger>;

export function PopoverTrigger(props: PopoverTriggerProps): ReactElement {
  return <BasePopover.Trigger {...props} />;
}

export interface PopoverContentProps extends ComponentProps<typeof BasePopover.Popup> {
  readonly sideOffset?: ComponentProps<typeof BasePopover.Positioner>["sideOffset"];
  readonly side?: ComponentProps<typeof BasePopover.Positioner>["side"];
  readonly align?: ComponentProps<typeof BasePopover.Positioner>["align"];
  readonly collisionPadding?: ComponentProps<typeof BasePopover.Positioner>["collisionPadding"];
}

export function PopoverContent({
  className,
  sideOffset = 8,
  side = "bottom",
  align = "center",
  collisionPadding = 8,
  ...props
}: PopoverContentProps): ReactElement {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        sideOffset={sideOffset}
        side={side}
        align={align}
        collisionPadding={collisionPadding}
        className="z-50 outline-none"
      >
        <BasePopover.Popup
          className={cn(
            "max-h-(--available-height) w-72 max-w-(--available-width) overflow-y-auto border border-border-default bg-surface-200 p-panel-sm text-text-primary shadow-floating backdrop-blur-floating outline-none",
            "origin-(--transform-origin) rounded-panel transition-popup duration-control ease-ui data-ending-style:duration-exit",
            "data-starting-style:scale-popup data-starting-style:opacity-0",
            "data-ending-style:scale-popup data-ending-style:opacity-0",
            className,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export type PopoverTitleProps = ComponentProps<typeof BasePopover.Title>;

export function PopoverTitle({ className, ...props }: PopoverTitleProps): ReactElement {
  return (
    <BasePopover.Title
      className={cn("font-display text-sm font-heading tracking-heading text-text-primary", className)}
      {...props}
    />
  );
}

export type PopoverDescriptionProps = ComponentProps<typeof BasePopover.Description>;

export function PopoverDescription({ className, ...props }: PopoverDescriptionProps): ReactElement {
  return <BasePopover.Description className={cn("mt-1 font-sans text-xs text-text-secondary", className)} {...props} />;
}

export type PopoverCloseProps = ComponentProps<typeof BasePopover.Close>;

export function PopoverClose(props: PopoverCloseProps): ReactElement {
  return <BasePopover.Close {...props} />;
}
