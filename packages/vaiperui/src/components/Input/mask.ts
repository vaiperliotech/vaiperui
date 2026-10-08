import type { InputMask } from "./types";

export const MASK_DIGIT_LIMIT: Record<InputMask, number> = {
    cpf: 11,
    cnpj: 14,
    cei: 12,
    cep: 8,
    telefone: 11,
};

export const MASK_PLACEHOLDER: Record<InputMask, string> = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
    cei: "00.000.00000/00",
    cep: "00000-000",
    telefone: "(00) 00000-0000",
};

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
        case "telefone": {
            if (digits.length === 0) return "";
            let out = `(${digits.slice(0, 2)}`;
            if (digits.length >= 2) out += ") ";
            const rest = digits.slice(2);
            const isMobile = digits.length > 10;
            const splitAt = isMobile ? 5 : 4;
            out += rest.slice(0, splitAt);
            if (rest.length > splitAt) out += `-${rest.slice(splitAt, splitAt + 4)}`;
            return out;
        }
    }
}
