import type { HTMLAttributes, ReactNode } from "react";

import type { ControlAnimation, ControlColors, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type TabsColors = ControlColors;
export type TabsSize = ControlSize;
export type TabsAnimation = ControlAnimation;

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
    /** Active tab (controlled). */
    value?: string;
    /** Initial active tab (uncontrolled). Set it, or no tab is reachable by keyboard. */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Direction of the tab list; also the arrow keys that move between tabs. */
    orientation?: "horizontal" | "vertical";
    /** `auto` activates a tab when it receives focus; `manual` waits for Enter or Space. */
    activation?: "auto" | "manual";
    variantColor?: TabsColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: TabsSize;
    animation?: TabsAnimation;
}

export type TabListProps = HTMLAttributes<HTMLDivElement>;

export interface TabProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
    /** Pairs the tab with the `TabPanel` that has the same value. */
    value: string;
    /** Icon placed before the label. */
    icon?: ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
}
