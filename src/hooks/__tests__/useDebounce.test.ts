import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast forward time by 400ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe("initial"); // Should still be initial

    // Fast forward the remaining time
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("updated"); // Now should be updated
  });

  it("should reset timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    // Rapid changes
    rerender({ value: "change1", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: "change2", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: "final", delay: 500 });

    // Should still be initial after partial delays
    expect(result.current).toBe("initial");

    // Complete the final delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("final");
  });

  it("should handle different delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "test", delay: 1000 } }
    );

    rerender({ value: "updated", delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("test");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });

  it("should handle delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) =>
        useDebounce(value, delay),
      { initialProps: { value: "test", delay: 500 } }
    );

    rerender({ value: "updated", delay: 1000 });

    // With new delay of 1000ms
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("test");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("updated");
  });

  it("should work with different data types", () => {
    // Test with numbers
    const { result: numberResult } = renderHook(() => useDebounce(42, 500));
    expect(numberResult.current).toBe(42);

    // Test with objects
    const testObject = { key: "value" };
    const { result: objectResult } = renderHook(() =>
      useDebounce(testObject, 500)
    );
    expect(objectResult.current).toBe(testObject);

    // Test with arrays
    const testArray = [1, 2, 3];
    const { result: arrayResult } = renderHook(() =>
      useDebounce(testArray, 500)
    );
    expect(arrayResult.current).toBe(testArray);
  });

  it("should cleanup timers on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
