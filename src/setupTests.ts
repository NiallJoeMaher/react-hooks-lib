import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.addEventListener for StorageEvent testing
const addEventListenerMock = vi.fn();
const removeEventListenerMock = vi.fn();

Object.defineProperty(window, "addEventListener", {
  value: addEventListenerMock,
});

Object.defineProperty(window, "removeEventListener", {
  value: removeEventListenerMock,
});

// Reset mocks before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  addEventListenerMock.mockClear();
  removeEventListenerMock.mockClear();
});
