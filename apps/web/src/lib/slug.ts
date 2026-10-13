/** `"How to use"` -> `"how-to-use"`; strips accents so `"Instalação"` -> `"instalacao"`. */
export function slugify(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
