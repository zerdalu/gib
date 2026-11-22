import {
  NodeFrameVariants,
  NodePortTones,
  type NodeFrameVariant,
  type NodePortSide,
  type NodePortTone,
} from "@/variants";
import { cn } from "cn";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

export type { NodeFrameVariant, NodePortSide, NodePortTone };

export interface NodePort {
  readonly side: NodePortSide;
  readonly tone: NodePortTone;
  readonly id?: string;
}

export interface NodeFrameProps extends HTMLAttributes<HTMLDivElement> {
  readonly variant?: NodeFrameVariant;
  readonly active?: boolean;
  readonly ports?: readonly NodePort[];
  readonly contentClassName?: string;
  readonly children: ReactNode;
}

const portPositionClasses: Record<NodePortSide, string> = {
  top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-8",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-0.5 w-8",
  left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8",
  right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-0.5 h-8",
};

const portHaloClasses: Record<NodePortSide, string> = {
  top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-14",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-4 w-14",
  left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-14",
  right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-14",
};

export function NodeFrame({
  variant = NodeFrameVariants.Default,
  active = false,
  ports = [],
  className,
  contentClassName,
  children,
  ...props
}: NodeFrameProps): ReactElement {
  const isFeatured = variant === NodeFrameVariants.Featured;
  const isHighlighted = isFeatured || active;

  return (
    <div className={cn("relative", className)} {...props}>
      {isFeatured ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-node-frame bg-node-glow opacity-75 blur-2xl"
        />
      ) : null}

      <svg
        aria-hidden="true"
        viewBox="0 0 36 36"
        fill="none"
        className={cn(
          "pointer-events-none absolute -top-2 -left-2 size-9 transition-colors duration-overlay ease-ui",
          isHighlighted ? "text-node-frame-active" : "text-node-frame",
        )}
      >
        <path d="M 1 35 V 31 C 1 14.43 14.43 1 31 1 H 35" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>

      <div
        className={cn(
          "relative rounded-node-frame border p-2 transition-node duration-overlay ease-ui",
          isHighlighted ? "border-node-frame-active" : "border-node-frame",
        )}
      >
        {ports.map((port, index) => {
          const isPortActive = port.tone === NodePortTones.Active;
          const key = port.id ?? `${port.side}-${index}`;
          return (
            <span key={key} aria-hidden="true" className="pointer-events-none">
              <span
                className={cn(
                  "absolute z-10 rounded-track transition-node duration-overlay ease-ui",
                  portPositionClasses[port.side],
                  isPortActive ? "bg-connector-active" : "bg-connector-muted",
                )}
              />
              <span
                className={cn(
                  "absolute z-0 rounded-track blur-md transition-node duration-overlay ease-ui",
                  portHaloClasses[port.side],
                  isPortActive ? "bg-connector-active opacity-55" : "bg-connector-muted opacity-30",
                )}
              />
            </span>
          );
        })}

        <div
          className={cn(
            "relative rounded-panel border backdrop-blur-floating transition-node duration-overlay ease-ui",
            isFeatured
              ? "border-node-featured-border bg-node-featured text-node-featured-text shadow-node-featured"
              : cn(
                  "bg-node-glass text-text-primary shadow-panel",
                  active ? "border-node-frame-active" : "border-node-border",
                ),
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
