import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CheckIcon, CircleIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type MenuProps = ComponentProps<typeof BaseMenu.Root>;

export function Menu(props: MenuProps): ReactElement {
  return <BaseMenu.Root {...props} />;
}

export type MenuTriggerProps = ComponentProps<typeof BaseMenu.Trigger>;

export function MenuTrigger(props: MenuTriggerProps): ReactElement {
  return <BaseMenu.Trigger {...props} />;
}

export interface MenuContentProps extends ComponentProps<typeof BaseMenu.Popup> {
  readonly sideOffset?: ComponentProps<typeof BaseMenu.Positioner>["sideOffset"];
  readonly side?: ComponentProps<typeof BaseMenu.Positioner>["side"];
  readonly align?: ComponentProps<typeof BaseMenu.Positioner>["align"];
  readonly collisionPadding?: ComponentProps<typeof BaseMenu.Positioner>["collisionPadding"];
}

export function MenuContent({
  className,
  sideOffset = 6,
  side = "bottom",
  align = "start",
  collisionPadding = 8,
  ...props
}: MenuContentProps): ReactElement {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        sideOffset={sideOffset}
        side={side}
        align={align}
        collisionPadding={collisionPadding}
        className="z-50 outline-none"
      >
        <BaseMenu.Popup
          className={cn(
            "max-h-(--available-height) max-w-(--available-width) min-w-44 overflow-y-auto border border-border-default bg-surface-200 p-1 text-text-primary shadow-floating backdrop-blur-floating outline-none",
            "origin-(--transform-origin) rounded-panel transition-popup duration-control ease-ui data-ending-style:duration-exit",
            "data-starting-style:scale-popup data-starting-style:opacity-0",
            "data-ending-style:scale-popup data-ending-style:opacity-0",
            className,
          )}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export interface MenuItemProps extends ComponentProps<typeof BaseMenu.Item> {
  readonly danger?: boolean;
}

export function MenuItem({ className, danger = false, ...props }: MenuItemProps): ReactElement {
  return (
    <BaseMenu.Item
      className={cn(
        "flex min-h-control-sm min-w-hit cursor-pointer items-center justify-between gap-2 rounded-control px-control-px-sm py-1.5 font-sans text-xs outline-none select-none",
        danger
          ? "text-status-danger-text data-highlighted:bg-status-danger-bg data-highlighted:text-status-danger-text"
          : "text-text-secondary data-highlighted:bg-surface-hover data-highlighted:text-text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    />
  );
}

export type MenuCheckboxItemProps = ComponentProps<typeof BaseMenu.CheckboxItem>;

export function MenuCheckboxItem({ className, children, ...props }: MenuCheckboxItemProps): ReactElement {
  return (
    <BaseMenu.CheckboxItem
      className={cn(
        "flex min-h-control-sm min-w-hit cursor-pointer items-center justify-between gap-2 rounded-control px-control-px-sm py-1.5 font-sans text-xs text-text-secondary outline-none select-none",
        "data-highlighted:bg-surface-hover data-highlighted:text-text-primary",
        "data-checked:font-ui data-checked:text-text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <BaseMenu.CheckboxItemIndicator className="inline-flex shrink-0 items-center text-accent-primary">
        <CheckIcon weight="bold" aria-hidden="true" className="size-4" />
      </BaseMenu.CheckboxItemIndicator>
    </BaseMenu.CheckboxItem>
  );
}

export type MenuRadioGroupProps = ComponentProps<typeof BaseMenu.RadioGroup>;

export function MenuRadioGroup(props: MenuRadioGroupProps): ReactElement {
  return <BaseMenu.RadioGroup {...props} />;
}

export type MenuRadioItemProps = ComponentProps<typeof BaseMenu.RadioItem>;

export function MenuRadioItem({ className, children, ...props }: MenuRadioItemProps): ReactElement {
  return (
    <BaseMenu.RadioItem
      className={cn(
        "flex min-h-control-sm min-w-hit cursor-pointer items-center justify-between gap-2 rounded-control px-control-px-sm py-1.5 font-sans text-xs text-text-secondary outline-none select-none",
        "data-highlighted:bg-surface-hover data-highlighted:text-text-primary",
        "data-checked:font-ui data-checked:text-text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <BaseMenu.RadioItemIndicator className="inline-flex shrink-0 items-center text-accent-primary">
        <CircleIcon weight="fill" aria-hidden="true" className="size-2.5" />
      </BaseMenu.RadioItemIndicator>
    </BaseMenu.RadioItem>
  );
}

export type MenuGroupProps = ComponentProps<typeof BaseMenu.Group>;

export function MenuGroup(props: MenuGroupProps): ReactElement {
  return <BaseMenu.Group {...props} />;
}

export type MenuGroupLabelProps = ComponentProps<typeof BaseMenu.GroupLabel>;

export function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps): ReactElement {
  return (
    <BaseMenu.GroupLabel
      className={cn("px-control-px-sm py-1 font-mono text-xs font-ui tracking-mono text-text-muted", className)}
      {...props}
    />
  );
}

export type MenuSeparatorProps = ComponentProps<typeof BaseMenu.Separator>;

export function MenuSeparator({ className, ...props }: MenuSeparatorProps): ReactElement {
  return <BaseMenu.Separator className={cn("my-1 h-px bg-border-subtle", className)} {...props} />;
}
