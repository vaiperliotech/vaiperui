"use client";

import { useState } from "react";
import { Button, Pagination, Step, Stepper } from "vaiperui";

type PaginationLabels = { nav: string; previous: string; next: string; page: string };

/** `page` is a template such as "Page {n}", since functions cannot cross the server boundary. */
export function PaginationDemo({
    labels,
    pageCount = 20,
    initialPage = 1,
    ...style
}: {
    labels: PaginationLabels;
    pageCount?: number;
    initialPage?: number;
    variantColor?: "primary" | "success" | "warning" | "danger";
    customColor?: string;
    size?: "sm" | "md" | "lg";
    radius?: "none" | "sm" | "md" | "lg" | "full";
    siblingCount?: number;
}) {
    const [page, setPage] = useState(initialPage);
    return (
        <Pagination
            {...style}
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            aria-label={labels.nav}
            previousLabel={labels.previous}
            nextLabel={labels.next}
            pageLabel={(n) => labels.page.replace("{n}", String(n))}
        />
    );
}

export function StepperDemo({
    steps,
    label,
    back,
    next,
    completed,
}: {
    steps: string[];
    label: string;
    back: string;
    next: string;
    completed: string;
}) {
    const [current, setCurrent] = useState(1);
    return (
        <div className="flex w-full max-w-xl flex-col gap-5">
            <Stepper
                current={current}
                aria-label={label}
                completedLabel={completed}
                onStepClick={setCurrent}
            >
                {steps.map((step) => (
                    <Step key={step}>{step}</Step>
                ))}
            </Stepper>
            <div className="flex gap-2">
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={current === 0}
                    onClick={() => setCurrent((c) => c - 1)}
                >
                    {back}
                </Button>
                <Button
                    size="sm"
                    disabled={current === steps.length}
                    onClick={() => setCurrent((c) => c + 1)}
                >
                    {next}
                </Button>
            </div>
        </div>
    );
}
