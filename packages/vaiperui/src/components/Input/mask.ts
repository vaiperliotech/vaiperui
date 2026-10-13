import type { InputMask } from "./types";

export const MASK_DIGIT_LIMIT: Record<InputMask, number> = {
    cpf: 11,
    cnpj: 14,
    cei: 12,
    cep: 8,
    phone: 15,
    creditCard: 16,
    cardExpiry: 4,
    date: 8,
    time: 4,
};

export const MASK_PLACEHOLDER: Record<InputMask, string> = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
    cei: "00.000.00000/00",
    cep: "00000-000",
    phone: "+00 (00) 00000-0000",
    creditCard: "0000 0000 0000 0000",
    cardExpiry: "00/00",
    date: "00/00/0000",
    time: "00:00",
};

// Fills each `0` in the pattern with the next digit and stops at the first missing one, so
// separators never trail the typed value.
function applyPattern(digits: string, pattern: string): string {
    let out = "";
    let next = 0;
    for (const char of pattern) {
        if (next >= digits.length) break;
        out += char === "0" ? digits[next++] : char;
    }
    return out;
}

// The ") " separator is only added once a digit follows it: a trailing separator would be
// re-added by the mask after backspace, so the user could never delete past it.
// Country is read from the leading digits: 55 (Brazil), 1 (NANP: US/Canada), anything else gets a
// "+" and groups of three. ponytail: only these two countries get a local format; add a branch
// per country code (or a `country` prop) if more are needed.
function formatPhone(digits: string): string {
    if (digits.length === 0) return "";
    if (digits.startsWith("55")) {
        const national = digits.slice(2, 13);
        let out = "+55";
        if (national.length > 0) out += ` (${national.slice(0, 2)}`;
        if (national.length > 2) out += ") ";
        const rest = national.slice(2);
        const splitAt = national.length > 10 ? 5 : 4;
        out += rest.slice(0, splitAt);
        if (rest.length > splitAt) out += `-${rest.slice(splitAt, splitAt + 4)}`;
        return out;
    }
    if (digits.startsWith("1")) {
        const national = digits.slice(1, 11);
        let out = "+1";
        if (national.length > 0) out += ` (${national.slice(0, 3)}`;
        if (national.length > 3) out += ") ";
        out += national.slice(3, 6);
        if (national.length > 6) out += `-${national.slice(6, 10)}`;
        return out;
    }
    return `+${digits.replace(/(\d{3})(?=\d)/g, "$1 ")}`;
}

export function onlyDigits(value: string): string {
    return value.replace(/\D/g, "");
}

export function applyMask(digits: string, mask: InputMask): string {
    switch (mask) {
        case "cpf": {
            let out = digits.slice(0, 3);
            if (digits.length > 3) out += `.${digits.slice(3, 6)}`;
            if (digits.length > 6) out += `.${digits.slice(6, 9)}`;
            if (digits.length > 9) out += `-${digits.slice(9, 11)}`;
            return out;
        }
        case "cnpj": {
            let out = digits.slice(0, 2);
            if (digits.length > 2) out += `.${digits.slice(2, 5)}`;
            if (digits.length > 5) out += `.${digits.slice(5, 8)}`;
            if (digits.length > 8) out += `/${digits.slice(8, 12)}`;
            if (digits.length > 12) out += `-${digits.slice(12, 14)}`;
            return out;
        }
        case "cei": {
            let out = digits.slice(0, 2);
            if (digits.length > 2) out += `.${digits.slice(2, 5)}`;
            if (digits.length > 5) out += `.${digits.slice(5, 10)}`;
            if (digits.length > 10) out += `/${digits.slice(10, 12)}`;
            return out;
        }
        case "cep": {
            let out = digits.slice(0, 5);
            if (digits.length > 5) out += `-${digits.slice(5, 8)}`;
            return out;
        }
        case "phone":
            return formatPhone(digits);
        case "creditCard":
            return applyPattern(digits, MASK_PLACEHOLDER.creditCard);
        case "cardExpiry":
            return applyPattern(digits, MASK_PLACEHOLDER.cardExpiry);
        case "date":
            return applyPattern(digits, MASK_PLACEHOLDER.date);
        case "time":
            return applyPattern(digits, MASK_PLACEHOLDER.time);
    }
}
