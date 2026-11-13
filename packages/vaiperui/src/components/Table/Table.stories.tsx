import type { Meta, StoryObj } from "@storybook/react-vite";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table";

const meta = {
    title: "Components/Table",
    component: Table,
    args: { striped: false },
    render: (args) => (
        <Table {...args}>
            <TableCaption>Recent orders</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>#1042</TableCell>
                    <TableCell>Camila Souza</TableCell>
                    <TableCell className="text-right">$120.00</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>#1043</TableCell>
                    <TableCell>Yuki Tanaka</TableCell>
                    <TableCell className="text-right">$89.90</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>#1044</TableCell>
                    <TableCell>Ada Lovelace</TableCell>
                    <TableCell className="text-right">$310.00</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Striped: Story = { args: { striped: true } };
