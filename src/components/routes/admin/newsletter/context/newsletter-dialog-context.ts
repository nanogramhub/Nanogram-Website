import { createContext } from "react";

import type { Newsletter } from "@/types/schema";

export type NewsletterDialogContextState = {
  newsletter: Newsletter | null;
  setNewsletter: (newsletter: Newsletter | null) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
};

export const NewsletterDialogContext = createContext<
  NewsletterDialogContextState | undefined
>(undefined);

export const NewsletterDialogContextProvider = NewsletterDialogContext.Provider;
