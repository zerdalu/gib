import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type SwitchProps = ComponentProps<typeof BaseSwitch.Root>;

export function Switch({ className, ...props }: SwitchProps): ReactElement {
  return (
    <BaseSwitch.Root
      className={cn(
        "relative inline-flex size-switch min-h-hit min-w-hit shrink-0 cursor-pointer items-center border border-border-default bg-surface-sunken shadow-control",
        "rounded-track transition-control duration-control ease-ui",
        "hover:border-border-strong active:scale-press",
        "focus-ring",
        "data-checked:border-accent-primary data-checked:bg-accent-primary",
        "data-invalid:border-status-danger data-invalid:focus-visible:outline-status-danger",
        "disabled:pointer-events-none disabled:opacity-disabled data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          "pointer-events-none block size-switch-thumb rounded-track bg-text-secondary shadow-control",
          "transition-switch-thumb duration-control ease-toggle motion-reduce:transition-colors",
          "translate-x-0 data-checked:translate-x-(--switch-travel) data-checked:bg-text-on-accent",
        )}
      />
    </BaseSwitch.Root>
  );
}
