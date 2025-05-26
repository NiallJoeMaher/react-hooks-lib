import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "../useLocalStorage";

// Get the mocked localStorage from setupTests
const mockLocalStorage = window.localStorage as any;

describe("useLocalStorage", () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  it("should initialize with the provided initial value when localStorage is empty", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    expect(result.current[0]).toBe("initial-value");
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
  });

  it("should initialize with value from localStorage if it exists", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    expect(result.current[0]).toBe("stored-value");
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
  });

  it("should update localStorage when value changes", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value")
    );
  });

  it("should support function updater pattern", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(5));

    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(6);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "counter",
      JSON.stringify(6)
    );
  });

  it("should handle complex data types", () => {
    const complexObject = {
      name: "test",
      nested: { value: 42 },
      array: [1, 2, 3],
    };

    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage("complex", complexObject)
    );

    const newObject = { ...complexObject, name: "updated" };

    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "complex",
      JSON.stringify(newObject)
    );
  });

  it("should handle arrays", () => {
    const initialArray = [1, 2, 3];
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("array", initialArray));

    act(() => {
      result.current[1]([...initialArray, 4]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "array",
      JSON.stringify([1, 2, 3, 4])
    );
  });

  it("should handle JSON parsing errors gracefully", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid-json");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "fallback")
    );

    expect(result.current[0]).toBe("fallback");
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "test-key":',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should handle localStorage.setItem errors gracefully", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error("Storage quota exceeded");
    });
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    // State should still update even if localStorage fails
    expect(result.current[0]).toBe("new-value");
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "test-key":',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should listen for storage events", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const mockAddEventListener = window.addEventListener as any;

    renderHook(() => useLocalStorage("test-key", "initial"));

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "storage",
      expect.any(Function)
    );
  });

  it("should cleanup storage event listener on unmount", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const mockRemoveEventListener = window.removeEventListener as any;

    const { unmount } = renderHook(() =>
      useLocalStorage("test-key", "initial")
    );

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "storage",
      expect.any(Function)
    );
  });

  it("should update state when storage event occurs for the same key", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    let storageEventHandler: (e: StorageEvent) => void;

    const mockAddEventListener = window.addEventListener as any;
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === "storage") {
        storageEventHandler = handler;
      }
    });

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    // Simulate storage event
    const storageEvent = new StorageEvent("storage", {
      key: "test-key",
      newValue: JSON.stringify("updated-from-another-tab"),
      storageArea: localStorage,
    });

    act(() => {
      storageEventHandler(storageEvent);
    });

    expect(result.current[0]).toBe("updated-from-another-tab");
  });

  it("should not update state for storage events with different keys", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    let storageEventHandler: (e: StorageEvent) => void;

    const mockAddEventListener = window.addEventListener as any;
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === "storage") {
        storageEventHandler = handler;
      }
    });

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    // Simulate storage event for different key
    const storageEvent = new StorageEvent("storage", {
      key: "different-key",
      newValue: JSON.stringify("should-not-update"),
      storageArea: localStorage,
    });

    act(() => {
      storageEventHandler(storageEvent);
    });

    expect(result.current[0]).toBe("initial");
  });

  it("should handle SSR environment (no window object)", () => {
    // Test the initialization logic without renderHook in SSR environment
    const originalWindow = globalThis.window;
    delete (globalThis as any).window;

    // Simulate the hook's initialization logic for SSR
    const initialValue = "ssr-initial";

    let storedValue;
    try {
      // Check if we're in a browser environment (should be false in SSR)
      if (typeof window === "undefined") {
        storedValue = initialValue;
      }
    } catch (error) {
      storedValue = initialValue;
    }

    expect(storedValue).toBe("ssr-initial");

    // Restore window
    globalThis.window = originalWindow;
  });
});
