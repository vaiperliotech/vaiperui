import type { InputHTMLAttributes, ReactNode } from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type UploadColors = ControlColors;
export type UploadSize = ControlSize;
export type UploadRadius = ControlRadius;
export type UploadAnimation = ControlAnimation;

export interface UploadProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "size" | "color" | "type" | "title" | "value" | "defaultValue" | "onChange" | "children"
    > {
    /**
     * Called with the files the user just chose, never with the sum of earlier choices: merge them
     * into your own state to accumulate. The Upload only captures files, listing, validating the
     * size and sending them is up to you.
     */
    onFilesChange: (files: File[]) => void;
    /** Main text of the area. */
    title?: ReactNode;
    /** Support text, e.g. the accepted formats and size. */
    description?: ReactNode;
    /** Accepted types: `.pdf`, `image/*`, `image/png`, comma-separated. Also filters dragged files. */
    accept?: string;
    /** Accepts several files. Without it, only the first file of a selection is kept. */
    multiple?: boolean;
    /** Label above the area. */
    label?: string;
    helperText?: string;
    /** Error text under the area; its presence alone forces the error state. */
    errorMessage?: string;
    variantColor?: UploadColors;
    /** A CSS color, or a `{ light, dark }` pair for per-theme colors. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: UploadSize;
    radius?: UploadRadius;
    animation?: UploadAnimation;
}
