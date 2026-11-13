"use client";

import { useEffect, useState } from "react";
import {
    Alert,
    Banner,
    Button,
    type ToastColors,
    Toaster,
    type ToastOptions,
    toast,
} from "vaiperui";

type Color = "primary" | "success" | "warning" | "danger";

/** Alert or Banner with a close button; after closing, a button brings it back. */
export function DismissibleDemo({
    kind,
    variantColor,
    title,
    text,
    actionLabel,
    restoreLabel,
    dismissLabel,
}: {
    kind: "alert" | "banner";
    variantColor: Color;
    title?: string;
    text: string;
    actionLabel?: string;
    restoreLabel: string;
    dismissLabel: string;
}) {
    const [open, setOpen] = useState(true);
    if (!open) {
        return (
            <Button size="sm" variant="outlined" onClick={() => setOpen(true)}>
                {restoreLabel}
            </Button>
        );
    }
    const action = actionLabel ? (
        <Button size="sm" variant="transparent" variantColor={variantColor}>
            {actionLabel}
        </Button>
    ) : undefined;
    const props = { variantColor, action, dismissLabel, onDismiss: () => setOpen(false) };
    return kind === "alert" ? (
        <Alert {...props} title={title}>
            {text}
        </Alert>
    ) : (
        <Banner {...props}>{text}</Banner>
    );
}

// The Toaster must exist once per page: only the first mounted demo renders it.
let hosts = 0;

/** Buttons that fire toasts; also hosts the page's single `<Toaster />`. */
export function ToastDemo({
    buttons,
    undoLabel,
    dismissLabel,
}: {
    buttons: {
        label: string;
        variantColor?: ToastColors;
        title?: string;
        description: string;
        duration?: number;
        withAction?: boolean;
        customColor?: string;
    }[];
    undoLabel: string;
    dismissLabel: string;
}) {
    const [host, setHost] = useState(false);
    useEffect(() => {
        if (hosts === 0) setHost(true);
        hosts++;
        return () => {
            hosts--;
        };
    }, []);

    return (
        <div className="flex flex-wrap gap-2">
            {host ? <Toaster dismissLabel={dismissLabel} /> : null}
            {buttons.map(({ label, withAction, ...rest }) => {
                const options: ToastOptions = {
                    ...rest,
                    ...(withAction ? { action: { label: undoLabel, onClick: () => {} } } : {}),
                };
                return (
                    <Button
                        key={label}
                        size="sm"
                        variant="outlined"
                        variantColor={rest.variantColor}
                        onClick={() => toast(options)}
                    >
                        {label}
                    </Button>
                );
            })}
        </div>
    );
}
