import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type TooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>;

export function TooltipProvider({ delay = 400, ...props }: TooltipProviderProps): ReactElement {
  return <BaseTooltip.Provider delay={delay} {...props} />;
}

export type TooltipProps = ComponentProps<typeof BaseTooltip.Root>;

export function Tooltip(props: TooltipProps): ReactElement {
  return <BaseTooltip.Root {...props} />;
}

export type TooltipTriggerProps = ComponentProps<typeof BaseTooltip.Trigger>;

export function TooltipTrigger(props: TooltipTriggerProps): ReactElement {
  return <BaseTooltip.Trigger {...props} />;
}

export interface TooltipContentProps extends ComponentProps<typeof BaseTooltip.Popup> {
  readonly sideOffset?: ComponentProps<typeof BaseTooltip.Positioner>["sideOffset"];
  readonly side?: ComponentProps<typeof BaseTooltip.Positioner>["side"];
  readonly align?: ComponentProps<typeof BaseTooltip.Positioner>["align"];
  readonly collisionPadding?: ComponentProps<typeof BaseTooltip.Positioner>["collisionPadding"];
}

export function TooltipContent({
  className,
  sideOffset = 6,
  side = "top",
  align = "center",
  collisionPadding = 8,
  ...props
}: TooltipContentProps): ReactElement {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        sideOffset={sideOffset}
        side={side}
        align={align}
        collisionPadding={collisionPadding}
        className="z-50 outline-none"
      >
        <BaseTooltip.Popup
          className={cn(
            "max-w-(--available-width) border border-border-default bg-surface-200 px-control-px-sm py-1 font-mono text-xs text-text-primary shadow-floating backdrop-blur-floating select-none",
            "origin-(--transform-origin) rounded-control transition-popup duration-tooltip ease-ui data-ending-style:duration-exit",
            "data-starting-style:scale-tooltip data-starting-style:opacity-0",
            "data-ending-style:scale-tooltip data-ending-style:opacity-0",
            "data-instant:transition-none",
            className,
          )}
          {...props}
        />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
