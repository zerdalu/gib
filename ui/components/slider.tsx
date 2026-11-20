import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "cn";
import { useId, type ComponentProps, type ReactElement } from "react";

export interface SliderProps extends ComponentProps<typeof BaseSlider.Root> {
  readonly label?: string;
  readonly showValue?: boolean;
}

function isReadonlyNumberArray(value: SliderProps["value"]): value is readonly number[] {
  return Array.isArray(value);
}

function resolveThumbCount(value: SliderProps["value"], defaultValue: SliderProps["defaultValue"]): number {
  if (isReadonlyNumberArray(value)) {
    return Math.max(1, value.length);
  }
  if (isReadonlyNumberArray(defaultValue)) {
    return Math.max(1, defaultValue.length);
  }
  return 1;
}

export function Slider({ className, label, showValue = false, ...props }: SliderProps): ReactElement {
  const labelId = useId();
  const resolvedAriaLabelledBy = props["aria-labelledby"] ?? (label && !props["aria-label"] ? labelId : undefined);
  const thumbCount = resolveThumbCount(props.value, props.defaultValue);

  return (
    <BaseSlider.Root
      {...props}
      aria-labelledby={resolvedAriaLabelledBy}
      className={cn("flex w-full flex-col gap-2 select-none", className)}
    >
      {label || showValue ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <span id={labelId} className="font-sans text-xs font-ui text-text-secondary">
              {label}
            </span>
          ) : null}
          {showValue ? (
            <BaseSlider.Value className="font-mono text-xs font-ui tracking-mono text-text-primary tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <BaseSlider.Control className="relative flex min-h-6 w-full cursor-pointer touch-none items-center py-1 data-disabled:pointer-events-none data-disabled:opacity-45">
        <BaseSlider.Track className="relative h-2 w-full overflow-hidden rounded-track border border-border-subtle bg-surface-sunken">
          <BaseSlider.Indicator className="rounded-track bg-accent-primary" />
        </BaseSlider.Track>
        {Array.from({ length: thumbCount }, (_, thumbIndex) => (
          <BaseSlider.Thumb
            key={thumbIndex}
            index={thumbCount > 1 ? thumbIndex : undefined}
            className={cn(
              "size-4.5 cursor-grab rounded-track border-2 border-accent-primary bg-surface-100 shadow-control",
              "transition-transform duration-100 ease-ui",
              "hover:scale-105 active:cursor-grabbing",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
            )}
          />
        ))}
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
