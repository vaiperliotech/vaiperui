import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./Slider";

const key = (el: HTMLElement, k: string) => fireEvent.keyDown(el, { key: k });

// jsdom has no layout nor PointerEvent: fake a 0..200px track and dispatch plain mouse events
// under the pointer event names, which is all React reads (clientX, button).
function mockTrack(slider: HTMLElement) {
    const track = slider.closest("[style*='height']")?.firstElementChild as HTMLElement;
    track.getBoundingClientRect = () => ({
        left: 0,
        width: 200,
        right: 200,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => ({}),
    });
    return slider.closest("[style*='height']") as HTMLElement;
}
const pointer = (el: HTMLElement, type: string, clientX: number) =>
    fireEvent(el, new MouseEvent(type, { bubbles: true, clientX, button: 0 }));

describe("Slider", () => {
    it("renders one slider thumb with its aria values, defaulting to min", () => {
        render(<Slider aria-label="Volume" />);
        const thumb = screen.getByRole("slider", { name: "Volume" });
        expect(thumb).toHaveAttribute("aria-valuenow", "0");
        expect(thumb).toHaveAttribute("aria-valuemin", "0");
        expect(thumb).toHaveAttribute("aria-valuemax", "100");
    });

    it("moves with the keyboard and emits arrays", () => {
        const onValueChange = vi.fn();
        const onValueCommit = vi.fn();
        render(
            <Slider
                aria-label="V"
                defaultValue={[40]}
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
            />,
        );
        const thumb = screen.getByRole("slider");
        key(thumb, "ArrowRight");
        expect(onValueChange).toHaveBeenLastCalledWith([41]);
        expect(onValueCommit).toHaveBeenLastCalledWith([41]);
        key(thumb, "ArrowLeft");
        key(thumb, "ArrowDown");
        expect(thumb).toHaveAttribute("aria-valuenow", "39");
        key(thumb, "PageUp");
        expect(thumb).toHaveAttribute("aria-valuenow", "49");
        key(thumb, "Home");
        expect(thumb).toHaveAttribute("aria-valuenow", "0");
        key(thumb, "End");
        expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("respects step and does not go past the limits", () => {
        render(<Slider aria-label="V" min={10} max={20} step={5} defaultValue={[10]} />);
        const thumb = screen.getByRole("slider");
        key(thumb, "ArrowLeft");
        expect(thumb).toHaveAttribute("aria-valuenow", "10");
        key(thumb, "ArrowRight");
        key(thumb, "ArrowRight");
        key(thumb, "ArrowRight");
        expect(thumb).toHaveAttribute("aria-valuenow", "20");
    });

    it("works controlled: the value prop decides", () => {
        const { rerender } = render(
            <Slider aria-label="V" value={[10]} onValueChange={() => {}} />,
        );
        key(screen.getByRole("slider"), "ArrowRight");
        expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "10");
        rerender(<Slider aria-label="V" value={[50]} onValueChange={() => {}} />);
        expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
    });

    it("clamps a value outside min/max", () => {
        render(<Slider aria-label="V" defaultValue={[500]} />);
        expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
    });

    it("sets the value from a pointer press on the track and commits on release", () => {
        const onValueChange = vi.fn();
        const onValueCommit = vi.fn();
        render(
            <Slider aria-label="V" onValueChange={onValueChange} onValueCommit={onValueCommit} />,
        );
        const root = mockTrack(screen.getByRole("slider"));
        pointer(root, "pointerdown", 100);
        expect(onValueChange).toHaveBeenLastCalledWith([50]);
        pointer(root, "pointermove", 150);
        expect(onValueChange).toHaveBeenLastCalledWith([75]);
        expect(onValueCommit).not.toHaveBeenCalled();
        pointer(root, "pointerup", 150);
        expect(onValueCommit).toHaveBeenCalledWith([75]);
        pointer(root, "pointermove", 20);
        expect(onValueChange).toHaveBeenLastCalledWith([75]);
    });

    it("renders two thumbs for an interval, named with thumbLabels or a numbered aria-label", () => {
        const { unmount } = render(<Slider aria-label="Price" defaultValue={[20, 80]} />);
        expect(screen.getByRole("slider", { name: "Price 1" })).toHaveAttribute(
            "aria-valuenow",
            "20",
        );
        expect(screen.getByRole("slider", { name: "Price 2" })).toHaveAttribute(
            "aria-valuenow",
            "80",
        );
        unmount();
        render(
            <Slider
                aria-label="Price"
                thumbLabels={["Minimum price", "Maximum price"]}
                defaultValue={[20, 80]}
            />,
        );
        expect(screen.getByRole("slider", { name: "Minimum price" })).toBeInTheDocument();
        expect(screen.getByRole("slider", { name: "Maximum price" })).toBeInTheDocument();
    });

    it("never lets the thumbs cross and honors minStepsBetweenThumbs", () => {
        const onValueChange = vi.fn();
        render(
            <Slider
                aria-label="P"
                defaultValue={[20, 30]}
                minStepsBetweenThumbs={5}
                onValueChange={onValueChange}
            />,
        );
        const [first, second] = screen.getAllByRole("slider");
        key(first as HTMLElement, "End");
        expect(onValueChange).toHaveBeenLastCalledWith([25, 30]);
        key(second as HTMLElement, "Home");
        expect(onValueChange).toHaveBeenLastCalledWith([25, 30]);
    });

    it("moves the nearest thumb when pressing the track of an interval", () => {
        const onValueChange = vi.fn();
        render(<Slider aria-label="P" defaultValue={[20, 80]} onValueChange={onValueChange} />);
        const root = mockTrack(screen.getAllByRole("slider")[0] as HTMLElement);
        pointer(root, "pointerdown", 180); // 90%: nearer to the second thumb
        expect(onValueChange).toHaveBeenLastCalledWith([20, 90]);
    });

    it("submits every thumb under name and ignores input when disabled", () => {
        const { container, rerender } = render(
            <Slider aria-label="P" name="range" defaultValue={[20, 80]} />,
        );
        expect(
            Array.from(container.querySelectorAll("input[name=range]")).map(
                (i) => (i as HTMLInputElement).value,
            ),
        ).toEqual(["20", "80"]);
        rerender(<Slider aria-label="P" name="range" defaultValue={[20, 80]} disabled />);
        const [first] = screen.getAllByRole("slider");
        key(first as HTMLElement, "ArrowRight");
        expect(first).toHaveAttribute("aria-valuenow", "20");
        expect(first).toHaveAttribute("aria-disabled", "true");
    });
});
