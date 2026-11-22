import gibIconUrl from "@/assets/icon.svg";
import { QuickCopy } from "@/components/quick-copy";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Separator } from "@ui/index";
import type { CSSProperties, ReactElement } from "react";

interface StackLibrary {
  readonly index: string;
  readonly name: string;
  readonly href: string;
}

interface StackGroup {
  readonly id: string;
  readonly title: string;
  readonly items: readonly StackLibrary[];
}

const GITHUB_URL = "https://github.com/zerdalu/gib";
const REPO_SSH_URL = "git@github.com:zerdalu/gib.git";

const GIB_ICON_MASK_STYLE: CSSProperties = {
  maskImage: `url("${gibIconUrl}")`,
  maskPosition: "center",
  maskRepeat: "no-repeat",
  maskSize: "contain",
  WebkitMaskImage: `url("${gibIconUrl}")`,
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
};

const STACK_GROUPS: readonly StackGroup[] = [
  {
    id: "interface",
    title: "Interface",
    items: [
      { index: "01", name: "React", href: "https://react.dev/" },
      { index: "02", name: "Base UI", href: "https://base-ui.com/" },
      { index: "03", name: "Tailwind CSS", href: "https://tailwindcss.com/" },
      { index: "04", name: "cn", href: "https://github.com/shadcn-ui/cn" },
      { index: "05", name: "Phosphor Icons", href: "https://phosphoricons.com/" },
    ],
  },
  {
    id: "state-edge",
    title: "State & Edge",
    items: [
      { index: "06", name: "Zustand", href: "https://zustand.docs.pmnd.rs/" },
      { index: "07", name: "Valibot", href: "https://valibot.dev/" },
      { index: "08", name: "Hono", href: "https://hono.dev/" },
      {
        index: "09",
        name: "Cloudflare Wrangler",
        href: "https://developers.cloudflare.com/workers/wrangler/",
      },
    ],
  },
  {
    id: "tooling",
    title: "Tooling",
    items: [
      { index: "10", name: "Vite", href: "https://vite.dev/" },
      { index: "11", name: "Oxlint", href: "https://oxc.rs/docs/guide/usage/linter.html" },
      { index: "12", name: "Oxfmt", href: "https://oxc.rs/docs/guide/usage/formatter.html" },
      { index: "13", name: "Vitest", href: "https://vitest.dev/" },
      { index: "14", name: "TypeScript", href: "https://www.typescriptlang.org/" },
    ],
  },
];

interface StackColumnProps {
  readonly group: StackGroup;
}

function StackColumn({ group }: StackColumnProps): ReactElement {
  return (
    <section aria-labelledby={`stack-group-${group.id}`} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id={`stack-group-${group.id}`}
          className="font-sans text-sm font-heading tracking-heading text-text-primary"
        >
          {group.title}
        </h2>
        <span className="font-mono text-xs text-text-muted tabular-nums">
          {String(group.items.length).padStart(2, "0")}
        </span>
      </div>
      <Separator />
      <ul className="flex flex-col gap-1">
        {group.items.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-control-sm min-w-hit items-center justify-between gap-2 rounded-control px-control-px-sm py-1.5 text-text-primary focus-ring transition-control duration-control ease-ui hover:bg-accent-primary hover:text-text-on-accent active:scale-press active:bg-accent-primary-active"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="font-mono text-xs text-text-muted tabular-nums transition-colors duration-control ease-ui group-hover:text-text-on-accent">
                  {item.index}
                </span>
                <span className="truncate font-sans text-sm font-ui">{item.name}</span>
              </span>
              <ArrowUpRightIcon
                aria-hidden="true"
                className="size-4.5 shrink-0 text-text-muted transition-[color,translate] duration-control ease-ui group-hover:text-text-on-accent motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function App(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col text-text-primary">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 pt-8 pb-5 md:px-10 md:pt-10">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            style={GIB_ICON_MASK_STYLE}
            className="inline-block size-4.5 shrink-0 bg-text-primary"
          />
          <span className="font-mono text-sm font-heading tracking-mono text-text-primary uppercase">Gib</span>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gib repository on GitHub"
          className="inline-flex h-control-md min-h-hit min-w-hit items-center gap-2 rounded-control border border-border-default bg-surface-100 px-control-px-md font-mono text-xs font-ui tracking-mono text-text-primary shadow-control focus-ring transition-control duration-control ease-ui hover:border-border-strong hover:bg-surface-hover active:scale-press active:bg-surface-active"
        >
          <svg aria-hidden="true" className="size-4.5 shrink-0">
            <use href="/icons.svg#github-icon" />
          </svg>
          <span>zerdalu/gib</span>
        </a>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <Separator />
      </div>

      <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 content-start items-start gap-y-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-12 lg:gap-x-12">
        <section aria-labelledby="gib-overview" className="flex flex-col items-start gap-4 lg:col-span-5">
          <span
            id="gib-overview"
            className="border-b-2 border-text-primary pb-1 font-mono text-xs font-ui tracking-mono text-text-primary uppercase"
          >
            Overview
          </span>
          <h1 className="font-display text-4xl font-heading tracking-heading text-text-primary">Gib</h1>
          <p className="font-sans text-sm leading-relaxed text-text-secondary">
            Full-stack edge application template powered by React, Hono, and Cloudflare Workers. Its Base UI and
            Tailwind CSS v4 interface is governed by CSS tokens in{" "}
            <code className="font-mono text-xs text-text-primary">src/index.css</code>.
          </p>
        </section>

        <section
          aria-label="Library stack"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-7"
        >
          {STACK_GROUPS.map((group) => (
            <StackColumn key={group.id} group={group} />
          ))}
        </section>

        <QuickCopy repoUrl={REPO_SSH_URL} className="justify-self-start lg:col-span-12" />
      </main>
    </div>
  );
}

export default App;
