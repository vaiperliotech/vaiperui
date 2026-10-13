"use client";

import { makeT } from "@/data/samples";
import { hiddenFilesStore, notesStore, trashStore, useStore } from "../stores";
import { type AppProps, Pane } from "./kit";

// What was deleted from the Notes app or the desktop waits here until it is restored or emptied.
export function Trash({ locale }: AppProps) {
    const t = makeT(locale);
    const items = useStore(trashStore);

    function restore(id: number) {
        const item = items.find((entry) => entry.id === id);
        if (!item) return;
        if (item.kind === "note")
            notesStore.set((notes) => [{ id: item.id, text: item.text ?? "" }, ...notes]);
        else if (item.ref)
            hiddenFilesStore.set((hidden) => hidden.filter((name) => name !== item.ref));
        trashStore.set((list) => list.filter((entry) => entry.id !== id));
    }

    return (
        <Pane className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="font-mono text-ink-dim text-xs">
                    {items.length}{" "}
                    {items.length === 1
                        ? t("item", "item", "elemento")
                        : t("items", "itens", "elementos")}
                </p>
                <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={() => trashStore.set([])}
                    className="cursor-pointer rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink-dim transition-colors enabled:hover:border-[#ff5f57]/60 enabled:hover:text-[#ff5f57] disabled:cursor-default disabled:opacity-40"
                >
                    {t("Empty Trash", "Esvaziar lixeira", "Vaciar papelera")}
                </button>
            </div>

            {items.length === 0 ? (
                <p className="py-12 text-center font-mono text-ink-faint text-sm">
                    {t("The Trash is empty.", "A lixeira está vazia.", "La papelera está vacía.")}
                </p>
            ) : (
                <ul className="divide-y divide-line rounded-xl border border-line bg-bg-0">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-3 px-3 py-2.5"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-mono text-ink text-sm">
                                    {item.kind === "note"
                                        ? item.text?.split("\n")[0]?.trim() ||
                                          t("Untitled note", "Nota sem título", "Nota sin título")
                                        : item.name}
                                </p>
                                <p className="font-mono text-[11px] text-ink-faint">
                                    {item.kind === "note"
                                        ? t("Note", "Nota", "Nota")
                                        : t("File", "Arquivo", "Archivo")}
                                </p>
                            </div>
                            <div className="flex shrink-0 gap-2 font-mono text-xs">
                                <button
                                    type="button"
                                    onClick={() => restore(item.id)}
                                    className="cursor-pointer rounded-md border border-line-strong px-2 py-1 text-ink-dim hover:border-accent-blue hover:text-ink"
                                >
                                    {t("Restore", "Restaurar", "Restaurar")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        trashStore.set((list) =>
                                            list.filter((entry) => entry.id !== item.id),
                                        )
                                    }
                                    className="cursor-pointer rounded-md px-2 py-1 text-ink-faint hover:text-[#ff5f57]"
                                >
                                    {t("Delete", "Excluir", "Eliminar")}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Pane>
    );
}
