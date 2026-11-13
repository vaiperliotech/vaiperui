import type { HTMLAttributes, ReactNode } from "react";

import type { ControlAnimation, ControlColors } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type AccordionColors = ControlColors;
export type AccordionAnimation = ControlAnimation;

interface AccordionBaseProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    /** Color of the focus ring. */
    variantColor?: AccordionColors;
    /** Chevron transition. */
    animation?: AccordionAnimation;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
}

export interface AccordionSingleProps extends AccordionBaseProps {
    /** One open section at a time. */
    type: "single";
    /** Lets the open section be closed by clicking it again. */
    collapsible?: boolean;
    value?: string;
    defaultValue?: string;
    /** Receives the open item's value, or "" when closed. */
    onValueChange?: (value: string) => void;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
    /** Any number of sections open. */
    type: "multiple";
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    /** Identifies the section. */
    value: string;
    /** Header content; acts as the expand button. */
    title: ReactNode;
    disabled?: boolean;
}
