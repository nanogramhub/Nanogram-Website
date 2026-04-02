import { useState, useCallback } from "react";

type UseClipboardOptions = {
  resetAfter?: number; // ms
  onCopy?: () => void;
  onError?: (err: unknown) => void;
};

export const useClipboard = (options?: UseClipboardOptions) => {
  const { resetAfter = 3000, onCopy, onError } = options || {};

  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (onCopy) onCopy();

      if (resetAfter > 0) {
        setTimeout(() => setCopied(false), resetAfter);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      if (onError) onError(err);
    }
  }, [resetAfter, onCopy, onError]);

  return { copied, copy };
};