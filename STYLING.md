# Styling & Design System Architecture

Gib uses a **100% CSS-variable-driven design system** built on top of **Tailwind CSS v4** and **Base UI** (`@base-ui/react`).

When you clone Gib to start a new project, you never need to edit the component files inside `ui/components/`. Every visual and interaction dimension—colors, light/dark polarity, typography, border radii, elevation, blurs, control density, interactive geometry, focus rings, hit-target floors, and motion curves/durations/scales—is controlled from `src/index.css`.

---

## 1. Architecture Overview

`src/index.css` organizes tokens into three complementary layers:

1. **`@theme` Tokens (Tailwind Theme Namespace)**
   Variables defined inside `@theme` are exposed as `:root` CSS variables and compiled into native Tailwind utilities (e.g., `--color-surface-100` generates `bg-surface-100`, `text-surface-100`, `border-surface-100`; `--radius-panel` generates `rounded-panel`). Colors and shadows use CSS `light-dark()` so light and dark values live side by side without duplicated theme blocks.
2. **`:root` Component, Density & Motion Tokens + `@utility` Rules**
   Control sizing (`--control-h-*`, `--control-px-*`, `--panel-p*`), interactive geometry (`--hit-target-min`, `--checkbox-size`, `--switch-*`, `--slider-*`, `--progress-track-h`), focus/disabled tokens (`--focus-ring-*`, `--opacity-disabled`), and motion timings/scales (`--duration-*`, `--scale-*`) are defined on `:root` and mapped via explicit `@utility` directives. Keeping them out of `@theme`'s `--spacing-*` namespace prevents collisions with Tailwind's standard spacing scale (`size-4.5`, `size-6`, etc.).
3. **Theme Polarity, Portal Isolation & Pointer Variants**
   - `:root` defaults to `color-scheme: light dark` (automatically adapting to OS preference). Setting `data-theme="light"` or `data-theme="dark"` on `<html>` overrides `color-scheme` and resolves every `light-dark()` token immediately.
   - `#root { isolation: isolate; }` creates a root stacking context so Base UI portals rendered in `<body>` always stack cleanly above application content.
   - `@custom-variant hover-fine` gates precision hover animations behind `@media (hover: hover) and (pointer: fine)`.

---

## 2. Base Spacing

| CSS Variable | Default           | Generated Utilities                           | Purpose & Usage                                                                                                                                                         |
| :----------- | :---------------- | :-------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--spacing`  | `0.25rem` (`4px`) | `p-*`, `m-*`, `gap-*`, `size-*`, `w-*`, `h-*` | Multiplier for all standard Tailwind spacing and sizing utilities (`size-4.5` = `18px`, `size-6` = `24px`). Scaling this value scales the entire layout proportionally. |

---

## 3. Typography Tokens

### Font Families

| CSS Variable     | Default             | Tailwind Utility | Purpose & Usage                                                                                                                                                                                                                |
| :--------------- | :------------------ | :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--font-sans`    | `"Inter", ...`      | `font-sans`      | General UI labels (`FieldLabel`), descriptions (`FieldDescription`, `CardDescription`), form inputs (`Input`, `Select`), and menu items.                                                                                       |
| `--font-mono`    | `"Geist Mono", ...` | `font-mono`      | Interactive buttons (`Button`), tab triggers (`TabsTrigger`), badges (`Badge`), numeric readouts (`Slider`, `Progress`), tooltips (`TooltipContent`), and group headers. Always paired with `tabular-nums` on numbers/metrics. |
| `--font-display` | `"Inter", ...`      | `font-display`   | Structural titles (`CardTitle`, `DialogTitle`, `PopoverTitle`). Swap this variable in a new project to give headings a distinct display or serif typeface.                                                                     |

### Font Weights & Letter Spacing

| CSS Variable            | Default   | Tailwind Utility   | Purpose & Usage                                                                                                 |
| :---------------------- | :-------- | :----------------- | :-------------------------------------------------------------------------------------------------------------- |
| `--font-weight-ui`      | `500`     | `font-ui`          | Medium weight applied to interactive controls (`Button`, `Badge`, `FieldLabel`, `TabsTrigger`, selected items). |
| `--font-weight-heading` | `600`     | `font-heading`     | Semibold weight applied to titles (`CardTitle`, `DialogTitle`, `PopoverTitle`).                                 |
| `--tracking-ui`         | `-0.01em` | `tracking-ui`      | Tight, legible letter-spacing for buttons, labels, and tabs.                                                    |
| `--tracking-mono`       | `0.02em`  | `tracking-mono`    | Open letter-spacing for monospace badges, section headers, commands, and numeric values.                        |
| `--tracking-heading`    | `-0.02em` | `tracking-heading` | Crisp letter-spacing for card, popover, and dialog headings.                                                    |

---

## 4. Surface Hierarchy (`--color-surface-*`)

Surfaces establish depth across the viewport, from the recessed input well to floating overlays. Each token uses `light-dark(light, dark)`.

| CSS Variable               | Light Default                 | Dark Default                  | Tailwind Utility (`bg-*`) | Purpose & Usage                                                                                                                              |
| :------------------------- | :---------------------------- | :---------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-surface-canvas`   | `oklch(0.968 0.004 95)`       | `oklch(0.14 0.006 75)`        | `bg-surface-canvas`       | Root page background (`<body>` and `<main>`).                                                                                                |
| `--color-surface-sunken`   | `oklch(0.915 0.006 90)`       | `oklch(0.11 0.005 75)`        | `bg-surface-sunken`       | Recessed wells: `Input`, `SelectTrigger`, unchecked `Checkbox` and `Switch`, `TabsList`, `Slider` track, `Progress` track, and `CardFooter`. |
| `--color-surface-100`      | `oklch(0.99 0.002 95)`        | `oklch(0.18 0.007 75)`        | `bg-surface-100`          | Primary container surface: `Card`, `DialogContent`, and `Slider` thumb.                                                                      |
| `--color-surface-200`      | `oklch(0.978 0.003 95)`       | `oklch(0.22 0.008 75)`        | `bg-surface-200`          | Elevated floating overlays: `SelectContent`, `MenuContent`, `PopoverContent`, `TooltipContent`, `Toast`, and active `Tabs.Indicator`.        |
| `--color-surface-300`      | `oklch(0.938 0.005 92)`       | `oklch(0.26 0.009 75)`        | `bg-surface-300`          | Resting interactive surface: `Button` (`secondary` variant), `Toast.Action`, and `Badge` (`default` variant).                                |
| `--color-surface-hover`    | `oklch(0.89 0.007 88)`        | `oklch(0.29 0.01 75)`         | `bg-surface-hover`        | Hover and keyboard-highlighted states on `Button` (`secondary`, `outline`, `ghost`), `SelectItem`, `MenuItem`, and close buttons.            |
| `--color-surface-active`   | `oklch(0.85 0.009 85)`        | `oklch(0.33 0.012 75)`        | `bg-surface-active`       | Pressed (`active:`) state on `Button` (`secondary`, `outline`, `ghost`) and `Toast.Action`.                                                  |
| `--color-surface-backdrop` | `oklch(0.16 0.006 75 / 0.52)` | `oklch(0.08 0.004 75 / 0.74)` | `bg-surface-backdrop`     | Modal dimming backdrop behind `DialogContent`.                                                                                               |

---

## 5. Text Hierarchy (`--color-text-*`)

All text colors are calibrated for WCAG AA contrast compliance across both light and dark themes.

| CSS Variable             | Light Default           | Dark Default           | Tailwind Utility (`text-*`) | Purpose & Usage                                                                                                                          |
| :----------------------- | :---------------------- | :--------------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-text-primary`   | `oklch(0.17 0.006 75)`  | `oklch(0.95 0.004 95)` | `text-text-primary`         | Primary body copy, input values, headings, active tabs, and highlighted menu/select items.                                               |
| `--color-text-secondary` | `oklch(0.35 0.007 80)`  | `oklch(0.84 0.008 92)` | `text-text-secondary`       | Field labels (`FieldLabel`), card/dialog/popover descriptions, resting menu/select items, and `ghost` buttons.                           |
| `--color-text-muted`     | `oklch(0.46 0.007 80)`  | `oklch(0.73 0.01 90)`  | `text-text-muted`           | Input placeholders, unselected `TabsTrigger`, `FieldDescription`, group labels, and auxiliary icons.                                     |
| `--color-text-disabled`  | `oklch(0.58 0.006 85)`  | `oklch(0.55 0.008 85)` | `text-text-disabled`        | Explicitly disabled text elements when not using opacity dimming.                                                                        |
| `--color-text-on-accent` | `oklch(0.985 0.003 95)` | `oklch(0.15 0.006 75)` | `text-text-on-accent`       | High-contrast foreground text/icons rendered on `--color-accent-primary` (`Button` primary, checked `Checkbox`, checked `Switch` thumb). |
| `--color-text-inverse`   | `oklch(0.968 0.004 95)` | `oklch(0.14 0.006 75)` | `text-text-inverse`         | Text rendered on inverted surfaces.                                                                                                      |

---

## 6. Borders & Focus Rings (`--color-border-*`)

| CSS Variable             | Light Default          | Dark Default           | Tailwind Utility                              | Purpose & Usage                                                                                                                                                                                                  |
| :----------------------- | :--------------------- | :--------------------- | :-------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-border-subtle`  | `oklch(0.83 0.007 88)` | `oklch(0.29 0.008 75)` | `border-border-subtle`, `bg-border-subtle`    | Low-emphasis structural borders: `Card`, `CardHeader`, `CardFooter`, `Separator`, `MenuSeparator`, `SelectSeparator`, `TabsList`, and `Slider`/`Progress` tracks.                                                |
| `--color-border-default` | `oklch(0.6 0.008 85)`  | `oklch(0.56 0.009 85)` | `border-border-default`                       | Standard interactive control and overlay borders: `Input`, `SelectTrigger`, `Checkbox`, `Switch`, `Button` (`outline`), `DialogContent`, `PopoverContent`, `MenuContent`, `SelectContent`, and scrollbar thumbs. |
| `--color-border-strong`  | `oklch(0.45 0.009 80)` | `oklch(0.68 0.01 85)`  | `border-border-strong`                        | Hover/open borders on `Input`, `SelectTrigger`, `Checkbox`, `Switch`, `Button` (`outline`, `secondary`), and hovered scrollbar thumbs.                                                                           |
| `--color-border-focus`   | `oklch(0.49 0.13 78)`  | `oklch(0.8 0.16 88)`   | `outline-border-focus`, `border-border-focus` | Keyboard `:focus-visible` ring (via `focus-ring` / `focus-ring-tight`) and focused input/select border across all interactive primitives.                                                                        |

---

## 7. Brand & Accent Tokens (`--color-accent-*`)

| CSS Variable                    | Light Default                | Dark Default                | Tailwind Utility                                                    | Purpose & Usage                                                                                                                                                       |
| :------------------------------ | :--------------------------- | :-------------------------- | :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-accent-primary`        | `oklch(0.21 0.007 75)`       | `oklch(0.8 0.16 88)`        | `bg-accent-primary`, `text-accent-primary`, `border-accent-primary` | Primary brand color: `Button` (`primary`), checked `Checkbox`, checked `Switch`, `Slider` indicator & thumb border, `Progress` (`default`), and selection checkmarks. |
| `--color-accent-primary-hover`  | `oklch(0.28 0.009 75)`       | `oklch(0.84 0.15 88)`       | `hover:bg-accent-primary-hover`                                     | Hovered state for primary buttons and checked checkboxes.                                                                                                             |
| `--color-accent-primary-active` | `oklch(0.15 0.005 75)`       | `oklch(0.74 0.16 88)`       | `active:bg-accent-primary-active`                                   | Pressed state for primary buttons and accent links.                                                                                                                   |
| `--color-accent-subtle`         | `oklch(0.8 0.155 88 / 0.18)` | `oklch(0.8 0.16 88 / 0.15)` | `bg-accent-subtle`                                                  | Translucent accent fill used in `Badge` (`accent` variant) and highlighted callouts.                                                                                  |
| `--color-accent-border`         | `oklch(0.52 0.13 80 / 0.55)` | `oklch(0.8 0.16 88 / 0.48)` | `border-accent-border`                                              | Tinted border used in `Badge` (`accent` variant).                                                                                                                     |
| `--color-accent-secondary`      | `oklch(0.8 0.16 88)`         | `oklch(0.74 0.12 70)`       | `bg-accent-secondary`, `text-accent-secondary`                      | Secondary accent for charts, secondary highlights, or multi-series data.                                                                                              |

---

## 8. Semantic Status Tokens (`--color-status-*`)

Each semantic state (`success`, `warning`, `danger`, `info`) provides coordinated solid, translucent background, tinted border, and accessible text tokens (with an extra `--color-status-danger-active` token for pressed destructive actions).

| Status Group | CSS Variables                                                                                                                                             | Where Used                                                                                                                                                                                                                                                    |
| :----------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Success**  | `--color-status-success`<br>`--color-status-success-bg`<br>`--color-status-success-border`<br>`--color-status-success-text`                               | `Badge` (`variant="success"`), `Progress` (`variant="success"`), `Toast` (`type="success"`), and `QuickCopy` confirmation icon.                                                                                                                               |
| **Warning**  | `--color-status-warning`<br>`--color-status-warning-bg`<br>`--color-status-warning-border`<br>`--color-status-warning-text`                               | `Badge` (`variant="warning"`), `Progress` (`variant="warning"`), and `Toast` (`type="warning"`).                                                                                                                                                              |
| **Danger**   | `--color-status-danger`<br>`--color-status-danger-active`<br>`--color-status-danger-bg`<br>`--color-status-danger-border`<br>`--color-status-danger-text` | `Button` (`variant="danger"`), `Badge` (`variant="danger"`), `FieldError`, invalid `Input`/`SelectTrigger`/`Checkbox`/`Switch`/`Slider` (`data-invalid`), destructive `MenuItem` (`danger`), `Progress` (`variant="danger"`), and `Toast` (`danger`/`error`). |
| **Info**     | `--color-status-info`<br>`--color-status-info-bg`<br>`--color-status-info-border`<br>`--color-status-info-text`                                           | `Badge` (`variant="info"`), `Progress` (`variant="info"`), and `Toast` (`type="info"`).                                                                                                                                                                       |

---

## 9. Architectural Geometry (`--radius-*`)

Changing these variables reshapes the entire silhouette of the UI—from sharp `0px` terminal interfaces to soft rounded or pill-shaped apps.

| CSS Variable           | Default                                     | Tailwind Utility        | Components Controlled                                                                                                                                                                                |
| :--------------------- | :------------------------------------------ | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--radius-control`     | `0.125rem` (`2px`)                          | `rounded-control`       | `Button`, `Input`, `SelectTrigger`, `SelectItem`, `MenuItem`, `MenuCheckboxItem`, `MenuRadioItem`, `TabsList`, `TabsTrigger`, `Tabs.Indicator`, `TooltipContent`, `Toast.Action`, and close buttons. |
| `--radius-panel`       | `0.25rem` (`4px`)                           | `rounded-panel`         | `Card`, `DialogContent`, `PopoverContent`, `SelectContent`, `MenuContent`, and `Toast`.                                                                                                              |
| `--radius-panel-inner` | `max(0px, calc(var(--radius-panel) - 1px))` | `rounded-b-panel-inner` | Concentric inner panel corner radius that automatically hugs a `1px` panel border (`CardFooter`).                                                                                                    |
| `--radius-badge`       | `0.125rem` (`2px`)                          | `rounded-badge`         | `Badge`.                                                                                                                                                                                             |
| `--radius-toggle`      | `0.125rem` (`2px`)                          | `rounded-toggle`        | `Checkbox`.                                                                                                                                                                                          |
| `--radius-track`       | `9999px` (pill)                             | `rounded-track`         | `Switch` track & thumb, `Slider` track, indicator & thumb, `Progress` track & indicator, and status indicator dots in `Toast`.                                                                       |

---

## 10. Elevation, Shadows & Blur

All shadow tokens use `light-dark()` so light and dark depth live in a single declaration. Set them to `none` for flat, border-only themes.

| CSS Variable        | Default                                  | Tailwind Utility         | Components Controlled                                                                                                  |
| :------------------ | :--------------------------------------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `--shadow-control`  | `0 1px 2px 0 light-dark(...)`            | `shadow-control`         | `Button`, `Input`, `SelectTrigger`, `Checkbox`, `Switch`, `Slider` thumb, `Toast.Action`, and active `Tabs.Indicator`. |
| `--shadow-panel`    | `0 3px 10px -2px light-dark(...), ...`   | `shadow-panel`           | `Card`.                                                                                                                |
| `--shadow-floating` | `0 12px 26px -5px light-dark(...), ...`  | `shadow-floating`        | Floating overlays: `SelectContent`, `MenuContent`, `PopoverContent`, `TooltipContent`, and `Toast`.                    |
| `--shadow-modal`    | `0 22px 46px -12px light-dark(...), ...` | `shadow-modal`           | `DialogContent`.                                                                                                       |
| `--blur-overlay`    | `6px`                                    | `backdrop-blur-overlay`  | `Dialog.Backdrop`.                                                                                                     |
| `--blur-floating`   | `12px`                                   | `backdrop-blur-floating` | `SelectContent`, `MenuContent`, `PopoverContent`, `TooltipContent`, and `Toast`.                                       |
| `--blur-transition` | `2px`                                    | `blur-transition`        | Subtle icon/state crossfade blur (`QuickCopy` copy/check/error icon transition).                                       |

---

## 11. Motion System (Curves, Durations & Scales)

Every animation property—easing curves, enter/exit durations, and tactile press/popup scales—is driven by CSS variables. Under `@media (prefers-reduced-motion: reduce)`, all `--scale-*` tokens automatically flatten to `1` while retaining helpful opacity/color transitions.

### Curves & Animations

| CSS Variable                       | Default                                                   | Tailwind / Custom Utility        | Purpose & Usage                                                                                                         |
| :--------------------------------- | :-------------------------------------------------------- | :------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| `--ease-ui`                        | `cubic-bezier(0.23, 1, 0.32, 1)`                          | `ease-ui`                        | Strong `ease-out` curve for responsive control feedback, popups, tooltips, modals, and toasts.                          |
| `--ease-in-out`                    | `cubic-bezier(0.77, 0, 0.175, 1)`                         | `ease-in-out`                    | Strong `ease-in-out` curve for on-screen movement (`Tabs.Indicator`, `Progress.Indicator`, indeterminate progress bar). |
| `--ease-spring`                    | `cubic-bezier(0.22, 1.2, 0.36, 1)`                        | `ease-spring`                    | Subtle overshoot curve available for playful re-skins (e.g., set `--ease-toggle: var(--ease-spring)`).                  |
| `--ease-toggle`                    | `var(--ease-ui)`                                          | `ease-toggle`                    | Easing curve used by `Switch.Thumb` translation.                                                                        |
| `--animate-progress-indeterminate` | `progress-indeterminate 1.4s var(--ease-in-out) infinite` | `animate-progress-indeterminate` | Indeterminate sliding indicator animation on `Progress`.                                                                |

### Durations

| CSS Variable         | Default | Custom Utility     | Purpose & Usage                                                                                                                          |
| :------------------- | :------ | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `--duration-exit`    | `100ms` | `duration-exit`    | Snappy exit timing for `Popover`, `Menu`, `Select`, and `Tooltip`, plus `Slider.Thumb` scale feedback.                                   |
| `--duration-tooltip` | `125ms` | `duration-tooltip` | `Tooltip` entrance timing (adjacent open tooltips snap at `0ms` via `data-instant:transition-none`).                                     |
| `--duration-control` | `150ms` | `duration-control` | Standard control transitions (`Button`, `Input`, `Checkbox`, `Switch`, `Badge`, `Popover`/`Menu`/`Select` enter, `Dialog`/`Toast` exit). |
| `--duration-overlay` | `200ms` | `duration-overlay` | Larger surfaces and sliding indicators (`Dialog` enter, `Tabs.Indicator`, `Progress.Indicator`).                                         |
| `--duration-toast`   | `250ms` | `duration-toast`   | Composed entrance timing for `Toast` notifications.                                                                                      |

### Scales

| CSS Variable          | Default | Custom Utility      | Purpose & Usage                                                                              |
| :-------------------- | :------ | :------------------ | :------------------------------------------------------------------------------------------- |
| `--scale-press`       | `0.97`  | `scale-press`       | Active press feedback on `Button`, `Switch`, `Toast.Action`, and interactive links.          |
| `--scale-press-sm`    | `0.95`  | `scale-press-sm`    | Active press feedback on compact square targets (`Checkbox`, `Dialog.Close`, `Toast.Close`). |
| `--scale-popup`       | `0.95`  | `scale-popup`       | Starting/ending scale for `Popover`, `Menu`, `Select`, `Dialog`, and icon crossfades.        |
| `--scale-tooltip`     | `0.97`  | `scale-tooltip`     | Starting/ending scale for `Tooltip`.                                                         |
| `--scale-thumb-hover` | `1.05`  | `scale-thumb-hover` | Pointer-fine hover scale (`hover-fine:`) on `Slider.Thumb`.                                  |
| `--scale-thumb-drag`  | `1.1`   | `scale-thumb-drag`  | Active/dragging grip scale on `Slider.Thumb`.                                                |

### Explicit Transition Utilities

Components never use `transition-all`. Instead, explicit property-scoped utilities prevent unintended layout/repositioning transitions:

- `transition-control` (`color, background-color, border-color, scale`)
- `transition-popup` (`scale, opacity`)
- `transition-switch-thumb` (`translate, background-color`)
- `transition-toast` (`translate, transform, opacity`)
- `transition-tabs` (`translate, width`)
- `transition-progress` (`width`)
- `transition-icon` (`opacity, scale, filter`)

---

## 12. Density, Control Geometry, Focus & Chrome Tokens (`:root` + `@utility`)

### Control Heights & Square Icon Targets

| CSS Variable     | Default             | Custom Utilities                                      | Components Controlled                                                                                                       |
| :--------------- | :------------------ | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `--control-h-xs` | `1.5rem` (`24px`)   | `h-control-xs`, `size-control-xs`                     | `Button` (`size="xs"`, `size="icon-xs"`), `Input` (`size="xs"`), `Toast.Action`, and close buttons in `Dialog` and `Toast`. |
| `--control-h-sm` | `1.875rem` (`30px`) | `h-control-sm`, `min-h-control-sm`, `size-control-sm` | `Button` (`size="sm"`, `size="icon-sm"`), `Input` (`size="sm"`), `TabsTrigger`, `SelectItem`, and `MenuItem`.               |
| `--control-h-md` | `2.25rem` (`36px`)  | `h-control-md`, `size-control-md`                     | Default size for `Button` (`size="md"`, `size="icon-md"`), `Input` (`size="md"`), and `SelectTrigger`.                      |
| `--control-h-lg` | `2.625rem` (`42px`) | `h-control-lg`, `size-control-lg`                     | `Button` (`size="lg"`, `size="icon-lg"`) and `Input` (`size="lg"`).                                                         |

### Control Horizontal Padding

| CSS Variable      | Default             | Custom Utility     | Components Controlled                                                                                        |
| :---------------- | :------------------ | :----------------- | :----------------------------------------------------------------------------------------------------------- |
| `--control-px-xs` | `0.5rem` (`8px`)    | `px-control-px-xs` | `Button` (`size="xs"`), `Input` (`size="xs"`), and `Toast.Action`.                                           |
| `--control-px-sm` | `0.625rem` (`10px`) | `px-control-px-sm` | `Button` (`size="sm"`), `Input` (`size="sm"`), `SelectItem`, `MenuItem`, `TooltipContent`, and group labels. |
| `--control-px-md` | `0.875rem` (`14px`) | `px-control-px-md` | `Button` (`size="md"`), `Input` (`size="md"`), `SelectTrigger`, and `TabsTrigger`.                           |
| `--control-px-lg` | `1.125rem` (`18px`) | `px-control-px-lg` | `Button` (`size="lg"`) and `Input` (`size="lg"`).                                                            |

### Panel Padding

| CSS Variable   | Default             | Custom Utilities            | Components Controlled                                                                                             |
| :------------- | :------------------ | :-------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `--panel-p-sm` | `0.875rem` (`14px`) | `p-panel-sm`, `py-panel-sm` | Compact floating containers: `PopoverContent`, `Toast`, and vertical padding in `CardFooter`.                     |
| `--panel-p`    | `1.25rem` (`20px`)  | `p-panel`, `px-panel`       | Standard container padding: `CardHeader`, `CardContent`, `DialogContent`, and horizontal padding in `CardFooter`. |
| `--panel-p-lg` | `1.5rem` (`24px`)   | `p-panel-lg`                | Spacious container padding for large modals or feature cards.                                                     |

### Interactive Control Geometry

| CSS Variable         | Default                                                 | Custom Utilities                       | Purpose & Usage                                                                                                                                             |
| :------------------- | :------------------------------------------------------ | :------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--hit-target-min`   | `1.5rem` (`24px`)                                       | `min-h-hit`, `min-w-hit`, `hit-target` | Global minimum interactive hit-target floor across all controls; `hit-target` expands compact visuals (`Checkbox`, `Slider.Thumb`) invisibly via `::after`. |
| `--checkbox-size`    | `1.125rem` (`18px`)                                     | `size-checkbox`                        | Visual width/height of `Checkbox` (its clickable area stays at least `--hit-target-min`).                                                                   |
| `--switch-w`         | `2.75rem` (`44px`)                                      | `size-switch`                          | Width of `Switch` track.                                                                                                                                    |
| `--switch-h`         | `1.5rem` (`24px`)                                       | `size-switch`                          | Height of `Switch` track.                                                                                                                                   |
| `--switch-pad`       | `0.125rem` (`2px`)                                      | `size-switch`                          | Inner padding between `Switch` border and thumb.                                                                                                            |
| `--switch-thumb`     | `calc(var(--switch-h) - (var(--switch-pad) * 2) - 2px)` | `size-switch-thumb`                    | Auto-calculated `Switch.Thumb` diameter that stays exact for any `--switch-h` / `--switch-pad`.                                                             |
| `--switch-travel`    | `calc(var(--switch-w) - var(--switch-h))`               | `translate-x-(--switch-travel)`        | Auto-calculated checked travel distance for `Switch.Thumb`.                                                                                                 |
| `--slider-track-h`   | `0.5rem` (`8px`)                                        | `h-slider-track`                       | Thickness of `Slider` track.                                                                                                                                |
| `--slider-thumb`     | `1.125rem` (`18px`)                                     | `size-slider-thumb`                    | Visual diameter of `Slider.Thumb` (its clickable area stays at least `--hit-target-min`).                                                                   |
| `--progress-track-h` | `0.5rem` (`8px`)                                        | `h-progress-track`                     | Thickness of `Progress` track.                                                                                                                              |

### Focus Ring, Disabled State & Page Chrome

| CSS Variable                | Default                     | Custom Utilities                     | Purpose & Usage                                                                          |
| :-------------------------- | :-------------------------- | :----------------------------------- | :--------------------------------------------------------------------------------------- |
| `--focus-ring-width`        | `2px`                       | `focus-ring`, `focus-ring-tight`     | Focus outline stroke thickness across all interactive primitives.                        |
| `--focus-ring-offset`       | `2px`                       | `focus-ring`                         | Standard focus outline offset (`Button`, `Checkbox`, `Switch`, `Slider`, `Tabs`, links). |
| `--focus-ring-offset-tight` | `1px`                       | `focus-ring-tight`                   | Compact focus outline offset (`Input`, `SelectTrigger`, `Toast.Close`).                  |
| `--opacity-disabled`        | `0.45`                      | `opacity-disabled`                   | Opacity applied to disabled interactive controls and field labels/descriptions.          |
| `--surface-canvas-image`    | Dual subtle radial gradient | — (applied on `body`)                | Ambient canvas background treatment; set to `none` for a completely flat canvas.         |
| `--scrollbar-size`          | `6px`                       | — (applied on `::-webkit-scrollbar`) | Width/height of custom scrollbars.                                                       |

---

## 13. Re-Skinning Checklist for New Projects

When cloning Gib for a new project, open `src/index.css` and adjust only CSS variables:

1. **Brand Palette**: Update the `light-dark(...)` OKLCH values for `--color-accent-*`, `--color-border-focus`, and neutral surface/border hues inside `@theme`.
2. **Theme Polarity**: Keep `color-scheme: light dark` on `:root` for automatic OS adaptation, or set `color-scheme: light` / `color-scheme: dark` to lock a default mode (override at runtime with `data-theme="light"` or `data-theme="dark"` on `<html>`).
3. **Corner Silhouette**: Edit `--radius-control`, `--radius-panel`, `--radius-badge`, and `--radius-toggle` (`0rem` for brutalist/terminal, `0.25rem` for technical tools, `0.75rem+` for softer consumer apps). `--radius-panel-inner` recalculates automatically.
4. **Elevation & Atmosphere**: Adjust `--shadow-*`, `--blur-*`, and `--surface-canvas-image` (set shadows and `--surface-canvas-image` to `none` for flat graphic systems).
5. **Typography**: Swap the Google Fonts link in `index.html` and update `--font-sans`, `--font-mono`, `--font-display`, and `--tracking-*`.
6. **Density & Touch Targets**: Tune `--control-h-*`, `--control-px-*`, `--panel-p*`, `--checkbox-size`, `--switch-*`, `--slider-*`, and `--hit-target-min` (e.g., `2.75rem` for touch-first mobile apps).
7. **Motion Personality**: Adjust `--ease-ui`, `--ease-in-out`, `--ease-toggle`, `--duration-*`, and `--scale-*` (set `--scale-*` to `1` and durations to `0ms` for an instant, zero-motion UI).
