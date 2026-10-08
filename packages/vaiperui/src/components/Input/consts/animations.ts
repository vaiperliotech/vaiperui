import type { InputAnimation } from "../types";

export const animations: Record<InputAnimation, string> = {
    none: "",
    smooth: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-100 ease-out",
    bounce: "transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
};
