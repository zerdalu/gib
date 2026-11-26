import { cn } from "cn";
import type { ReactElement } from "react";

export interface HorizontalConnectorProps {
  readonly className?: string;
}

export function HorizontalConnector({ className }: HorizontalConnectorProps): ReactElement {
  return (
    <div aria-hidden="true" className={cn("relative hidden h-14 items-center justify-center lg:flex", className)}>
      <svg viewBox="0 0 180 56" fill="none" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path
          d="M 0 28 C 56 20, 124 36, 180 28"
          stroke="var(--color-connector-active)"
          strokeWidth="6"
          strokeOpacity="0.16"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 28 C 56 36, 124 20, 180 28"
          stroke="var(--color-connector-active)"
          strokeWidth="1"
          strokeOpacity="0.48"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 28 C 56 20, 124 36, 180 28"
          stroke="var(--color-connector-active)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export interface BranchConnectorProps {
  readonly ids: readonly [string, string, string];
  readonly activeId: string;
  readonly className?: string;
}

interface BranchGeometry {
  readonly endX: number;
  readonly startControlOffset: number;
  readonly endControlOffset: number;
}

const HUB_PORT_X = 708;

const BRANCH_GEOMETRIES: readonly [BranchGeometry, BranchGeometry, BranchGeometry] = [
  { endX: 158, startControlOffset: 14, endControlOffset: -14 },
  { endX: 500, startControlOffset: 12, endControlOffset: -12 },
  { endX: 842, startControlOffset: -12, endControlOffset: 12 },
];

export function BranchConnector({ ids, activeId, className }: BranchConnectorProps): ReactElement {
  const orderedBranches = ids
    .map((id, index) => ({
      id,
      geometry: BRANCH_GEOMETRIES[index],
      isActive: id === activeId,
    }))
    .toSorted((a, b) => Number(a.isActive) - Number(b.isActive));

  return (
    <div aria-hidden="true" className={cn("relative hidden h-14 w-full lg:block", className)}>
      <svg viewBox="0 0 1000 56" fill="none" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        {orderedBranches.map(({ id, geometry, isActive }) => {
          if (!geometry) {
            return null;
          }

          const strokeColor = isActive ? "var(--color-connector-active)" : "var(--color-connector-muted)";
          const primaryPath = `M ${HUB_PORT_X} 0 C ${HUB_PORT_X} 28, ${geometry.endX} 26, ${geometry.endX} 56`;
          const secondaryPath = `M ${HUB_PORT_X} 0 C ${HUB_PORT_X + geometry.startControlOffset} 28, ${geometry.endX + geometry.endControlOffset} 28, ${geometry.endX} 56`;

          return (
            <g key={id}>
              <path
                d={primaryPath}
                stroke={strokeColor}
                strokeWidth="6"
                strokeOpacity={isActive ? 0.16 : 0.06}
                vectorEffect="non-scaling-stroke"
                className="transition-connector duration-overlay ease-ui"
              />
              <path
                d={secondaryPath}
                stroke={strokeColor}
                strokeWidth="1"
                strokeOpacity={isActive ? 0.45 : 0.28}
                vectorEffect="non-scaling-stroke"
                className="transition-connector duration-overlay ease-ui"
              />
              <path
                d={primaryPath}
                stroke={strokeColor}
                strokeWidth={isActive ? "1.5" : "1.25"}
                strokeOpacity={isActive ? 1 : 0.72}
                vectorEffect="non-scaling-stroke"
                className="transition-connector duration-overlay ease-ui"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export interface ConvergeConnectorProps {
  readonly activeIndex: number;
  readonly className?: string;
}

const CONVERGE_START_X: readonly [number, number, number] = [158, 500, 842];

export function ConvergeConnector({ activeIndex, className }: ConvergeConnectorProps): ReactElement {
  const orderedPaths = CONVERGE_START_X.map((startX, index) => ({
    startX,
    index,
    isActive: index === activeIndex,
  })).toSorted((a, b) => Number(a.isActive) - Number(b.isActive));

  return (
    <div aria-hidden="true" className={cn("relative hidden h-11 w-full lg:block", className)}>
      <svg viewBox="0 0 1000 44" fill="none" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        {orderedPaths.map(({ startX, index, isActive }) => {
          const strokeColor = isActive ? "var(--color-connector-active)" : "var(--color-connector-muted)";
          const primaryPath = `M ${startX} 0 C ${startX} 24, 500 18, 500 44`;
          const secondaryPath = `M ${startX} 0 C ${startX + (index === 0 ? 18 : index === 2 ? -18 : 12)} 26, ${500 + (index === 1 ? -12 : 0)} 18, 500 44`;

          return (
            <g key={startX}>
              <path
                d={primaryPath}
                stroke={strokeColor}
                strokeWidth="6"
                strokeOpacity={isActive ? 0.18 : 0.06}
                vectorEffect="non-scaling-stroke"
                className="transition-connector duration-overlay ease-ui"
              />
              <path
                d={secondaryPath}
                stroke={strokeColor}
                strokeWidth="1"
                strokeOpacity={isActive ? 0.45 : 0.25}
                vectorEffect="non-scaling-stroke"
                className="transition-connector duration-overlay ease-ui"
              />
              <path
                d={primaryPath}
                stroke={strokeColor}
                strokeWidth={isActive ? "1.5" : "1.15"}
                strokeOpacity={isActive ? 1 : 0.65}
                vectorEffect="non-scaling-stroke"
                className="transition-connector duration-overlay ease-ui"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
