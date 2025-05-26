import { useState, useCallback } from "react";

/**
 * Custom hook for managing boolean state with toggle functionality
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple containing the current boolean value and toggle functions
 */
export function useToggle(initialValue = false): [
  boolean,
  {
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    setValue: (value: boolean) => void;
  }
] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const setValueCallback = useCallback(
    (newValue: boolean) => setValue(newValue),
    []
  );

  return [
    value,
    {
      toggle,
      setTrue,
      setFalse,
      setValue: setValueCallback,
    },
  ];
}
