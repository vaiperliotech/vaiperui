import * as React from "react";

import { cn } from "../../lib/cn";
import { customColorVars } from "../../lib/customColorVars";
import { animationDurations, animations } from "./consts/animations";
import { colors, customColorClasses, detailedAccent } from "./consts/colors";
import { detailedSizeStyles } from "./consts/detailedSize";
import { radiusStyles } from "./consts/radius";
import { sizeStyles } from "./consts/sizes";
import type { SelectOption, SelectProps } from "./types";

export function Select({
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = "Select an option",
    emptyMessage = "No options found",
    searchable = false,
    searchPlaceholder = "Search...",
    variant = "default",
    variantColor = "primary",
    customColor,
    size = "md",
    radius = "md",
    animation = "smooth",
    disabled = false,
    name,
    id,
    className,
    style,
    label,
}: SelectProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolledValue;

    const [open, setOpen] = React.useState(false);
    const [closing, setClosing] = React.useState(false);
    const visible = open || closing;

    const [query, setQuery] = React.useState("");
    const filteredOptions = React.useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!searchable || trimmed === "") return options;
        return options.filter((option) => option.label.toLowerCase().includes(trimmed));
    }, [options, searchable, query]);

    const selectedIndex = React.useMemo(
        () => options.findIndex((option) => option.value === currentValue),
        [options, currentValue],
    );
    const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

    const [activeIndex, setActiveIndex] = React.useState(selectedIndex >= 0 ? selectedIndex : 0);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const optionRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const closeTimeout = React.useRef<number | undefined>(undefined);
    const typeahead = React.useRef({ query: "", timeout: 0 });

    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const listboxId = `${selectId}-listbox`;

    const isDetailed = variant === "detailed";
    const color = customColor
        ? customColorClasses
        : isDetailed
          ? detailedAccent
          : colors[variantColor];
    const sizing = sizeStyles[size];
    const detailedSize = detailedSizeStyles[size];
    const radiusStyle = radiusStyles[radius];
    const animationStyle = animations[animation];
    const duration = animationDurations[animation];

    const openList = React.useCallback(
        (startIndex?: number) => {
            if (disabled || options.length === 0) return;
            window.clearTimeout(closeTimeout.current);
            setClosing(false);
            setOpen(true);
            setQuery("");
            setActiveIndex(startIndex ?? (selectedIndex >= 0 ? selectedIndex : 0));
        },
        [disabled, options.length, selectedIndex],
    );

    const closeList = React.useCallback(() => {
        if (!open) return;
        setOpen(false);
        setClosing(true);
        window.clearTimeout(closeTimeout.current);
        closeTimeout.current = window.setTimeout(() => setClosing(false), duration);
    }, [open, duration]);

    const commitValue = React.useCallback(
        (option: SelectOption) => {
            if (option.disabled) return;
            if (!isControlled) setUncontrolledValue(option.value);
            onValueChange?.(option.value);
            closeList();
            triggerRef.current?.focus();
        },
        [closeList, isControlled, onValueChange],
    );

    React.useEffect(() => {
        if (!open) return;
        function handlePointerDown(event: MouseEvent) {
            if (!rootRef.current?.contains(event.target as Node)) closeList();
        }
        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open, closeList]);

    React.useEffect(() => {
        if (!open) return;
        optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    React.useEffect(() => {
        if (open && searchable) {
            const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
            return () => window.cancelAnimationFrame(frame);
        }
    }, [open, searchable]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: query is only a re-run trigger here, not read in the body
    React.useEffect(() => {
        if (searchable) setActiveIndex(0);
    }, [query, searchable]);

    React.useEffect(() => () => window.clearTimeout(closeTimeout.current), []);

    function moveActive(direction: 1 | -1) {
        setActiveIndex((current) => {
            let next = current;
            for (let step = 0; step < filteredOptions.length; step++) {
                next += direction;
                if (next < 0 || next >= filteredOptions.length) break;
                const candidate = filteredOptions[next];
                if (candidate && !candidate.disabled) return next;
            }
            return current;
        });
    }

    function jumpActive(edge: "first" | "last") {
        const indices = filteredOptions.map((_, index) => index);
        const ordered = edge === "first" ? indices : [...indices].reverse();
        const target = ordered.find((index) => !filteredOptions[index]?.disabled);
        if (target !== undefined) setActiveIndex(target);
    }

    function handleTypeahead(char: string) {
        window.clearTimeout(typeahead.current.timeout);
        typeahead.current.query += char.toLowerCase();
        const startFrom = open ? activeIndex + 1 : 0;
        const ordered = [
            ...filteredOptions.slice(startFrom),
            ...filteredOptions.slice(0, startFrom),
        ];
        const match = ordered.find(
            (option) =>
                !option.disabled && option.label.toLowerCase().startsWith(typeahead.current.query),
        );
        if (match) {
            const matchIndex = filteredOptions.indexOf(match);
            if (open) setActiveIndex(matchIndex);
            else openList(matchIndex);
        }
        typeahead.current.timeout = window.setTimeout(() => {
            typeahead.current.query = "";
        }, 500);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        if (disabled) return;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!open) openList();
                else moveActive(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                if (!open) openList();
                else moveActive(-1);
                break;
            case "Home":
                if (open) {
                    event.preventDefault();
                    jumpActive("first");
                }
                break;
            case "End":
                if (open) {
                    event.preventDefault();
                    jumpActive("last");
                }
                break;
            case "Enter":
            case " ": {
                event.preventDefault();
                const activeOption = filteredOptions[activeIndex];
                if (!open) openList();
                else if (activeOption) commitValue(activeOption);
                break;
            }
            case "Escape":
                if (open) {
                    event.preventDefault();
                    closeList();
                }
                break;
            case "Tab":
                if (open) closeList();
                break;
            default:
                if (!searchable && event.key.length === 1 && /\S/.test(event.key)) {
                    handleTypeahead(event.key);
                }
        }
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                moveActive(1);
                break;
            case "ArrowUp":
                event.preventDefault();
                moveActive(-1);
                break;
            case "Home":
                event.preventDefault();
                jumpActive("first");
                break;
            case "End":
                event.preventDefault();
                jumpActive("last");
                break;
            case "Enter": {
                event.preventDefault();
                const activeOption = filteredOptions[activeIndex];
                if (activeOption) commitValue(activeOption);
                break;
            }
            case "Escape":
                event.preventDefault();
                closeList();
                triggerRef.current?.focus();
                break;
            case "Tab":
                closeList();
                break;
        }
    }

    const noMatches = filteredOptions.length === 0;
    const emptyText =
        searchable && query.trim() !== "" ? `No results for "${query.trim()}"` : emptyMessage;

    return (
        <div
            className="inline-flex flex-col gap-1.5"
            ref={rootRef}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
        >
            {label ? (
                <label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-medium text-[var(--vpd-text-secondary)] select-none",
                        disabled && "cursor-not-allowed opacity-50",
                    )}
                >
                    {label}
                </label>
            ) : null}
            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    id={selectId}
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-activedescendant={
                        open && !searchable && filteredOptions[activeIndex]
                            ? `${listboxId}-option-${activeIndex}`
                            : undefined
                    }
                    disabled={disabled}
                    onClick={() => (open ? closeList() : openList())}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        `flex w-full min-w-40 items-center justify-between gap-2 border bg-[var(--vpd-surface)] text-left text-[var(--vpd-text-secondary)] ${animationStyle} ${radiusStyle.trigger} ${sizing.trigger}`,
                        isDetailed &&
                            "rounded-xl bg-[var(--vpd-surface-muted)] text-[var(--vpd-text)]",
                        open
                            ? color.borderOpen
                            : isDetailed
                              ? "border-[var(--vpd-border-soft)] hover:border-[var(--vpd-border)]"
                              : "border-[var(--vpd-border)] hover:border-[var(--vpd-border-strong)]",
                        `focus-visible:outline-none focus-visible:ring-4 ${color.ring}`,
                        disabled &&
                            "cursor-not-allowed bg-[var(--vpd-surface-muted)] text-[var(--vpd-text-placeholder)] opacity-60 hover:border-[var(--vpd-border)]",
                        className,
                    )}
                >
                    <span className={cn("flex min-w-0 items-center gap-2", isDetailed && "gap-3")}>
                        {isDetailed && selectedOption?.leading ? (
                            <span
                                className={cn(
                                    "flex shrink-0 items-center justify-center",
                                    detailedSize.triggerLeading,
                                )}
                            >
                                {selectedOption.leading}
                            </span>
                        ) : null}
                        <span
                            className={cn(
                                "truncate",
                                !selectedOption && "text-[var(--vpd-text-placeholder)]",
                            )}
                        >
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </span>
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                        className={cn(
                            `shrink-0 text-[var(--vpd-text-placeholder)] ${animationStyle}`,
                            sizing.chevron,
                            isDetailed && "text-[var(--vpd-text-muted)]",
                            open && "rotate-180",
                        )}
                    >
                        <path
                            d="M5.5 7.5l4.5 4.5 4.5-4.5"
                            stroke="currentColor"
                            strokeWidth={1.75}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {visible ? (
                    <div
                        className={cn(
                            `absolute z-50 mt-2 w-full origin-top overflow-hidden border border-[var(--vpd-border-soft)] bg-[var(--vpd-surface)] shadow-lg ${animationStyle} ${radiusStyle.menu}`,
                            isDetailed &&
                                "mt-3 rounded-2xl border-[var(--vpd-border-soft)] shadow-[0_12px_24px_0_rgba(15,23,42,0.05)]",
                            open
                                ? "scale-100 opacity-100"
                                : "pointer-events-none scale-95 opacity-0",
                        )}
                    >
                        {searchable ? (
                            <div
                                className={cn(
                                    "border-b border-[var(--vpd-border-subtle)] p-1.5",
                                    isDetailed && "border-[var(--vpd-border-soft)] p-0",
                                )}
                            >
                                <div className="relative">
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        aria-hidden="true"
                                        className={cn(
                                            "pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--vpd-text-placeholder)]",
                                            isDetailed &&
                                                "left-4 h-4.5 w-4.5 text-[var(--vpd-text-muted)]",
                                        )}
                                    >
                                        <circle
                                            cx="9"
                                            cy="9"
                                            r="6"
                                            stroke="currentColor"
                                            strokeWidth={1.75}
                                        />
                                        <path
                                            d="M17 17l-4.35-4.35"
                                            stroke="currentColor"
                                            strokeWidth={1.75}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={query}
                                        onChange={handleSearchChange}
                                        onKeyDown={handleSearchKeyDown}
                                        placeholder={searchPlaceholder}
                                        aria-label={searchPlaceholder}
                                        aria-controls={listboxId}
                                        aria-activedescendant={
                                            filteredOptions[activeIndex]
                                                ? `${listboxId}-option-${activeIndex}`
                                                : undefined
                                        }
                                        className={cn(
                                            "w-full rounded-sm border-none bg-[var(--vpd-surface-muted)] py-1.5 pr-7 pl-7 text-sm text-[var(--vpd-text-secondary)] outline-none placeholder:text-[var(--vpd-text-placeholder)]",
                                            isDetailed &&
                                                "h-13 rounded-none bg-[var(--vpd-surface)] py-0 pr-10 pl-11 text-sm text-[var(--vpd-text)]",
                                        )}
                                    />
                                    {query ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setQuery("");
                                                searchInputRef.current?.focus();
                                            }}
                                            aria-label="Clear search"
                                            className={cn(
                                                "absolute top-1/2 right-1.5 -translate-y-1/2 rounded-sm p-0.5 text-[var(--vpd-text-placeholder)] hover:text-[var(--vpd-text-secondary)]",
                                                isDetailed && "right-4",
                                            )}
                                        >
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                aria-hidden="true"
                                                className="h-3.5 w-3.5"
                                            >
                                                <path
                                                    d="M6 6l8 8M14 6l-8 8"
                                                    stroke="currentColor"
                                                    strokeWidth={1.75}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        <div
                            id={listboxId}
                            role="listbox"
                            className={cn(
                                "max-h-60 overflow-auto p-1",
                                isDetailed && "flex flex-col gap-1 p-2",
                            )}
                        >
                            {noMatches ? (
                                <div
                                    role="presentation"
                                    className={cn(
                                        "text-[var(--vpd-text-placeholder)]",
                                        isDetailed ? detailedSize.option : sizing.option,
                                    )}
                                >
                                    {emptyText}
                                </div>
                            ) : (
                                filteredOptions.map((option, index) => {
                                    const isSelected = option.value === currentValue;
                                    const isActive = index === activeIndex;
                                    return (
                                        // biome-ignore lint/a11y/useKeyWithClickEvents: selection is driven by keyboard on the combobox trigger (or the search field) via aria-activedescendant; this row is a pointer-only affordance
                                        <div
                                            key={option.value}
                                            id={`${listboxId}-option-${index}`}
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected={isSelected}
                                            aria-disabled={option.disabled}
                                            ref={(node) => {
                                                optionRefs.current[index] = node;
                                            }}
                                            onMouseEnter={() =>
                                                !option.disabled && setActiveIndex(index)
                                            }
                                            onClick={() => commitValue(option)}
                                            className={cn(
                                                `flex items-center justify-between gap-2 rounded-sm ${sizing.option}`,
                                                isDetailed && `rounded-xl ${detailedSize.option}`,
                                                option.disabled
                                                    ? "cursor-not-allowed text-[var(--vpd-text-disabled)]"
                                                    : "cursor-pointer",
                                                !option.disabled &&
                                                    isActive &&
                                                    color.optionActiveBg,
                                                !option.disabled &&
                                                    isDetailed &&
                                                    isSelected &&
                                                    color.optionActiveBg,
                                                !option.disabled &&
                                                    isSelected &&
                                                    !isDetailed &&
                                                    `font-medium ${color.optionSelectedText}`,
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex min-w-0 items-center gap-2",
                                                    isDetailed && "gap-3",
                                                )}
                                            >
                                                {isDetailed && option.leading ? (
                                                    <span
                                                        className={cn(
                                                            "flex shrink-0 items-center justify-center",
                                                            detailedSize.leading,
                                                        )}
                                                    >
                                                        {option.leading}
                                                    </span>
                                                ) : null}
                                                <span className="flex min-w-0 flex-col">
                                                    <span
                                                        className={cn(
                                                            "truncate",
                                                            isDetailed &&
                                                                `${detailedSize.label} ${
                                                                    option.disabled
                                                                        ? "text-[var(--vpd-text-disabled)]"
                                                                        : "text-[var(--vpd-text)]"
                                                                }`,
                                                        )}
                                                    >
                                                        {option.label}
                                                    </span>
                                                    {isDetailed && option.description ? (
                                                        <span
                                                            className={cn(
                                                                "truncate",
                                                                detailedSize.description,
                                                                option.disabled
                                                                    ? "text-[var(--vpd-text-disabled)]"
                                                                    : "text-[var(--vpd-text-muted)]",
                                                            )}
                                                        >
                                                            {option.description}
                                                        </span>
                                                    ) : null}
                                                </span>
                                            </span>
                                            {isSelected ? (
                                                <svg
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    aria-hidden="true"
                                                    className={cn(
                                                        "h-3.5 w-3.5 shrink-0",
                                                        isDetailed &&
                                                            `h-4.5 w-4.5 ${color.optionSelectedText}`,
                                                    )}
                                                >
                                                    <path
                                                        d="M3.5 8.5l3 3 6-7"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : null}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
            {name ? <input type="hidden" name={name} value={currentValue ?? ""} /> : null}
        </div>
    );
}
