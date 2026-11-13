"use client";

import { useState } from "react";
import { Upload } from "vaiperui";

// The Upload only captures files, so the demo keeps and lists them.
export function UploadDemo({
    label,
    title,
    description,
    emptyText,
}: {
    label: string;
    title: string;
    description: string;
    emptyText: string;
}) {
    const [files, setFiles] = useState<File[]>([]);

    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <Upload
                multiple
                accept=".pdf,image/*"
                label={label}
                title={title}
                description={description}
                onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
            />
            <ul className="flex flex-col gap-1 text-sm text-[var(--vpd-text-secondary)]">
                {files.length === 0 ? (
                    <li className="text-[var(--vpd-text-muted)]">{emptyText}</li>
                ) : (
                    files.map((file, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: the same file can be added twice, so the index is part of the key
                        <li key={`${file.name}-${i}`} className="flex justify-between gap-2">
                            <span className="truncate">{file.name}</span>
                            <span className="shrink-0 text-[var(--vpd-text-muted)]">
                                {Math.max(1, Math.round(file.size / 1024))} KB
                            </span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
