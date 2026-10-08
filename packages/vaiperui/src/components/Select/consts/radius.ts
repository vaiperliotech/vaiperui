import type { SelectRadius } from "../types";

export const radiusStyles: Record<SelectRadius, { trigger: string; menu: string }> = {
    none: { trigger: "rounded-none", menu: "rounded-none" },
    sm: { trigger: "rounded-sm", menu: "rounded-sm" },
    md: { trigger: "rounded-md", menu: "rounded-md" },
    lg: { trigger: "rounded-lg", menu: "rounded-lg" },
    full: { trigger: "rounded-full", menu: "rounded-2xl" },
};
