"use client";

import { Button, Input } from "vaiperui";

export function ButtonDemo({ label }: { label: string }) {
    return <Button variantColor="primary">{label}</Button>;
}

export function ButtonVariants({
    confirm,
    review,
    remove,
}: {
    confirm: string;
    review: string;
    remove: string;
}) {
    return (
        <div className="flex flex-wrap gap-3">
            <Button variantColor="success" radius="full">
                {confirm}
            </Button>
            <Button variant="outlined" variantColor="warning">
                {review}
            </Button>
            <Button variantColor="danger" hover="lift">
                {remove}
            </Button>
        </div>
    );
}

export function InputDemo({ label, mask }: { label: string; mask: "cpf" | "phone" }) {
    return <Input label={label} mask={mask} />;
}
