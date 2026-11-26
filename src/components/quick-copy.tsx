import { QuickCopyVariants, type QuickCopyVariant } from "@/variants";
import { CheckIcon, CopyIcon, WarningCircleIcon } from "@phosphor-icons/react";
import {
  Button,
  ButtonSizes,
  ButtonVariants,
  Input,
  InputSizes,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui/index";
import { cn } from "cn";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactElement } from "react";

export type { QuickCopyVariant };

type CopyStatus = "idle" | "copied" | "failed";

interface CopyFeedback {
  readonly status: CopyStatus;
  readonly command: string;
}

const STATUS_RESET_DELAY_MS = 2000;
const DEFAULT_PROJECT_NAME = "my-app";
const IDLE_FEEDBACK: CopyFeedback = {
  status: "idle",
  command: "",
};

export interface QuickCopyProps {
  readonly repoUrl: string;
  readonly defaultName?: string;
  readonly variant?: QuickCopyVariant;
  readonly className?: string;
}

function sanitizeInputValue(raw: string): string {
  return raw
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/^\.+/, "");
}

function resolveProjectName(value: string, fallback: string): string {
  return value.length > 0 ? value : fallback;
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

function resolveTooltipLabel(status: CopyStatus): string {
  switch (status) {
    case "idle":
      return "Copy command";
    case "copied":
      return "Copied";
    case "failed":
      return "Copy failed";
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

function getIconVisibilityClass(active: boolean): string {
  return active
    ? "opacity-100 scale-100 blur-none"
    : "pointer-events-none opacity-0 scale-popup blur-transition motion-reduce:blur-none";
}

function renderStatusIcon(status: CopyStatus, isFeatured: boolean): ReactElement {
  return (
    <span className="relative inline-flex size-4.5 items-center justify-center">
      <CopyIcon
        aria-hidden="true"
        className={cn(
          "absolute size-4.5 transition-icon duration-control ease-ui",
          getIconVisibilityClass(status === "idle"),
        )}
      />
      <CheckIcon
        weight="bold"
        aria-hidden="true"
        className={cn(
          "absolute size-4.5 transition-icon duration-control ease-ui",
          isFeatured ? "text-node-featured-text" : "text-status-success-text",
          getIconVisibilityClass(status === "copied"),
        )}
      />
      <WarningCircleIcon
        aria-hidden="true"
        className={cn(
          "absolute size-4.5 transition-icon duration-control ease-ui",
          isFeatured ? "text-node-featured-danger" : "text-status-danger-text",
          getIconVisibilityClass(status === "failed"),
        )}
      />
    </span>
  );
}

export function QuickCopy({
  repoUrl,
  defaultName = DEFAULT_PROJECT_NAME,
  variant = QuickCopyVariants.Default,
  className,
}: QuickCopyProps): ReactElement {
  const [nameInput, setNameInput] = useState<string>("");
  const [feedback, setFeedback] = useState<CopyFeedback>(IDLE_FEEDBACK);
  const resetTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const isFeatured = variant === QuickCopyVariants.Featured;
  const projectName = resolveProjectName(nameInput, defaultName);
  const command = buildCloneCommand(repoUrl, projectName);
  const status: CopyStatus = feedback.command === command ? feedback.status : "idle";

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
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
    if (!isMountedRef.current) {
      return;
    }

    setFeedback({
      status: copied ? "copied" : "failed",
      command,
    });

    resetTimerRef.current = window.setTimeout(() => {
      setFeedback(IDLE_FEEDBACK);
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
        "inline-flex w-fit max-w-full min-w-0 items-center gap-2 rounded-control border py-1 pr-1 pl-3.5",
        isFeatured
          ? "border-node-featured-well-border bg-node-featured-well text-node-featured-text backdrop-blur-overlay"
          : "border-border-default bg-surface-100 text-text-primary shadow-control",
        className,
      )}
    >
      <div className="-my-0.5 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1 pr-1">
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 font-mono text-xs select-none",
            isFeatured ? "text-node-featured-muted" : "text-text-muted",
          )}
        >
          $
        </span>
        <code
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-xs tracking-mono whitespace-nowrap",
            isFeatured ? "text-node-featured-text" : "text-text-primary",
          )}
        >
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
              className={cn(
                "col-start-1 row-start-1 font-mono tracking-mono shadow-none",
                isFeatured
                  ? "border-node-featured-well-border bg-node-featured-well text-node-featured-text placeholder:text-node-featured-muted hover:border-node-featured-border"
                  : undefined,
              )}
            />
          </span>
          <span>{`&& rm -rf ${projectName}/.git`}</span>
        </code>
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant={ButtonVariants.Ghost}
              size={ButtonSizes.IconSm}
              aria-label={resolveAriaLabel(status)}
              onClick={handleCopyClick}
              className={
                isFeatured
                  ? "text-node-featured-text hover:bg-node-featured-well hover:text-node-featured-text active:bg-node-featured-well"
                  : undefined
              }
            />
          }
        >
          {renderStatusIcon(status, isFeatured)}
        </TooltipTrigger>
        <TooltipContent>{resolveTooltipLabel(status)}</TooltipContent>
      </Tooltip>

      <output aria-live="polite" className="sr-only">
        {resolveLiveMessage(status)}
      </output>
    </div>
  );
}
