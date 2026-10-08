import type { SelectSize } from "../types";

/**
 * `variant="detailed"` reuses the same trigger height/chevron size as `sizeStyles` — both
 * styles line up at a given `size` step. Only the option-row internals (and the trigger's own
 * leading-slot size) differ here, since `detailed` rows carry an extra leading slot and
 * description line that `default` lacks.
 */
export const detailedSizeStyles: Record<
    SelectSize,
    {
        option: string;
        leading: string;
        triggerLeading: string;
        label: string;
        description: string;
    }
> = {
    sm: {
        option: "px-3 py-2",
        leading: "size-8",
        triggerLeading: "size-5",
        label: "text-sm",
        description: "text-xs",
    },
    md: {
        option: "px-4 py-3",
        leading: "size-9",
        triggerLeading: "size-6",
        label: "text-sm",
        description: "text-xs",
    },
    lg: {
        option: "px-5 py-4",
        leading: "size-10",
        triggerLeading: "size-7",
        label: "text-base",
        description: "text-sm",
    },
};
