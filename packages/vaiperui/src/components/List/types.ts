import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
    /** Draws a line between items. */
    divided?: boolean;
}

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title"> {
    /** The item's heading. */
    title: ReactNode;
    /** Supporting text under the title. */
    description?: ReactNode;
    /** Element before the text, such as an Avatar or icon. */
    leading?: ReactNode;
    /** Element at the end of the row, such as a Badge or button. */
    trailing?: ReactNode;
}
