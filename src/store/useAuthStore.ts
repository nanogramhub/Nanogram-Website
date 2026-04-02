import { create } from "zustand";
import type { User } from "@/types/schema";
import { api } from "@/lib/appwrite/api";
import type { SigninFormValues } from "@/lib/validation";

interface AuthStore {
  currentUser: User | null;
  isAdmin: boolean;
  setCurrentUser: (user: User | null) => void;
  getCurrentUser: () => Promise<User>;
  login: (data: SigninFormValues) => Promise<User>;
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
      const user = await api.user.getUserByAccountId(authUser.$id);

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
