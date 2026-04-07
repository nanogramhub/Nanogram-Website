import { useEffect, useState } from "react";

export function useStickyState<T>(
  defaultValue: T,
  key: string,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    // try json parsing if error return unparsed value
    try {
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
      return stickyValue !== null ? stickyValue : defaultValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
