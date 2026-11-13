"use client";

import { useState } from "react";
import { Tag } from "vaiperui";

// Removable tags need state; `label` builds each remove button's accessible name.
export function TagsDemo({ tags, label }: { tags: string[]; label: string }) {
    const [items, setItems] = useState(tags);

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((tag) => (
                <Tag
                    key={tag}
                    variantColor="primary"
                    dismissLabel={`${label} ${tag}`}
                    onDismiss={() => setItems((all) => all.filter((x) => x !== tag))}
                >
                    {tag}
                </Tag>
            ))}
        </div>
    );
}
