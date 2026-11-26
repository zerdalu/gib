import * as v from "valibot";
import { create } from "zustand";

export const ThemePreferences = {
  System: "system",
  Light: "light",
  Dark: "dark",
} as const;

export type ThemePreference = (typeof ThemePreferences)[keyof typeof ThemePreferences];

export const THEME_STORAGE_KEY = "gib-theme";

const ThemePreferenceSchema = v.picklist([ThemePreferences.System, ThemePreferences.Light, ThemePreferences.Dark]);

export function parseThemePreference(raw: unknown): ThemePreference {
  const result = v.safeParse(ThemePreferenceSchema, raw);
  return result.success ? result.output : ThemePreferences.System;
}

export function applyThemePreference(theme: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  switch (theme) {
    case ThemePreferences.System: {
      delete root.dataset.theme;
      break;
    }
    case ThemePreferences.Light:
    case ThemePreferences.Dark: {
      root.dataset.theme = theme;
      break;
    }
    default: {
      const _exhaustive: never = theme;
      throw new Error(`Unhandled theme preference: ${String(_exhaustive)}`);
    }
  }
}

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return ThemePreferences.System;
  }

  try {
    const raw: unknown = window.localStorage.getItem(THEME_STORAGE_KEY);
    return parseThemePreference(raw);
  } catch {
    return ThemePreferences.System;
  }
}

function writeStoredTheme(theme: ThemePreference): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (theme === ThemePreferences.System) {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch {
    // Ignore storage access errors in restricted browsing contexts
  }
}

export interface ThemeStore {
  readonly theme: ThemePreference;
  readonly setTheme: (theme: ThemePreference) => void;
  readonly syncTheme: (theme: ThemePreference) => void;
}

const initialTheme = readStoredTheme();
applyThemePreference(initialTheme);

export const useThemeStore = create<ThemeStore>()((set) => ({
  theme: initialTheme,
  setTheme: (theme: ThemePreference): void => {
    applyThemePreference(theme);
    writeStoredTheme(theme);
    set({ theme });
  },
  syncTheme: (theme: ThemePreference): void => {
    applyThemePreference(theme);
    set({ theme });
  },
}));
