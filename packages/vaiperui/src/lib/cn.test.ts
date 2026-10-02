import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
    it("joins multiple class strings", () => {
        expect(cn("flex", "items-center")).toBe("flex items-center");
    });

    it("keeps the last class on conflict", () => {
        expect(cn("text-sm", "text-base")).toBe("text-base");
    });

    it("resolves conflicts across custom theme tokens", () => {
        expect(cn("bg-primary-600", "bg-danger-500")).toBe("bg-danger-500");
    });

    it("ignores falsy values and supports clsx objects", () => {
        expect(cn("flex", false, null, undefined, { "items-center": true, "sr-only": false })).toBe(
            "flex items-center",
        );
    });
});
