import type { Locale } from "./config";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { pt } from "./messages/pt";

export type { Dictionary } from "./messages/en";

const dictionaries = { en, pt, es };

export function getDictionary(locale: Locale) {
    return dictionaries[locale];
}
