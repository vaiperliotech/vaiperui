"use client";

import { useState } from "react";
import { Button, Menu, MenuItem, MenuLabel, MenuSeparator, Modal } from "vaiperui";

type Labels = {
    open: string;
    title: string;
    body: string;
    cancel: string;
    confirm: string;
    closeLabel: string;
};

/** Modal controlled from outside: the parent owns `open` and shows the last answer. */
export function ControlledModalDemo({ labels, doneText }: { labels: Labels; doneText: string }) {
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(false);
    return (
        <div className="flex items-center gap-3">
            <Button onClick={() => setOpen(true)}>{labels.open}</Button>
            {done && <span className="text-sm text-[var(--vpd-text-secondary)]">{doneText}</span>}
            <Modal
                open={open}
                onOpenChange={setOpen}
                title={labels.title}
                closeLabel={labels.closeLabel}
                footer={
                    <>
                        <Button variant="outlined" onClick={() => setOpen(false)}>
                            {labels.cancel}
                        </Button>
                        <Button
                            variantColor="danger"
                            onClick={() => {
                                setDone(true);
                                setOpen(false);
                            }}
                        >
                            {labels.confirm}
                        </Button>
                    </>
                }
            >
                {labels.body}
            </Modal>
        </div>
    );
}

/** Menu whose `onSelect` handlers run on the client and print the chosen action. */
export function MenuSelectDemo({
    trigger,
    items,
    chosen,
    label,
}: {
    trigger: string;
    items: { label: string; destructive?: boolean; disabled?: boolean; icon?: string }[];
    chosen: string;
    label: string;
}) {
    const [last, setLast] = useState<string | null>(null);
    return (
        <div className="flex items-center gap-3">
            <Menu trigger={<Button variant="outlined">{trigger}</Button>} label={label}>
                <MenuLabel>{label}</MenuLabel>
                {items.map((item, i) => (
                    <span key={item.label} className="contents">
                        {item.destructive && i > 0 && <MenuSeparator />}
                        <MenuItem
                            icon={item.icon}
                            destructive={item.destructive}
                            disabled={item.disabled}
                            onSelect={() => setLast(item.label)}
                        >
                            {item.label}
                        </MenuItem>
                    </span>
                ))}
            </Menu>
            {last && (
                <span className="text-sm text-[var(--vpd-text-secondary)]">
                    {chosen}: {last}
                </span>
            )}
        </div>
    );
}
