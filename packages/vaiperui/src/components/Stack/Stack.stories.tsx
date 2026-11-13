import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "../Divider/Divider";
import { Stack } from "./Stack";

const box = "rounded bg-[var(--vpd-surface-muted)] px-3 py-2 text-[var(--vpd-text)]";

const meta = {
    title: "Components/Stack",
    component: Stack,
    args: {
        children: ["One", "Two", "Three"].map((n) => (
            <div key={n} className={box}>
                {n}
            </div>
        )),
    },
    argTypes: {
        direction: { control: "select", options: ["vertical", "horizontal"] },
        gap: { control: "select", options: [0, 1, 2, 3, 4, 6, 8] },
        align: { control: "select", options: ["start", "center", "end", "stretch", "baseline"] },
        justify: {
            control: "select",
            options: ["start", "center", "end", "between", "around", "evenly"],
        },
    },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Horizontal: Story = { args: { direction: "horizontal", align: "center" } };
export const Responsive: Story = { args: { direction: { base: "vertical", md: "horizontal" } } };
export const WithDivider: Story = {
    args: { direction: "horizontal", align: "center", divider: <Divider orientation="vertical" /> },
};
