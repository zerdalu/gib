# Gib

**Gib** is a full-stack edge application template powered by React, Hono, and Cloudflare Workers. It includes a token-driven UI system built on Base UI and Tailwind CSS v4 where colors, theme polarity, typography, geometry, elevation, density, control proportions, focus rings, hit targets, and motion are all controlled via CSS variables—allowing new projects to adopt a completely different visual identity by editing `src/index.css` without touching component code. See [`STYLING.md`](./STYLING.md) for the complete token reference and re-skinning checklist.

## Library Stack

- React - https://react.dev/
- Base UI - https://base-ui.com/
- Tailwind CSS - https://tailwindcss.com/
- cn - https://github.com/shadcn-ui/cn
- Phosphor Icons - https://phosphoricons.com/
- Zustand - https://zustand.docs.pmnd.rs/
- Valibot - https://valibot.dev/
- Hono - https://hono.dev/
- Cloudflare CLI - https://developers.cloudflare.com/cf/get-started/
- Vite - https://vite.dev/
- Oxlint - https://oxc.rs/docs/guide/usage/linter.html
- Oxfmt - https://oxc.rs/docs/guide/usage/formatter.html
- Vitest - https://vitest.dev/
- Babel - https://babel.dev/
- TypeScript - https://www.typescriptlang.org/

## TODO

- [ ] Build and publish a personal scaffolding CLI (e.g., `@zerdalu/getir` or `pnpm create @zerdalu/gib`) to bootstrap new projects from this template:
  - Shallow clone `git@github.com:zerdalu/gib.git` over SSH into the target directory and remove `.git`
  - Replace `"name": "gib"` in `package.json` and `wrangler.jsonc` with the new project name
  - Update `<title>` in `index.html` and remove the template domain route from `wrangler.jsonc`
  - Initialize a fresh Git repository (`git init`) and install dependencies (`pnpm install`)
