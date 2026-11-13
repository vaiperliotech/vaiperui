import type {
    HTMLAttributes,
    TableHTMLAttributes,
    TdHTMLAttributes,
    ThHTMLAttributes,
} from "react";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
    /** Zebra background on body rows. */
    striped?: boolean;
    /** Classes for the horizontally scrollable wrapper (`className` goes on the `<table>`). */
    wrapperClassName?: string;
}

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;
