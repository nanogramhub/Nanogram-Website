import { createContext } from "react";

import type { Event } from "@/types/schema";

export type EventDialogContextState = {
  event: Event | null;
  setEvent: (event: Event | null) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
};

export const EventDialogContext = createContext<
  EventDialogContextState | undefined
>(undefined);

export const EventDialogContextProvider = EventDialogContext.Provider;
