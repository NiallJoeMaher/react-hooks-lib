import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToggle } from "../useToggle";

describe("useToggle", () => {
  it("should initialize with default value (false)", () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBe(false);
    expect(typeof result.current[1].toggle).toBe("function");
    expect(typeof result.current[1].setTrue).toBe("function");
    expect(typeof result.current[1].setFalse).toBe("function");
    expect(typeof result.current[1].setValue).toBe("function");
  });

  it("should initialize with provided initial value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it("should toggle value from false to true", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(true);
  });

  it("should toggle value from true to false", () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(false);
  });

  it("should set value to true using setTrue", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1].setTrue();
    });

    expect(result.current[0]).toBe(true);
  });

  it("should set value to false using setFalse", () => {
    const { result } = renderHook(() => useToggle(true));

    act(() => {
      result.current[1].setFalse();
    });

    expect(result.current[0]).toBe(false);
  });

  it("should set value using setValue", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1].setValue(true);
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].setValue(false);
    });

    expect(result.current[0]).toBe(false);
  });

  it("should maintain function references across renders", () => {
    const { result, rerender } = renderHook(() => useToggle());

    const firstRenderActions = result.current[1];

    rerender();

    const secondRenderActions = result.current[1];

    expect(firstRenderActions.toggle).toBe(secondRenderActions.toggle);
    expect(firstRenderActions.setTrue).toBe(secondRenderActions.setTrue);
    expect(firstRenderActions.setFalse).toBe(secondRenderActions.setFalse);
    expect(firstRenderActions.setValue).toBe(secondRenderActions.setValue);
  });

  it("should handle multiple toggles correctly", () => {
    const { result } = renderHook(() => useToggle(false));

    // Start with false
    expect(result.current[0]).toBe(false);

    // Toggle to true
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(true);

    // Toggle back to false
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(false);

    // Toggle to true again
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(true);
  });
});
