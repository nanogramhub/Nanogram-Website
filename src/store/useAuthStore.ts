import { create } from "zustand";
import { api } from "@/lib/appwrite/api";
import type { SigninFormValues } from "@/lib/validation";
import { UserNotFoundException } from "@/exceptions";
import type { CurrentUser } from "@/types/api";

interface AuthStore {
  currentUser: CurrentUser | null;
  isAdmin: boolean;
  setCurrentUser: (user: CurrentUser | null) => void;
  getCurrentUser: () => Promise<CurrentUser>;
  login: (data: SigninFormValues) => Promise<CurrentUser>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isAdmin: false,

  setCurrentUser: (user) => set({ currentUser: user }),

  getCurrentUser: async () => {
    try {
      const authUser = await api.auth.getCurrentSession();
      const isAdmin = authUser.labels.includes("admin");
      const user = await api.users.getUserByAccountId(authUser.$id);
      if (!user) {
        throw new UserNotFoundException(
          `No user found in database for account id: ${authUser.$id}`,
        );
      }

      set({ currentUser: user, isAdmin });
      return user;
    } catch (error) {
      set({ currentUser: null, isAdmin: false });
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
