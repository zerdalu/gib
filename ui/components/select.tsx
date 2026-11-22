import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type SelectProps<Value = unknown, Multiple extends boolean | undefined = false> = BaseSelect.Root.Props<
  Value,
  Multiple
>;

export function Select<Value, Multiple extends boolean | undefined = false>(
  props: SelectProps<Value, Multiple>,
): ReactElement {
  return <BaseSelect.Root {...props} />;
}

export type SelectTriggerProps = ComponentProps<typeof BaseSelect.Trigger>;

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps): ReactElement {
  return (
    <BaseSelect.Trigger
      className={cn(
        "inline-flex h-control-md min-h-hit w-full min-w-36 cursor-pointer items-center justify-between gap-2 border border-border-default bg-surface-sunken px-control-px-md font-sans text-sm text-text-primary shadow-control select-none",
        "rounded-control transition-colors duration-control ease-ui",
        "hover:border-border-strong data-popup-open:border-border-strong",
        "focus-ring-tight focus-visible:border-border-focus",
        "data-invalid:border-status-danger data-invalid:focus-visible:outline-status-danger",
        "disabled:pointer-events-none disabled:opacity-disabled data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className="flex shrink-0 items-center text-text-muted">
        <CaretUpDownIcon aria-hidden="true" className="size-4.5" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export type SelectValueProps = ComponentProps<typeof BaseSelect.Value>;

export function SelectValue({ className, ...props }: SelectValueProps): ReactElement {
  return (
    <BaseSelect.Value className={cn("truncate text-left data-placeholder:text-text-muted", className)} {...props} />
  );
}

export interface SelectContentProps extends ComponentProps<typeof BaseSelect.Popup> {
  readonly sideOffset?: ComponentProps<typeof BaseSelect.Positioner>["sideOffset"];
  readonly alignItemWithTrigger?: ComponentProps<typeof BaseSelect.Positioner>["alignItemWithTrigger"];
  readonly collisionPadding?: ComponentProps<typeof BaseSelect.Positioner>["collisionPadding"];
}

export function SelectContent({
  className,
  children,
  sideOffset = 6,
  alignItemWithTrigger = false,
  collisionPadding = 8,
  ...props
}: SelectContentProps): ReactElement {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={sideOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        collisionPadding={collisionPadding}
        className="z-50 outline-none"
      >
        <BaseSelect.Popup
          className={cn(
            "flex max-h-(--available-height) max-w-(--available-width) min-w-(--anchor-width) flex-col overflow-hidden border border-border-default bg-surface-200 p-1 text-text-primary shadow-floating backdrop-blur-floating",
            "origin-(--transform-origin) rounded-panel transition-popup duration-control ease-ui data-ending-style:duration-exit",
            "data-starting-style:scale-popup data-starting-style:opacity-0",
            "data-ending-style:scale-popup data-ending-style:opacity-0",
            className,
          )}
          {...props}
        >
          <BaseSelect.List className="max-h-72 min-h-0 flex-1 overflow-y-auto outline-none">{children}</BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export type SelectItemProps = ComponentProps<typeof BaseSelect.Item>;

export function SelectItem({ className, children, ...props }: SelectItemProps): ReactElement {
  return (
    <BaseSelect.Item
      className={cn(
        "relative flex min-h-control-sm min-w-hit cursor-pointer items-center justify-between gap-2 rounded-control px-control-px-sm py-1.5 font-sans text-xs text-text-secondary outline-none select-none",
        "data-highlighted:bg-surface-hover data-highlighted:text-text-primary",
        "data-selected:font-ui data-selected:text-text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="inline-flex shrink-0 items-center text-accent-primary">
        <CheckIcon weight="bold" aria-hidden="true" className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export type SelectGroupProps = ComponentProps<typeof BaseSelect.Group>;

export function SelectGroup(props: SelectGroupProps): ReactElement {
  return <BaseSelect.Group {...props} />;
}

export type SelectGroupLabelProps = ComponentProps<typeof BaseSelect.GroupLabel>;

export function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps): ReactElement {
  return (
    <BaseSelect.GroupLabel
      className={cn("px-control-px-sm py-1 font-mono text-xs font-ui tracking-mono text-text-muted", className)}
      {...props}
    />
  );
}

export type SelectSeparatorProps = ComponentProps<typeof BaseSelect.Separator>;

export function SelectSeparator({ className, ...props }: SelectSeparatorProps): ReactElement {
  return <BaseSelect.Separator className={cn("my-1 h-px bg-border-subtle", className)} {...props} />;
}
