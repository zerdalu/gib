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
      <BaseSlider.Control className="relative flex min-h-hit w-full cursor-pointer touch-none items-center py-1 data-disabled:pointer-events-none data-disabled:opacity-disabled">
        <BaseSlider.Track className="relative h-slider-track w-full overflow-hidden rounded-track border border-border-subtle bg-surface-sunken">
          <BaseSlider.Indicator className="rounded-track bg-accent-primary data-invalid:bg-status-danger" />
        </BaseSlider.Track>
        {Array.from({ length: thumbCount }, (_, thumbIndex) => (
          <BaseSlider.Thumb
            key={thumbIndex}
            index={thumbCount > 1 ? thumbIndex : undefined}
            className={cn(
              "hit-target size-slider-thumb cursor-grab rounded-track border-2 border-accent-primary bg-surface-100 shadow-control",
              "transition-transform duration-exit ease-ui",
              "active:scale-thumb-drag active:cursor-grabbing data-dragging:scale-thumb-drag data-dragging:cursor-grabbing hover-fine:scale-thumb-hover",
              "data-invalid:border-status-danger data-invalid:focus-visible:outline-status-danger",
              "focus-ring",
            )}
          />
        ))}
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
