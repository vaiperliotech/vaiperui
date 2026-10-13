"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

const COMMANDS = {
    npm: "npm install vaiperui",
    pnpm: "pnpm add vaiperui",
    yarn: "yarn add vaiperui",
    bun: "bun add vaiperui",
} as const;

type PackageManager = keyof typeof COMMANDS;
const PACKAGE_MANAGERS = Object.keys(COMMANDS) as PackageManager[];

export type InstallLabels = { packageManager: string; copy: string; copied: string };

export function CopyInstallButton({
    labels,
    compact = false,
}: {
    labels: InstallLabels;
    compact?: boolean;
}) {
    const [pm, setPm] = useState<PackageManager>("npm");
    const [copied, setCopied] = useState(false);
    const command = COMMANDS[pm];

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API unavailable (older browser, insecure context) — the visible command is still copyable by hand.
        }
    }

    if (compact) {
        return (
            <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg border border-line-strong bg-bg-2 px-3.5 py-2 font-mono text-xs text-ink transition-colors duration-150 hover:border-accent-blue hover:bg-bg-3"
            >
                <span className="text-accent-blue">$</span>
                <span>npm i vaiperui</span>
                {copied ? (
                    <CheckIcon className="size-3.5 text-accent-blue" />
                ) : (
                    <CopyIcon className="size-3.5 text-ink-faint" />
                )}
            </button>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-line-strong bg-bg-1">
            <fieldset className="m-0 flex items-center gap-0.5 border-0 border-line border-b px-2 py-1.5 font-mono text-xs">
                <legend className="sr-only">{labels.packageManager}</legend>
                {PACKAGE_MANAGERS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        aria-pressed={pm === key}
                        onClick={() => {
                            setPm(key);
                            setCopied(false);
                        }}
                        className={`cursor-pointer rounded-md px-2.5 py-1 transition-colors duration-150 ${
                            pm === key ? "bg-bg-2 text-ink" : "text-ink-faint hover:text-ink"
                        }`}
                    >
                        {key}
                    </button>
                ))}
            </fieldset>

            <button
                type="button"
                onClick={handleCopy}
                className="group flex w-full items-center justify-between gap-4 px-4 py-3 font-mono text-sm text-ink transition-colors duration-150 hover:bg-bg-2 lg:text-base"
            >
                <span className="truncate">
                    <span className="text-accent-blue">$</span> {command}
                </span>
                <span
                    className={`flex shrink-0 items-center gap-1.5 text-xs transition-colors duration-150 ${copied ? "text-accent-blue" : "text-ink-faint group-hover:text-ink"}`}
                >
                    {copied ? (
                        <>
                            <CheckIcon className="size-3.5" /> {labels.copied}
                        </>
                    ) : (
                        <>
                            <CopyIcon className="size-3.5" /> {labels.copy}
                        </>
                    )}
                </span>
            </button>
        </div>
    );
}
