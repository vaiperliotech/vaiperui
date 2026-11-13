import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import { Modal, ModalClose } from "./Modal";

const meta = {
    title: "Components/Modal",
    component: Modal,
    args: {
        title: "Delete project",
        children: "This action cannot be undone. All data will be removed.",
        trigger: <Button>Open modal</Button>,
    },
    argTypes: {
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooter: Story = {
    args: {
        footer: (
            <>
                <ModalClose>
                    <Button variant="outlined">Cancel</Button>
                </ModalClose>
                <ModalClose>
                    <Button variantColor="danger">Delete</Button>
                </ModalClose>
            </>
        ),
    },
};

export const Large: Story = { args: { size: "lg" } };

export const Persistent: Story = {
    args: {
        closeOnEscape: false,
        closeOnBackdropClick: false,
        showClose: false,
        ...WithFooter.args,
    },
};
