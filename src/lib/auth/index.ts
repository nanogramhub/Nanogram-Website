import { useAuthStore } from "@/store/use-auth-store";
import type { User } from "@/types/schema";

import { api } from "../appwrite/api";
import type { SignupFormValues } from "../validation";

let authPromise: Promise<User> | null = null;

export const ensureAuth = async () => {
  const store = useAuthStore.getState();

  if (store.currentUser) return store.currentUser;

  if (!authPromise) {
    authPromise = store.getCurrentUser().finally(() => {
      authPromise = null; // reset after resolution
    });
  }

  return authPromise;
};

export const signUpUser = async (data: SignupFormValues) => {
  const authUser = await api.auth.createAccount(data);
  const imageUrl = api.avatars.getInitials(data.name);
  const user = await api.users.createuser({
    ...data,
    accountId: authUser.$id,
    imageUrl,
  });

  return user;
};
