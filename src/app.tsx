import gibIconUrl from "@/assets/icon.svg";
import { BranchConnector, ConvergeConnector, HorizontalConnector } from "@/components/node-connectors";
import { NodeFrame, type NodePort } from "@/components/node-frame";
import { QuickCopy } from "@/components/quick-copy";
import { NodeFrameVariants, NodePortSides, NodePortTones, QuickCopyVariants } from "@/variants";
import { ArrowUpRightIcon, CpuIcon, StackIcon, TerminalIcon, WrenchIcon } from "@phosphor-icons/react";
import { Button, ButtonSizes, ButtonVariants, Separator } from "@ui/index";
import { cn } from "cn";
import { useState, type CSSProperties, type ReactElement } from "react";

interface StackLibrary {
  readonly index: string;
  readonly name: string;
  readonly href: string;
}

type StackGroupId = "interface" | "state-edge" | "tooling";

interface StackGroup {
  readonly id: StackGroupId;
  readonly title: string;
  readonly items: readonly StackLibrary[];
}

const CloneRepoIds = {
  Gib: "gib",
  GibYt: "gib-yt",
} as const;

type CloneRepoId = (typeof CloneRepoIds)[keyof typeof CloneRepoIds];

interface CloneRepoOption {
  readonly id: CloneRepoId;
  readonly label: string;
  readonly sshUrl: string;
}

const GITHUB_URL = "https://github.com/zerdalu/gib";

const CLONE_REPOS: readonly [CloneRepoOption, CloneRepoOption] = [
  {
    id: CloneRepoIds.Gib,
    label: "gib",
    sshUrl: "git@github.com:zerdalu/gib.git",
  },
  {
    id: CloneRepoIds.GibYt,
    label: "gib-yt",
    sshUrl: "git@github.com:zerdalu/gib-yt.git",
  },
];

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

const STACK_GROUPS: readonly [StackGroup, StackGroup, StackGroup] = [
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

const BRANCH_IDS: readonly [StackGroupId, StackGroupId, StackGroupId] = [
  STACK_GROUPS[0].id,
  STACK_GROUPS[1].id,
  STACK_GROUPS[2].id,
];

const EMBLEM_PORTS: readonly NodePort[] = [{ side: NodePortSides.Right, tone: NodePortTones.Active, id: "emblem-out" }];

const HUB_PORTS: readonly NodePort[] = [
  { side: NodePortSides.Left, tone: NodePortTones.Active, id: "hub-in" },
  { side: NodePortSides.Bottom, tone: NodePortTones.Active, id: "hub-out" },
];

const FEATURED_PORTS: readonly NodePort[] = [{ side: NodePortSides.Top, tone: NodePortTones.Active, id: "clone-in" }];

function renderGroupIcon(groupId: StackGroupId, isActive: boolean): ReactElement {
  const iconClassName = cn(
    "size-4.5 shrink-0 transition-colors duration-overlay ease-ui",
    isActive ? "text-accent-primary" : "text-text-muted",
  );

  switch (groupId) {
    case "interface":
      return <StackIcon aria-hidden="true" className={iconClassName} />;
    case "state-edge":
      return <CpuIcon aria-hidden="true" className={iconClassName} />;
    case "tooling":
      return <WrenchIcon aria-hidden="true" className={iconClassName} />;
    default: {
      const _exhaustive: never = groupId;
      throw new Error(`Unhandled stack group id: ${String(_exhaustive)}`);
    }
  }
}

function resolveGroupIndex(groupId: StackGroupId): number {
  switch (groupId) {
    case "interface":
      return 0;
    case "state-edge":
      return 1;
    case "tooling":
      return 2;
    default: {
      const _exhaustive: never = groupId;
      throw new Error(`Unhandled stack group id: ${String(_exhaustive)}`);
    }
  }
}

function resolveCloneRepo(repoId: CloneRepoId): CloneRepoOption {
  switch (repoId) {
    case CloneRepoIds.Gib:
      return CLONE_REPOS[0];
    case CloneRepoIds.GibYt:
      return CLONE_REPOS[1];
    default: {
      const _exhaustive: never = repoId;
      throw new Error(`Unhandled clone repo id: ${String(_exhaustive)}`);
    }
  }
}

interface StackNodeProps {
  readonly group: StackGroup;
  readonly isActive: boolean;
  readonly onActivate: (id: StackGroupId) => void;
}

function StackNode({ group, isActive, onActivate }: StackNodeProps): ReactElement {
  const portTone = isActive ? NodePortTones.Active : NodePortTones.Muted;
  const ports: readonly NodePort[] = [
    { side: NodePortSides.Top, tone: portTone, id: `${group.id}-in` },
    { side: NodePortSides.Bottom, tone: portTone, id: `${group.id}-out` },
  ];

  const handleActivate = (): void => {
    onActivate(group.id);
  };

  return (
    <section aria-labelledby={`stack-group-${group.id}`} className="flex h-full flex-col">
      <NodeFrame
        active={isActive}
        ports={ports}
        className="h-full"
        contentClassName="flex h-full flex-col gap-2.5 p-panel-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {renderGroupIcon(group.id, isActive)}
            <h2
              id={`stack-group-${group.id}`}
              className="truncate font-display text-sm font-heading tracking-heading text-text-primary"
            >
              {group.title}
            </h2>
          </div>
          <span className="font-mono text-xs text-text-muted tabular-nums">
            {String(group.items.length).padStart(2, "0")}
          </span>
        </div>

        <Separator />

        <ul className="flex flex-col gap-0.5">
          {group.items.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={handleActivate}
                onFocus={handleActivate}
                className="group flex min-h-hit min-w-hit items-center justify-between gap-2 rounded-control px-control-px-sm py-1 text-text-primary focus-ring transition-control duration-control ease-ui hover:bg-accent-subtle hover:text-text-primary active:scale-press active:bg-surface-active"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="font-mono text-xs text-text-muted tabular-nums transition-colors duration-control ease-ui group-hover:text-accent-primary">
                    {item.index}
                  </span>
                  <span className="truncate font-sans text-sm font-ui">{item.name}</span>
                </span>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="size-4.5 shrink-0 text-text-muted transition-[color,translate] duration-control ease-ui group-hover:text-accent-primary motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </NodeFrame>
    </section>
  );
}

interface CloneRepoButtonProps {
  readonly repo: CloneRepoOption;
  readonly isSelected: boolean;
  readonly onSelect: (id: CloneRepoId) => void;
}

function CloneRepoButton({ repo, isSelected, onSelect }: CloneRepoButtonProps): ReactElement {
  const handleClick = (): void => {
    onSelect(repo.id);
  };

  return (
    <Button
      type="button"
      variant={ButtonVariants.Ghost}
      size={ButtonSizes.Xs}
      aria-pressed={isSelected}
      onClick={handleClick}
      className={cn(
        "text-node-featured-muted hover:bg-node-featured-well hover:text-node-featured-text active:bg-node-featured-well",
        "aria-pressed:border-node-featured-border aria-pressed:bg-node-featured-well aria-pressed:text-node-featured-text aria-pressed:shadow-control",
      )}
    >
      {repo.label}
    </Button>
  );
}

export function App(): ReactElement {
  const [activeGroupId, setActiveGroupId] = useState<StackGroupId>("interface");
  const [selectedRepoId, setSelectedRepoId] = useState<CloneRepoId>(CloneRepoIds.Gib);
  const selectedRepo = resolveCloneRepo(selectedRepoId);

  return (
    <div className="flex min-h-dvh flex-col text-text-primary">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 pt-5 pb-3.5 md:px-10 md:pt-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-control-sm items-center justify-center rounded-control border border-node-border bg-node-glass shadow-control backdrop-blur-overlay">
            <span
              aria-hidden="true"
              style={GIB_ICON_MASK_STYLE}
              className="inline-block size-4.5 shrink-0 bg-accent-primary"
            />
          </span>
          <span className="font-mono text-sm font-heading tracking-mono text-text-primary uppercase">Gib</span>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gib repository on GitHub"
          className="inline-flex h-control-md min-h-hit min-w-hit items-center gap-2 rounded-control border border-node-border bg-node-glass px-control-px-md font-mono text-xs font-ui tracking-mono text-text-primary shadow-control focus-ring backdrop-blur-overlay transition-control duration-control ease-ui hover:border-border-strong hover:bg-surface-hover active:scale-press active:bg-surface-active"
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

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-5 md:px-10 md:py-6">
        <div className="my-auto flex w-full flex-col">
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-0">
            <div className="flex flex-col items-center gap-2 lg:col-span-3">
              <NodeFrame
                active
                ports={EMBLEM_PORTS}
                className="w-28"
                contentClassName="flex aspect-square items-center justify-center p-panel-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-full bg-node-glow opacity-45 blur-xl"
                />
                <span
                  aria-hidden="true"
                  style={GIB_ICON_MASK_STYLE}
                  className="relative inline-block size-9 bg-text-primary"
                />
              </NodeFrame>
              <span className="font-mono text-xs tracking-mono text-text-secondary">Edge Template</span>
            </div>

            <HorizontalConnector className="lg:col-span-2" />

            <section aria-labelledby="gib-overview" className="lg:col-span-7">
              <NodeFrame active ports={HUB_PORTS} contentClassName="flex flex-col gap-2.5 p-panel">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex size-control-sm shrink-0 items-center justify-center rounded-control border border-node-border bg-surface-sunken/70">
                    <span
                      aria-hidden="true"
                      style={GIB_ICON_MASK_STYLE}
                      className="inline-block size-4.5 bg-accent-primary"
                    />
                  </span>
                  <h1
                    id="gib-overview"
                    className="font-display text-xl font-heading tracking-heading text-text-primary"
                  >
                    Gib
                  </h1>
                </div>

                <p className="font-sans text-sm leading-relaxed text-text-secondary">
                  Full-stack edge application template powered by React, Hono, and Cloudflare Workers. Its Base UI and
                  Tailwind CSS v4 interface is governed by CSS tokens in{" "}
                  <code className="rounded-control border border-border-subtle bg-surface-sunken/75 px-1.5 py-0.5 font-mono text-xs text-text-primary">
                    src/index.css
                  </code>
                  .
                </p>
              </NodeFrame>
            </section>
          </div>

          <BranchConnector ids={BRANCH_IDS} activeId={activeGroupId} />

          <section aria-label="Library stack" className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-0">
            {STACK_GROUPS.map((group) => (
              <StackNode
                key={group.id}
                group={group}
                isActive={group.id === activeGroupId}
                onActivate={setActiveGroupId}
              />
            ))}
          </section>

          <ConvergeConnector activeIndex={resolveGroupIndex(activeGroupId)} />

          <section aria-labelledby="quick-clone-heading" className="mt-5 w-full sm:sticky sm:bottom-4 sm:z-20 lg:mt-0">
            <NodeFrame
              variant={NodeFrameVariants.Featured}
              ports={FEATURED_PORTS}
              contentClassName="flex flex-col gap-3 p-panel-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="inline-flex size-control-sm shrink-0 items-center justify-center rounded-control border border-node-featured-well-border bg-node-featured-well">
                    <TerminalIcon aria-hidden="true" className="size-4.5 text-node-featured-text" />
                  </span>
                  <h2
                    id="quick-clone-heading"
                    className="font-display text-sm font-heading tracking-heading whitespace-nowrap text-node-featured-text"
                  >
                    Quick Clone
                  </h2>
                </div>

                <fieldset
                  aria-label="Repository"
                  className="min-w-0 shrink-0 rounded-control border border-node-featured-well-border bg-node-featured-well p-0.5 backdrop-blur-overlay"
                >
                  <div className="inline-flex items-center gap-1">
                    {CLONE_REPOS.map((repo) => (
                      <CloneRepoButton
                        key={repo.id}
                        repo={repo}
                        isSelected={repo.id === selectedRepoId}
                        onSelect={setSelectedRepoId}
                      />
                    ))}
                  </div>
                </fieldset>
              </div>

              <QuickCopy variant={QuickCopyVariants.Featured} repoUrl={selectedRepo.sshUrl} className="w-full" />
            </NodeFrame>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
