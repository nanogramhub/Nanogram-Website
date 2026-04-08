import { createContext } from "react";

import type { Nanogram } from "@/types/schema";

export type MemberDialogContextState = {
  member: Nanogram | null;
  setMember: (member: Nanogram | null) => void;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
};

export const MemberDialogContext = createContext<
  MemberDialogContextState | undefined
>(undefined);

export const MemberDialogContextProvider = MemberDialogContext.Provider;
