import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toaster, toast, useToast } from "./Toast";

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
    act(() => toast.dismiss());
    vi.useRealTimers();
});

describe("Toast", () => {
    it("renders toasts in a labelled region with status roles", () => {
        render(<Toaster label="Alerts" />);
        act(() => {
            toast({ title: "Saved", description: "ok" });
            toast({ variantColor: "danger", description: "bad" });
        });
        const region = screen.getByRole("region", { name: "Alerts" });
        expect(region).toHaveTextContent("Saved");
        expect(screen.getByRole("status")).toHaveTextContent("Saved");
        expect(screen.getByRole("alert")).toHaveTextContent("bad");
    });

    it("auto-dismisses after the duration and calls onClose", () => {
        const onClose = vi.fn();
        render(<Toaster />);
        act(() => void toast({ description: "bye", duration: 1000, onClose }));
        expect(screen.getByText("bye")).toBeInTheDocument();
        act(() => void vi.advanceTimersByTime(999));
        expect(screen.getByText("bye")).toBeInTheDocument();
        act(() => void vi.advanceTimersByTime(1));
        expect(screen.queryByText("bye")).toBeNull();
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("pauses on hover and resumes with the remaining time", () => {
        render(<Toaster />);
        act(() => void toast({ description: "hold", duration: 1000 }));
        const el = screen.getByRole("status");
        act(() => void vi.advanceTimersByTime(600));
        fireEvent.mouseEnter(el);
        act(() => void vi.advanceTimersByTime(5000));
        expect(screen.getByText("hold")).toBeInTheDocument();
        fireEvent.mouseLeave(el);
        act(() => void vi.advanceTimersByTime(399));
        expect(screen.getByText("hold")).toBeInTheDocument();
        act(() => void vi.advanceTimersByTime(1));
        expect(screen.queryByText("hold")).toBeNull();
    });

    it("pauses while focused", () => {
        render(<Toaster />);
        act(
            () =>
                void toast({
                    description: "focus",
                    duration: 500,
                    action: { label: "Go", onClick() {} },
                }),
        );
        fireEvent.focus(screen.getByRole("button", { name: "Go" }));
        act(() => void vi.advanceTimersByTime(2000));
        expect(screen.getByText("focus")).toBeInTheDocument();
    });

    it("stays when duration is 0", () => {
        render(<Toaster />);
        act(() => void toast({ description: "stay", duration: 0 }));
        act(() => void vi.advanceTimersByTime(60000));
        expect(screen.getByText("stay")).toBeInTheDocument();
    });

    it("closes with the close button (custom label), Escape and the action", () => {
        const onClick = vi.fn();
        render(<Toaster dismissLabel="Fechar" />);
        act(() => void toast({ description: "a", duration: 0 }));
        fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
        expect(screen.queryByText("a")).toBeNull();

        act(() => void toast({ description: "b", duration: 0 }));
        fireEvent.keyDown(screen.getByRole("status"), { key: "Escape" });
        expect(screen.queryByText("b")).toBeNull();

        act(
            () => void toast({ description: "c", duration: 0, action: { label: "Undo", onClick } }),
        );
        fireEvent.click(screen.getByRole("button", { name: "Undo" }));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("c")).toBeNull();
    });

    it("hides the close button when dismissible is false", () => {
        render(<Toaster />);
        act(() => void toast({ description: "x", dismissible: false, duration: 0 }));
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("stacks, honors limit, and replaces by id", () => {
        render(<Toaster limit={2} />);
        act(() => {
            toast({ description: "one", duration: 0 });
            toast({ description: "two", duration: 0 });
            toast({ description: "three", duration: 0 });
        });
        expect(screen.queryByText("one")).toBeNull();
        expect(screen.getAllByRole("status")).toHaveLength(2);
        act(() => void toast({ id: "k", description: "v1", duration: 0 }));
        act(() => void toast({ id: "k", description: "v2", duration: 0 }));
        expect(screen.queryByText("v1")).toBeNull();
        expect(screen.getByText("v2")).toBeInTheDocument();
    });

    it("accepts a string, useToast and position classes", () => {
        function Btn() {
            const { toast: show } = useToast();
            return (
                <button type="button" onClick={() => show("hello")}>
                    go
                </button>
            );
        }
        render(
            <>
                <Toaster position="bottom-left" />
                <Btn />
            </>,
        );
        fireEvent.click(screen.getByText("go"));
        expect(screen.getByRole("region").className).toContain("bottom-0");
        expect(screen.getByRole("region").className).toContain("left-0");
        expect(screen.getByText("hello")).toBeInTheDocument();
    });
});
