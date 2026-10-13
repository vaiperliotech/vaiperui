"use client";

import { useState } from "react";

import { makeT } from "@/data/samples";
import { usePersistedState } from "../games/shared";
import { type AppProps, Pane } from "./kit";

type Note = { id: number; text: string };

// Several notes, saved in the browser as you type.
export function Notes({ locale }: AppProps) {
    const t = makeT(locale);
    const [notes, setNotes] = usePersistedState<Note[]>("notes", [{ id: 1, text: "" }]);
    const [selected, setSelected] = useState(1);
    const note = notes.find((item) => item.id === selected) ?? notes[0];
    const text = note?.text ?? "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    function add() {
        const id = Date.now();
        setNotes((list) => [{ id, text: "" }, ...list]);
        setSelected(id);
    }

    function remove() {
        if (!note) return;
        const rest = notes.filter((item) => item.id !== note.id);
        const next = rest.length > 0 ? rest : [{ id: Date.now(), text: "" }];
        setNotes(next);
        setSelected(next[0]?.id ?? 0);
    }

    return (
        <Pane className="flex gap-3 p-0">
            <div className="flex w-44 shrink-0 flex-col border-line border-r bg-bg-2/50">
                <button
                    type="button"
                    onClick={add}
                    className="m-2 cursor-pointer rounded-md border border-line-strong px-2 py-1.5 text-left font-mono text-xs text-ink-dim transition-colors hover:border-accent-blue/60 hover:text-ink"
                >
                    + {t("New note", "Nova nota", "Nueva nota")}
                </button>
                <ul className="min-h-0 flex-1 overflow-auto px-2 pb-2">
                    {notes.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                aria-current={item.id === note?.id}
                                onClick={() => setSelected(item.id)}
                                className={`mb-1 block w-full cursor-pointer truncate rounded-md px-2 py-1.5 text-left text-xs ${
                                    item.id === note?.id
                                        ? "bg-bg-3 text-ink"
                                        : "text-ink-dim hover:bg-bg-2"
                                }`}
                            >
                                {item.text.split("\n")[0]?.trim() ||
                                    t("Untitled", "Sem título", "Sin título")}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-3 pl-0">
                <textarea
                    value={text}
                    onChange={(event) =>
                        setNotes((list) =>
                            list.map((item) =>
                                item.id === note?.id ? { ...item, text: event.target.value } : item,
                            ),
                        )
                    }
                    placeholder={t("Write something…", "Escreva alguma coisa…", "Escribe algo…")}
                    aria-label={t("Note", "Nota", "Nota")}
                    spellCheck={false}
                    className="min-h-0 w-full flex-1 resize-none rounded-lg border border-line bg-bg-0 p-3 text-sm text-ink leading-6 outline-none placeholder:text-ink-faint focus:border-accent-blue"
                />
                <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-faint">
                    <span>
                        {words} {t("words", "palavras", "palabras")} · {text.length}{" "}
                        {t("characters", "caracteres", "caracteres")}
                    </span>
                    <button
                        type="button"
                        onClick={remove}
                        className="cursor-pointer hover:text-[#ff5f57]"
                    >
                        {t("Delete", "Excluir", "Eliminar")}
                    </button>
                </div>
            </div>
        </Pane>
    );
}
