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
    imageId: null,
  });

  return user;
};

export const updateName = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  await api.auth.updateName(name);
  const updatedUser = await api.users.updateUser(userId, { name });
  return updatedUser;
};

export const updateUsername = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const isAvailable = await api.auth.checkUsernameAvailability(username);
  if (!isAvailable) {
    throw new Error("Username is not available");
  }
  const updatedUser = await api.users.updateUser(userId, { username });
  return updatedUser;
};

export const updateEmail = async ({
  userId,
  email,
  password,
}: {
  userId: string;
  email: string;
  password: string;
}) => {
  await api.auth.updateEmail(email, password);
  const updatedUser = await api.users.updateUser(userId, { email });
  return updatedUser;
};

export const updateAvatar = async ({
  userId,
  avatar,
}: {
  userId: string;
  avatar: File;
}) => {
  const image = await api.storage.uploadFile(avatar);
  const updatedUser = await api.users.updateUser(userId, {
    imageId: image.$id,
    imageUrl: api.storage.getFileUrl(image.$id),
  });
  return updatedUser;
};

export const deleteAvatar = async (
  data: Pick<User, "imageId" | "name" | "$id">,
) => {
  const { imageId, name, $id: userId } = data;
  if (imageId) {
    await api.storage.deleteFile(imageId);
  }
  const updatedUser = await api.users.updateUser(userId, {
    imageId: null,
    imageUrl: api.avatars.getInitials(name),
  });
  return updatedUser;
};
