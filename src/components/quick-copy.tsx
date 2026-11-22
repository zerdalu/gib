import { CheckIcon, CopyIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button, ButtonSizes, ButtonVariants, Input, InputSizes } from "@ui/index";
import { cn } from "cn";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactElement } from "react";

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_RESET_DELAY_MS = 2000;
const DEFAULT_PROJECT_NAME = "my-app";

export interface QuickCopyProps {
  readonly repoUrl: string;
  readonly defaultName?: string;
  readonly className?: string;
}

function sanitizeInputValue(raw: string): string {
  return raw.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

function resolveProjectName(value: string, fallback: string): string {
  const cleaned = value.replace(/^\.+/, "");
  return cleaned.length > 0 ? cleaned : fallback;
}

function buildCloneCommand(repoUrl: string, projectName: string): string {
  return `git clone --depth 1 ${repoUrl} ${projectName} && rm -rf ${projectName}/.git`;
}

async function writeToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to copy command:", error.message);
    }
    return false;
  }
}

function resolveAriaLabel(status: CopyStatus): string {
  switch (status) {
    case "idle":
      return "Copy command";
    case "copied":
      return "Command copied";
    case "failed":
      return "Copy failed, try again";
    default: {
      const _exhaustive: never = status;
      throw new Error(`Unhandled copy status: ${String(_exhaustive)}`);
    }
  }
}

function resolveLiveMessage(status: CopyStatus): string {
  switch (status) {
    case "idle":
      return "";
    case "copied":
      return "Copied to clipboard";
    case "failed":
      return "Failed to copy to clipboard";
    default: {
      const _exhaustive: never = status;
      throw new Error(`Unhandled copy status: ${String(_exhaustive)}`);
    }
  }
}

function renderStatusIcon(status: CopyStatus): ReactElement {
  switch (status) {
    case "idle":
      return <CopyIcon aria-hidden="true" className="size-4.5" />;
    case "copied":
      return <CheckIcon weight="bold" aria-hidden="true" className="size-4.5 text-status-success-text" />;
    case "failed":
      return <WarningCircleIcon aria-hidden="true" className="size-4.5 text-status-danger-text" />;
    default: {
      const _exhaustive: never = status;
      throw new Error(`Unhandled copy status: ${String(_exhaustive)}`);
    }
  }
}

export function QuickCopy({ repoUrl, defaultName = DEFAULT_PROJECT_NAME, className }: QuickCopyProps): ReactElement {
  const [nameInput, setNameInput] = useState<string>("");
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimerRef = useRef<number | null>(null);

  const projectName = resolveProjectName(nameInput, defaultName);
  const command = buildCloneCommand(repoUrl, projectName);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const copyCommand = async (): Promise<void> => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const copied = await writeToClipboard(command);
    setStatus(copied ? "copied" : "failed");

    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimerRef.current = null;
    }, STATUS_RESET_DELAY_MS);
  };

  const handleCopyClick = (): void => {
    void copyCommand();
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNameInput(sanitizeInputValue(event.target.value));
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      void copyCommand();
    }
  };

  return (
    <div
      className={cn(
        "inline-flex w-fit max-w-full min-w-0 items-center gap-2 rounded-control border border-border-default bg-surface-100 py-0.5 pr-0.5 pl-3 shadow-control",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
        <span aria-hidden="true" className="shrink-0 font-mono text-xs text-text-muted select-none">
          $
        </span>
        <code className="inline-flex items-center gap-1.5 font-mono text-xs tracking-mono whitespace-nowrap text-text-primary">
          <span>{`git clone --depth 1 ${repoUrl}`}</span>
          <span className="inline-grid items-center">
            <span
              aria-hidden="true"
              className="invisible col-start-1 row-start-1 h-control-xs border border-transparent px-control-px-xs font-mono text-xs tracking-mono whitespace-pre"
            >
              {nameInput || defaultName}
            </span>
            <Input
              type="text"
              size={InputSizes.Xs}
              value={nameInput}
              onChange={handleNameChange}
              onKeyDown={handleNameKeyDown}
              placeholder={defaultName}
              aria-label="Project directory name"
              maxLength={48}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              className="col-start-1 row-start-1 font-mono tracking-mono shadow-none"
            />
          </span>
          <span>{`&& rm -rf ${projectName}/.git`}</span>
        </code>
      </div>

      <Button
        type="button"
        variant={ButtonVariants.Ghost}
        size={ButtonSizes.IconSm}
        aria-label={resolveAriaLabel(status)}
        onClick={handleCopyClick}
      >
        {renderStatusIcon(status)}
      </Button>

      <output aria-live="polite" className="sr-only">
        {resolveLiveMessage(status)}
      </output>
    </div>
  );
}
