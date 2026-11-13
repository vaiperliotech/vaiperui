import * as React from "react";

import { cn } from "../../lib/cn";
import type {
    TableCaptionProps,
    TableCellProps,
    TableHeadProps,
    TableProps,
    TableRowProps,
    TableSectionProps,
} from "./types";

export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
    { className, wrapperClassName, striped = false, ...props },
    ref,
) {
    return (
        <div className={cn("w-full overflow-x-auto", wrapperClassName)}>
            <table
                {...props}
                ref={ref}
                className={cn(
                    "w-full border-collapse text-left text-sm text-[var(--vpd-text)]",
                    striped && "[&_tbody_tr:nth-child(even)]:bg-[var(--vpd-surface-muted)]",
                    className,
                )}
            />
        </div>
    );
});

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
    function TableCaption({ className, ...props }, ref) {
        return (
            <caption
                {...props}
                ref={ref}
                className={cn("p-3 text-left text-sm text-[var(--vpd-text-muted)]", className)}
            />
        );
    },
);

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
    function TableHeader({ className, ...props }, ref) {
        return (
            <thead
                {...props}
                ref={ref}
                className={cn("bg-[var(--vpd-surface-muted)]", className)}
            />
        );
    },
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
    function TableBody({ className, ...props }, ref) {
        return (
            <tbody
                {...props}
                ref={ref}
                className={cn("[&_tr:hover]:bg-[var(--vpd-surface-hover)]", className)}
            />
        );
    },
);

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
    { className, ...props },
    ref,
) {
    return (
        <tr
            {...props}
            ref={ref}
            className={cn("border-b border-[var(--vpd-border-soft)]", className)}
        />
    );
});

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
    { className, scope = "col", ...props },
    ref,
) {
    return (
        <th
            {...props}
            ref={ref}
            scope={scope}
            className={cn(
                "px-4 py-3 text-xs font-semibold tracking-wide text-[var(--vpd-text-secondary)]",
                className,
            )}
        />
    );
});

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
    { className, ...props },
    ref,
) {
    return <td {...props} ref={ref} className={cn("px-4 py-3 align-middle", className)} />;
});
