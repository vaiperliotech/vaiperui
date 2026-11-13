import { cn } from "../../lib/cn";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { customColorVars } from "../../lib/customColorVars";
import { accentOf } from "../Tabs/consts/accent";
import type { PaginationProps } from "./types";

const sizes = {
    sm: "h-7 min-w-7 text-xs",
    md: "h-9 min-w-9 text-sm",
    lg: "h-11 min-w-11 text-base",
};

const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** Page numbers and "start"/"end" ellipses. The item count stays constant while navigating. */
function getItems(page: number, count: number, sibling: number): (number | "start" | "end")[] {
    if (count <= sibling * 2 + 5) return range(1, count);
    const left = Math.max(page - sibling, 1);
    const right = Math.min(page + sibling, count);
    const dotsLeft = left > 3;
    const dotsRight = right < count - 2;
    const edge = 3 + sibling * 2;
    if (!dotsLeft) return [...range(1, edge), "end", count];
    if (!dotsRight) return [1, "start", ...range(count - edge + 1, count)];
    return [1, "start", ...range(left, right), "end", count];
}

const Chevron = ({ flip }: { flip?: boolean }) => (
    <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-4 w-4", flip && "rotate-180")}
    >
        <path d="m8 5 5 5-5 5" />
    </svg>
);

export function Pagination({
    page,
    pageCount,
    onPageChange,
    siblingCount = 1,
    previousLabel = "Previous page",
    nextLabel = "Next page",
    pageLabel = (n) => `Page ${n}`,
    disabled = false,
    variantColor = "primary",
    customColor,
    size = "md",
    radius = "md",
    animation = "smooth",
    className,
    style,
    "aria-label": ariaLabel = "Pagination",
    ...props
}: PaginationProps) {
    const accent = accentOf(variantColor, Boolean(customColor));
    const base = cn(
        "inline-flex cursor-pointer items-center justify-center border border-transparent px-2 font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        controlRadius[radius],
        controlAnimations[animation],
        accent.ring,
    );
    const idle = "text-[var(--vpd-text-secondary)] enabled:hover:bg-[var(--vpd-surface-hover)]";

    return (
        <nav
            aria-label={ariaLabel}
            {...props}
            style={customColor ? { ...customColorVars(customColor), ...style } : style}
            className={className}
        >
            <ul className="flex items-center gap-1">
                <li>
                    <button
                        type="button"
                        aria-label={previousLabel}
                        disabled={disabled || page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className={cn(base, idle)}
                    >
                        <Chevron flip />
                    </button>
                </li>
                {getItems(page, pageCount, siblingCount).map((item) =>
                    typeof item === "string" ? (
                        <li
                            key={item}
                            aria-hidden="true"
                            className={cn(
                                "inline-flex items-center justify-center text-[var(--vpd-text-muted)]",
                                sizes[size],
                            )}
                        >
                            …
                        </li>
                    ) : (
                        <li key={item}>
                            <button
                                type="button"
                                aria-label={pageLabel(item)}
                                aria-current={item === page ? "page" : undefined}
                                disabled={disabled}
                                onClick={() => item !== page && onPageChange(item)}
                                className={cn(base, item === page ? accent.solid : idle)}
                            >
                                {item}
                            </button>
                        </li>
                    ),
                )}
                <li>
                    <button
                        type="button"
                        aria-label={nextLabel}
                        disabled={disabled || page >= pageCount}
                        onClick={() => onPageChange(page + 1)}
                        className={cn(base, idle)}
                    >
                        <Chevron />
                    </button>
                </li>
            </ul>
        </nav>
    );
}
