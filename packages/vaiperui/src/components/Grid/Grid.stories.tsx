import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid, GridItem } from "./Grid";

const box = "rounded bg-[var(--vpd-surface-muted)] px-3 py-2 text-[var(--vpd-text)]";
const cells = Array.from({ length: 8 }, (_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static demo list
    <GridItem key={i} className={box}>
        {i + 1}
    </GridItem>
));

const meta = {
    title: "Components/Grid",
    component: Grid,
    args: { columns: 4, children: cells },
    argTypes: { gap: { control: "select", options: [0, 1, 2, 3, 4, 6, 8] } },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Responsive: Story = { args: { columns: { base: 1, md: 2, lg: 4 } } };
export const Spans: Story = {
    args: {
        columns: 3,
        children: [
            <GridItem key="a" colSpan={2} className={box}>
                span 2
            </GridItem>,
            <GridItem key="b" rowSpan={2} className={box}>
                rows 2
            </GridItem>,
            <GridItem key="c" className={box}>
                1
            </GridItem>,
            <GridItem key="d" className={box}>
                2
            </GridItem>,
        ],
    },
};
