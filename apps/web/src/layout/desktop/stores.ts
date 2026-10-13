"use client";

import { useSyncExternalStore } from "react";

import { readStored, writeStored } from "./games/shared";

export type Store<T> = {
    initial: T;
    get: () => T;
    set: (next: T | ((current: T) => T)) => void;
    subscribe: (listener: () => void) => () => void;
};

/**
 * A value shared by every window and widget of the desktop, kept in the browser. Unlike
 * `usePersistedState` (one copy per component), everyone reading it sees the same value.
 */
export function createStore<T>(key: string, initial: T): Store<T> {
    let value = initial;
    let loaded = false;
    const listeners = new Set<() => void>();
    const emit = () => {
        for (const listener of listeners) listener();
    };

    // read lazily, on the first use in the browser (never during the server render)
    const load = () => {
        if (loaded) return;
        loaded = true;
        const raw = readStored(`vaiperui:${key}`);
        if (raw === null) return;
        try {
            value = JSON.parse(raw) as T;
            emit();
        } catch {
            // a corrupted value is overwritten by the next change
        }
    };

    return {
        initial,
        get: () => value,
        set(next) {
            load();
            value = typeof next === "function" ? (next as (current: T) => T)(value) : next;
            writeStored(`vaiperui:${key}`, JSON.stringify(value));
            emit();
        },
        subscribe(listener) {
            listeners.add(listener);
            load();
            return () => {
                listeners.delete(listener);
            };
        },
    };
}

export function useStore<T>(store: Store<T>): T {
    return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}

export type Note = { id: number; text: string };
export type TrashItem = {
    id: number;
    kind: "note" | "file";
    name: string;
    text?: string;
    ref?: string;
};

export const notesStore = createStore<Note[]>("notes", [{ id: 1, text: "" }]);
export const trashStore = createStore<TrashItem[]>("trash", []);
/** Positions of the icons the visitor moved; the ones not listed sit in their default column. */
/** Desktop files that went to the Trash, so their icon is not drawn. */
export const hiddenFilesStore = createStore<string[]>("desktop-hidden", []);
export const iconsStore = createStore<Record<string, { x: number; y: number }>>(
    "desktop-icons",
    {},
);
export const widgetsStore = createStore<boolean>("desktop-widgets", true);
