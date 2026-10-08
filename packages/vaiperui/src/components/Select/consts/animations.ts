import type { SelectAnimation } from "../types";

export const animations: Record<SelectAnimation, string> = {
    none: "",
    smooth: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-100 ease-out",
    bounce: "transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
};

export const animationDurations: Record<SelectAnimation, number> = {
    none: 0,
    smooth: 300,
    fast: 100,
    bounce: 300,
};
