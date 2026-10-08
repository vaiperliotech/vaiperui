import type { SelectSize } from "../types";

export const sizeStyles: Record<SelectSize, { trigger: string; option: string; chevron: string }> =
    {
        sm: {
            trigger: "h-8 px-3 text-sm",
            option: "px-3 py-1.5 text-sm",
            chevron: "h-3.5 w-3.5",
        },
        md: {
            trigger: "h-10 px-4 text-sm",
            option: "px-4 py-2 text-sm",
            chevron: "h-4 w-4",
        },
        lg: {
            trigger: "h-12 px-6 text-base",
            option: "px-5 py-2.5 text-base",
            chevron: "h-5 w-5",
        },
    };
