"use client";

import { type ReactNode, useState } from "react";

import { CheckIcon, CopyIcon } from "@/components/icons";
import { makeT } from "@/data/samples";
import type { Locale } from "@/i18n/config";

export type AppProps = { active: boolean; locale: Locale };

export const fieldClass =
    "h-8 w-full rounded-md border border-line-strong bg-bg-0 px-2 font-mono text-xs text-ink outline-none transition-colors focus:border-accent-blue";

/** The body of a utility window: scrolls on its own, same surface as the games. */
export function Pane({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`h-full overflow-auto bg-bg-1 p-4 text-ink ${className}`}>{children}</div>
    );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-1 block font-mono text-[10px] text-ink-faint uppercase tracking-wider"
        >
            {children}
        </label>
    );
}

export function Select({
    id,
    value,
    options,
    onChange,
}: {
    id?: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
}) {
    return (
        <select
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`${fieldClass} cursor-pointer`}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-ink-dim">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="size-3.5 cursor-pointer accent-accent-blue"
            />
            {label}
        </label>
    );
}

/** A copy button with its own "copied" feedback, in the page's language. */
export function CopyButton({
    text,
    locale,
    label,
}: {
    text: string;
    locale: Locale;
    label?: string;
}) {
    const t = makeT(locale);
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
        } catch {
            // clipboard blocked: the text is still selectable on screen
        }
    }

    return (
        <button
            type="button"
            onClick={copy}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md border border-line-strong bg-bg-2 px-2 py-1 font-mono text-xs transition-colors hover:border-accent-blue ${
                copied ? "text-accent-blue" : "text-ink-faint hover:text-ink"
            }`}
        >
            {copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
            {copied ? t("copied", "copiado", "copiado") : (label ?? t("copy", "copiar", "copiar"))}
        </button>
    );
}

export function Range({
    label,
    value,
    min,
    max,
    step = 1,
    suffix = "",
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    onChange: (value: number) => void;
}) {
    return (
        <label className="flex items-center gap-3 font-mono text-xs text-ink-dim">
            <span className="w-16 shrink-0">{label}</span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-bg-3 accent-accent-blue"
            />
            <span className="w-14 text-right text-ink tabular-nums">
                {value}
                {suffix}
            </span>
        </label>
    );
}
