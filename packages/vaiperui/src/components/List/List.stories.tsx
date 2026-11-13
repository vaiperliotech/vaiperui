import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";
import { List, ListItem } from "./List";

const meta = {
    title: "Components/List",
    component: List,
    decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <List {...args}>
            <ListItem title="Camila Souza" description="Product designer" />
            <ListItem title="Yuki Tanaka" description="Engineer" />
        </List>
    ),
};

export const Divided: Story = {
    args: { divided: true },
    render: (args) => (
        <List {...args}>
            <ListItem title="Camila Souza" description="Product designer" />
            <ListItem title="Yuki Tanaka" description="Engineer" />
        </List>
    ),
};

export const WithLeadingAndTrailing: Story = {
    args: { divided: true },
    render: (args) => (
        <List {...args}>
            <ListItem
                leading={<Avatar name="Camila Souza" />}
                title="Camila Souza"
                description="Product designer"
                trailing={<Badge status="success">Active</Badge>}
            />
            <ListItem
                leading={<Avatar name="Yuki Tanaka" />}
                title="Yuki Tanaka"
                description="Engineer"
                trailing={<Badge status="pending">Pending</Badge>}
            />
        </List>
    ),
};
