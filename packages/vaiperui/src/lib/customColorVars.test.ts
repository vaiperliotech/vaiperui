import { describe, expect, it } from "vitest";

import { customColorVars } from "./customColorVars";

describe("customColorVars", () => {
    it("uses a string color verbatim in both themes", () => {
        expect(customColorVars("#ff6600")["--vpd-accent" as never]).toBe("#ff6600");
    });

    it("resolves a { light, dark } pair through light-dark()", () => {
        const vars = customColorVars({ light: "#a855f7", dark: "#f472b6" });
        expect(vars["--vpd-accent" as never]).toBe("light-dark(#a855f7, #f472b6)");
    });

    it("tints from the theme surface so the highlight is dark in dark mode", () => {
        const tint = customColorVars("#ff6600")["--vpd-accent-tint" as never] as string;
        expect(tint).toContain("var(--vpd-surface)");
        expect(tint).not.toContain("white");
    });
});
