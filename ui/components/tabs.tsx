import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";

export type TabsProps = ComponentProps<typeof BaseTabs.Root>;

export function Tabs({ className, ...props }: TabsProps): ReactElement {
  return <BaseTabs.Root className={cn("flex flex-col gap-3", className)} {...props} />;
}

export type TabsListProps = ComponentProps<typeof BaseTabs.List>;

export function TabsList({ className, children, ...props }: TabsListProps): ReactElement {
  return (
    <BaseTabs.List
      className={cn(
        "relative inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto border border-border-subtle bg-surface-sunken p-1",
        "rounded-control",
        className,
      )}
      {...props}
    >
      {children}
      <BaseTabs.Indicator
        className={cn(
          "absolute top-0 left-0 z-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top)",
          "rounded-control border border-border-default bg-surface-200 shadow-control",
          "transition-tabs duration-overlay ease-in-out motion-reduce:transition-none",
        )}
      />
    </BaseTabs.List>
  );
}

export type TabsTriggerProps = ComponentProps<typeof BaseTabs.Tab>;

export function TabsTrigger({ className, ...props }: TabsTriggerProps): ReactElement {
  return (
    <BaseTabs.Tab
      className={cn(
        "relative z-10 inline-flex h-control-sm min-h-hit min-w-hit shrink-0 cursor-pointer items-center justify-center gap-1.5 px-control-px-md font-mono text-xs font-ui tracking-ui whitespace-nowrap text-text-muted select-none",
        "rounded-control transition-colors duration-control ease-ui",
        "hover:text-text-secondary",
        "focus-ring",
        "data-active:text-text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-disabled",
        className,
      )}
      {...props}
    />
  );
}

export type TabsContentProps = ComponentProps<typeof BaseTabs.Panel>;

export function TabsContent({ className, ...props }: TabsContentProps): ReactElement {
  return <BaseTabs.Panel className={cn("focus-ring outline-none", className)} {...props} />;
}
