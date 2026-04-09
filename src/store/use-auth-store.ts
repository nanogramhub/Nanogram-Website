import { create } from "zustand";

import { UserNotFoundException } from "@/exceptions";
import { api } from "@/lib/appwrite/api";
import type { SigninFormValues } from "@/lib/validation";
import type { CurrentUser } from "@/types/api";

interface AuthStore {
  currentUser: CurrentUser | null;
  isAdmin: boolean;
  prefs: Record<string, unknown>;
  setCurrentUser: (user: CurrentUser | null) => void;
  setPrefs: (prefs: Record<string, unknown>) => void;
  getCurrentUser: () => Promise<CurrentUser>;
  login: (data: SigninFormValues) => Promise<CurrentUser>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isAdmin: false,
  prefs: {},

  setCurrentUser: (user) => set({ currentUser: user }),
  setPrefs: (prefs) => set({ prefs }),

  getCurrentUser: async () => {
    try {
      const authUser = await api.auth.getCurrentUserAccount();
      const isAdmin = authUser.labels.includes("admin");
      const user = await api.users.getUserByAccountId(authUser.$id);
      if (!user) {
        throw new UserNotFoundException(
          `No user found in database for account id: ${authUser.$id}`,
        );
      }

      const prefs = await api.auth.getPrefs();
      set({ currentUser: user, isAdmin, prefs });
      return user;
    } catch (error) {
      set({ currentUser: null, isAdmin: false, prefs: {} });
      throw error;
    }
  },

  login: async (data) => {
    await api.auth.signIn(data);
    return await get().getCurrentUser();
  },

  logout: async () => {
    await api.auth.signOut();
    set({ currentUser: null });
  },
}));
