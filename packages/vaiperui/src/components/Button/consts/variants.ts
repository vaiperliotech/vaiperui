import type { ButtonColors, ButtonVariant } from "../types";

export const variants: Record<ButtonVariant, Record<ButtonColors, string>> = {
    solid: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
        success: "bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500",
        warning: "bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500",
        danger: "bg-danger-500 text-white hover:bg-danger-700 focus-visible:ring-danger-500",
    },
    "solid-inverse": {
        primary: "bg-primary-500 text-white hover:bg-primary-400 focus-visible:ring-primary-500",
        success: "bg-success-500 text-white hover:bg-success-400 focus-visible:ring-success-500",
        warning: "bg-warning-500 text-white hover:bg-warning-400 focus-visible:ring-warning-500",
        danger: "bg-danger-500 text-white hover:bg-danger-400 focus-visible:ring-danger-500",
    },
    outlined: {
        primary:
            "border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-500 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-primary-500/10",
        success:
            "border border-success-300 bg-transparent text-success-700 hover:bg-success-50 focus-visible:ring-success-500 dark:border-success-800 dark:text-success-300 dark:hover:bg-success-500/10",
        warning:
            "border border-warning-300 bg-transparent text-warning-700 hover:bg-warning-50 focus-visible:ring-warning-500 dark:border-warning-800 dark:text-warning-300 dark:hover:bg-warning-500/10",
        danger: "border border-danger-300 bg-transparent text-danger-700 hover:bg-danger-50 focus-visible:ring-danger-500 dark:border-danger-800 dark:text-danger-300 dark:hover:bg-danger-500/10",
    },
    outlined2: {
        primary:
            "border border-primary-500 bg-transparent text-primary-700 hover:bg-primary-500 hover:text-white focus-visible:ring-primary-500 dark:text-primary-300",
        success:
            "border border-success-500 bg-transparent text-success-700 hover:bg-success-500 hover:text-white focus-visible:ring-success-500 dark:text-success-300",
        warning:
            "border border-warning-500 bg-transparent text-warning-700 hover:bg-warning-500 hover:text-white focus-visible:ring-warning-500 dark:text-warning-300",
        danger: "border border-danger-500 bg-transparent text-danger-700 hover:bg-danger-500 hover:text-white focus-visible:ring-danger-500 dark:text-danger-300",
    },
    transparent: {
        primary:
            "bg-transparent text-primary-700 hover:bg-primary-500/20 focus-visible:ring-primary-500 dark:text-primary-300",
        success:
            "bg-transparent text-success-700 hover:bg-success-500/20 focus-visible:ring-success-500 dark:text-success-300",
        warning:
            "bg-transparent text-warning-700 hover:bg-warning-500/20 focus-visible:ring-warning-500 dark:text-warning-300",
        danger: "bg-transparent text-danger-700 hover:bg-danger-500/20 focus-visible:ring-danger-500 dark:text-danger-300",
    },
};
