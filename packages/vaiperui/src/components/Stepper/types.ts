import type { HTMLAttributes, ReactNode } from "react";

import type { ControlAnimation, ControlColors, ControlSize } from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type StepperColors = ControlColors;
export type StepperSize = ControlSize;
export type StepperAnimation = ControlAnimation;

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "onChange"> {
    /** Zero-based index of the active step. Earlier steps are completed, later ones upcoming. */
    current: number;
    orientation?: "horizontal" | "vertical";
    /** Makes completed steps buttons that call this with their index (to go back). */
    onStepClick?: (index: number) => void;
    /** Screen-reader text added to completed steps, whose check icon is decorative. */
    completedLabel?: string;
    variantColor?: StepperColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: StepperSize;
    animation?: StepperAnimation;
}

export interface StepProps {
    /** The step's label. */
    children: ReactNode;
    /** Secondary line under the label. */
    description?: ReactNode;
    className?: string;
}
