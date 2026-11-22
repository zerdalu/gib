import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type CheckboxProps = ComponentProps<typeof BaseCheckbox.Root>;

export function Checkbox({ className, indeterminate, ...props }: CheckboxProps): ReactElement {
  return (
    <BaseCheckbox.Root
      indeterminate={indeterminate}
      className={cn(
        "hit-target relative inline-flex size-checkbox shrink-0 cursor-pointer items-center justify-center border border-border-default bg-surface-sunken text-text-on-accent shadow-control",
        "rounded-toggle transition-control duration-control ease-ui",
        "hover:border-border-strong active:scale-press-sm",
        "focus-ring",
        "data-checked:border-accent-primary data-checked:bg-accent-primary data-checked:hover:bg-accent-primary-hover",
        "data-indeterminate:border-accent-primary data-indeterminate:bg-accent-primary data-indeterminate:hover:bg-accent-primary-hover",
        "data-invalid:border-status-danger data-invalid:focus-visible:outline-status-danger",
        "disabled:pointer-events-none disabled:opacity-disabled data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator className="flex items-center justify-center text-current data-unchecked:hidden">
        {indeterminate ? (
          <MinusIcon weight="bold" aria-hidden="true" className="size-3.5" />
        ) : (
          <CheckIcon weight="bold" aria-hidden="true" className="size-3.5" />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
