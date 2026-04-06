import { createContext } from "react";

interface ProfileContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileContextProvider = ProfileContext.Provider;
