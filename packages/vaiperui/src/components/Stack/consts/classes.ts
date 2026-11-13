export const gapClasses = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
} as const;

export const directionClasses = {
    base: { vertical: "flex-col", horizontal: "flex-row" },
    sm: { vertical: "sm:flex-col", horizontal: "sm:flex-row" },
    md: { vertical: "md:flex-col", horizontal: "md:flex-row" },
    lg: { vertical: "lg:flex-col", horizontal: "lg:flex-row" },
    xl: { vertical: "xl:flex-col", horizontal: "xl:flex-row" },
} as const;

export const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
} as const;

export const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
} as const;
