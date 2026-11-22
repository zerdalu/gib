import { Progress as BaseProgress } from "@base-ui/react/progress";
import { StatusVariants, type StatusVariant } from "@ui/variants";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type { StatusVariant };

const indicatorVariantClasses: Record<StatusVariant, string> = {
  default: "bg-accent-primary",
  success: "bg-status-success",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  info: "bg-status-info",
};

export interface ProgressProps extends ComponentProps<typeof BaseProgress.Root> {
  readonly label?: string;
  readonly showValue?: boolean;
  readonly variant?: StatusVariant;
}

export function Progress({
  className,
  label,
  showValue = false,
  variant = StatusVariants.Default,
  ...props
}: ProgressProps): ReactElement {
  return (
    <BaseProgress.Root className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
      {label || showValue ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <BaseProgress.Label className="font-sans text-xs font-ui text-text-secondary">{label}</BaseProgress.Label>
          ) : null}
          {showValue ? (
            <BaseProgress.Value className="font-mono text-xs font-ui tracking-mono text-text-primary tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <BaseProgress.Track className="h-progress-track w-full overflow-hidden rounded-track border border-border-subtle bg-surface-sunken">
        <BaseProgress.Indicator
          className={cn(
            "h-full rounded-track transition-progress duration-overlay ease-in-out motion-reduce:transition-none",
            "data-indeterminate:w-1/3 data-indeterminate:transition-none motion-safe:data-indeterminate:animate-progress-indeterminate motion-reduce:data-indeterminate:mx-auto",
            indicatorVariantClasses[variant],
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
