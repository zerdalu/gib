import {
  THEME_STORAGE_KEY,
  ThemePreferences,
  parseThemePreference,
  useThemeStore,
  type ThemePreference,
} from "@/stores/theme-store";
import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button, ButtonSizes, ButtonVariants, Tooltip, TooltipContent, TooltipTrigger } from "@ui/index";
import { cn } from "cn";
import { useEffect, type ReactElement } from "react";

interface ThemeOption {
  readonly value: ThemePreference;
  readonly label: string;
  readonly ariaLabel: string;
}

const THEME_OPTIONS: readonly [ThemeOption, ThemeOption, ThemeOption] = [
  {
    value: ThemePreferences.System,
    label: "System",
    ariaLabel: "Use system theme",
  },
  {
    value: ThemePreferences.Light,
    label: "Light",
    ariaLabel: "Use light theme",
  },
  {
    value: ThemePreferences.Dark,
    label: "Dark",
    ariaLabel: "Use dark theme",
  },
];

function renderThemeIcon(preference: ThemePreference): ReactElement {
  switch (preference) {
    case ThemePreferences.System:
      return <MonitorIcon aria-hidden="true" className="size-4.5" />;
    case ThemePreferences.Light:
      return <SunIcon aria-hidden="true" className="size-4.5" />;
    case ThemePreferences.Dark:
      return <MoonIcon aria-hidden="true" className="size-4.5" />;
    default: {
      const _exhaustive: never = preference;
      throw new Error(`Unhandled theme preference: ${String(_exhaustive)}`);
    }
  }
}

export interface ThemeToggleProps {
  readonly className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps): ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const syncTheme = useThemeStore((state) => state.syncTheme);

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) {
        return;
      }
      const nextTheme = event.key === null ? ThemePreferences.System : parseThemePreference(event.newValue);
      syncTheme(nextTheme);
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncTheme]);

  return (
    <fieldset
      aria-label="Theme"
      className={cn(
        "inline-flex h-control-md shrink-0 items-center rounded-control border border-node-border bg-node-glass p-0.5 shadow-control backdrop-blur-overlay",
        className,
      )}
    >
      <div className="inline-flex items-center gap-0.5">
        {THEME_OPTIONS.map((option) => {
          const isSelected = theme === option.value;
          const handleSelect = (): void => {
            setTheme(option.value);
          };

          return (
            <Tooltip key={option.value}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant={ButtonVariants.Ghost}
                    size={ButtonSizes.IconSm}
                    aria-label={option.ariaLabel}
                    aria-pressed={isSelected}
                    onClick={handleSelect}
                    className={cn(
                      "text-text-muted hover:text-text-primary",
                      "aria-pressed:border-accent-border aria-pressed:bg-accent-subtle aria-pressed:text-accent-primary aria-pressed:shadow-control aria-pressed:hover:bg-accent-subtle aria-pressed:hover:text-accent-primary",
                    )}
                  />
                }
              >
                {renderThemeIcon(option.value)}
              </TooltipTrigger>
              <TooltipContent>{option.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </fieldset>
  );
}
