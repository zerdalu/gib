import { Input as BaseInput } from "@base-ui/react/input";
import { InputSizes, type InputSize } from "@ui/variants";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type { InputSize };

const sizeClasses: Record<InputSize, string> = {
  xs: "h-control-xs px-control-px-xs text-xs",
  sm: "h-control-sm px-control-px-sm text-xs",
  md: "h-control-md px-control-px-md text-sm",
  lg: "h-control-lg px-control-px-lg text-sm",
};

export interface InputProps extends Omit<ComponentProps<typeof BaseInput>, "size"> {
  readonly size?: InputSize;
}

export function Input({ size = InputSizes.Md, className, ...props }: InputProps): ReactElement {
  return (
    <BaseInput
      className={cn(
        "min-h-hit w-full min-w-hit border border-border-default bg-surface-sunken font-sans text-text-primary shadow-control",
        "rounded-control transition-colors duration-control ease-ui",
        "placeholder:text-text-muted",
        "hover:border-border-strong",
        "focus-ring-tight focus-visible:border-border-focus",
        "data-invalid:border-status-danger data-invalid:focus-visible:outline-status-danger",
        "disabled:pointer-events-none disabled:opacity-disabled data-disabled:pointer-events-none data-disabled:opacity-disabled",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
