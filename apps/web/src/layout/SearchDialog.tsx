"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { SearchIcon } from "@/components/icons";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { SearchEntry, SearchKind } from "@/lib/search-index";

type Labels = Dictionary["search"];
type Indexed = SearchEntry & { t: string; h: string };

const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const indexes = new Map<Locale, Promise<Indexed[]>>();

function loadIndex(locale: Locale) {
    let index = indexes.get(locale);
    if (!index) {
        index = fetch(`/${locale}/search-index`)
            .then((response) => response.json() as Promise<SearchEntry[]>)
            .then((entries) =>
                entries.map((entry) => ({
                    ...entry,
                    t: normalize(entry.title),
                    h: normalize(`${entry.parent ?? ""} ${entry.text}`),
                })),
            )
            .catch(() => {
                indexes.delete(locale);
                return [];
            });
        indexes.set(locale, index);
    }
    return index;
}

const KIND_WEIGHT = { component: 1.5, page: 1, section: 0.6, example: 0.5, prop: 0.3 } as const;
// Results are grouped in this order; the arrow keys walk the groups top to bottom.
const KIND_ORDER: SearchKind[] = ["component", "page", "section", "example", "prop"];
const MAX_PER_GROUP = 6;

function search(entries: Indexed[], query: string): Indexed[] {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);

    let ranked: Array<[number, Indexed]>;
    if (tokens.length === 0) {
        // nothing typed: suggest the pages and components
        ranked = entries
            .filter((e) => e.kind === "page" || e.kind === "component")
            .map((entry) => [0, entry]);
    } else {
        ranked = [];
        for (const entry of entries) {
            let score = KIND_WEIGHT[entry.kind];
            let matched = true;
            for (const token of tokens) {
                if (entry.t.startsWith(token)) score += 4;
                else if (entry.t.includes(token)) score += 3;
                else if (entry.h.includes(token)) score += 1;
                else {
                    matched = false;
                    break;
                }
            }
            if (matched) ranked.push([score, entry]);
        }
        ranked.sort((x, y) => y[0] - x[0]);
    }

    return KIND_ORDER.flatMap((kind) =>
        ranked
            .filter(([, entry]) => entry.kind === kind)
            .slice(0, MAX_PER_GROUP)
            .map(([, entry]) => entry),
    );
}

function SearchPanel({
    locale,
    labels,
    onNavigate,
}: {
    locale: Locale;
    labels: Labels;
    onNavigate: (href: string) => void;
}) {
    const listId = useId();
    const [entries, setEntries] = useState<Indexed[]>([]);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        loadIndex(locale).then((loaded) => !cancelled && setEntries(loaded));
        return () => {
            cancelled = true;
        };
    }, [locale]);

    const results = search(entries, query);
    const optionId = (index: number) => `${listId}-${index}`;

    // biome-ignore lint/correctness/useExhaustiveDependencies: active is the trigger, the node comes from the DOM
    useEffect(() => {
        listRef.current?.querySelector(`[id="${optionId(active)}"]`)?.scrollIntoView({
            block: "nearest",
        });
    }, [active]);

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (results.length === 0) return;
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive((current) => (current + step + results.length) % results.length);
        } else if (event.key === "Enter") {
            const target = results[active];
            if (target) {
                event.preventDefault();
                onNavigate(target.href);
            }
        }
    }

    // consecutive results of the same kind share one heading
    let position = -1;
    const groups = KIND_ORDER.map((kind) => ({
        kind,
        items: results.filter((result) => result.kind === kind),
    })).filter((group) => group.items.length > 0);

    return (
        <div>
            <div className="flex items-center gap-3 border-b border-line px-5">
                <SearchIcon className="size-[18px] shrink-0 text-ink-faint" />
                <input
                    // biome-ignore lint/a11y/noAutofocus: the dialog exists only to type in this field
                    autoFocus
                    role="combobox"
                    aria-expanded
                    aria-controls={listId}
                    aria-autocomplete="list"
                    aria-activedescendant={results.length > 0 ? optionId(active) : undefined}
                    aria-label={labels.placeholder}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={labels.placeholder}
                    // 16px keeps iOS from zooming the page when the field gets focus
                    className="h-14 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
                />
                <kbd className="hidden shrink-0 rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-ink-faint sm:block">
                    esc
                </kbd>
            </div>

            <div
                ref={listRef}
                id={listId}
                role="listbox"
                aria-label={labels.trigger}
                className="max-h-[min(26rem,58vh)] overflow-auto p-2 pt-1"
            >
                {query.trim() === "" ? (
                    <p className="px-3 pt-3 pb-1 text-xs text-ink-faint">{labels.hint}</p>
                ) : null}
                {groups.map((group) => (
                    // biome-ignore lint/a11y/useSemanticElements: an ARIA listbox groups its options with role="group"; <fieldset> is for form controls
                    <div key={group.kind} role="group" aria-labelledby={`${listId}-${group.kind}`}>
                        <p
                            id={`${listId}-${group.kind}`}
                            className="px-3 pt-3 pb-1 font-mono text-[10px] text-ink-faint uppercase tracking-wider"
                        >
                            {labels.kinds[group.kind]}
                        </p>
                        {group.items.map((result) => {
                            position += 1;
                            const index = position;
                            const isActive = index === active;
                            return (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard selection happens on the combobox input via aria-activedescendant
                                <div
                                    key={result.href}
                                    id={optionId(index)}
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected={isActive}
                                    onMouseMove={() => setActive(index)}
                                    onClick={() => onNavigate(result.href)}
                                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
                                        isActive ? "bg-bg-2" : ""
                                    }`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className={`truncate text-sm ${
                                                    result.kind === "prop"
                                                        ? "font-mono text-accent-blue"
                                                        : "text-ink"
                                                }`}
                                            >
                                                {result.title}
                                            </span>
                                            {result.parent ? (
                                                <span className="shrink-0 truncate text-xs text-ink-faint">
                                                    {result.parent}
                                                </span>
                                            ) : null}
                                        </div>
                                        {result.summary ? (
                                            <p className="mt-0.5 truncate text-xs text-ink-dim">
                                                {result.summary}
                                            </p>
                                        ) : null}
                                    </div>
                                    <span
                                        aria-hidden="true"
                                        className={`hidden shrink-0 font-mono text-xs text-ink-faint sm:block ${
                                            isActive ? "" : "invisible"
                                        }`}
                                    >
                                        ↵
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {results.length === 0 && entries.length > 0 ? (
                    <p className="px-3 py-10 text-center text-sm text-ink-dim">
                        {labels.empty.replace("{query}", query.trim())}
                    </p>
                ) : null}
            </div>

            <div className="hidden items-center gap-4 border-t border-line px-5 py-2.5 font-mono text-[10px] text-ink-faint sm:flex">
                <span>↑↓ {labels.keys.navigate}</span>
                <span>↵ {labels.keys.open}</span>
                <span>esc {labels.keys.close}</span>
            </div>
        </div>
    );
}

export function SearchDialog({ locale, labels }: { locale: Locale; labels: Labels }) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [modifier, setModifier] = useState("Ctrl");

    useEffect(() => {
        setModifier(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
        function onKeyDown(event: KeyboardEvent) {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setIsOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    // showModal() gives the focus trap, the inert page behind it and the Esc key for free
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) dialog.showModal();
        else if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    function navigate(href: string) {
        setIsOpen(false);
        router.push(href);
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                onPointerEnter={() => loadIndex(locale)}
                onFocus={() => loadIndex(locale)}
                aria-label={labels.trigger}
                aria-keyshortcuts="Control+K Meta+K"
                className="flex h-8 cursor-pointer items-center gap-2 rounded-md border border-line-strong bg-bg-0 px-2.5 font-mono text-xs text-ink-faint transition-colors hover:border-accent-blue/60 hover:text-ink md:w-56 lg:w-64"
            >
                <SearchIcon className="size-3.5 shrink-0" />
                <span className="hidden flex-1 text-left md:block">{labels.trigger}</span>
                <kbd className="hidden rounded border border-line-strong px-1.5 py-px text-[10px] md:block">
                    {modifier} K
                </kbd>
            </button>

            {/* biome-ignore lint/a11y/useKeyWithClickEvents: closing by clicking the backdrop is a pointer shortcut, Esc closes it from the keyboard */}
            <dialog
                ref={dialogRef}
                aria-label={labels.trigger}
                onClose={() => setIsOpen(false)}
                onClick={(event) => {
                    if (event.target === event.currentTarget) setIsOpen(false);
                }}
                className="mx-auto mt-[9vh] mb-auto w-[min(40rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-line-strong bg-bg-1 p-0 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
            >
                {isOpen ? (
                    <SearchPanel locale={locale} labels={labels} onNavigate={navigate} />
                ) : null}
            </dialog>
        </>
    );
}
