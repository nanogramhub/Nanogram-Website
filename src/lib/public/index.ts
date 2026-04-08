import type { Models } from "appwrite";
import { api } from "../appwrite/api";
import type { MemberFormValues } from "../validation";

export async function createMember(data: MemberFormValues) {
  if (data.avatar && data.avatar instanceof File) {
    const image = await api.storage.uploadFile(data.avatar);
    try {
      const member = await api.public.nanogram.createMember({
        name: data.name,
        role: data.role,
        content: data.content || null,
        linkedin: data.linkedin || null,
        instagram: data.instagram || null,
        github: data.github || null,
        core: data.core,
        priority: data.priority,
        avatarUrl: api.storage.getFileUrl(image.$id),
        avatarId: image.$id,
        alumini: !data.core,
      });
      return member;
    } catch (error) {
      console.error("Error creating member:", error);
      await api.storage.deleteFile(image.$id);
      throw error;
    }
  }
  throw new Error("Avatar is required");
}

function isFile(value: unknown): value is File {
  return value instanceof File;
}

export async function updateMember(
  data: MemberFormValues & { $id: string; avatarId?: string },
) {
  const isNewAvatar = data.avatar && isFile(data.avatar);
  if (isNewAvatar && !data.avatarId) {
    throw new Error("Avatar ID is required");
  }
  let storageResponse: Models.File | undefined;
  try {
    if (data.avatar && isFile(data.avatar)) {
      storageResponse = await api.storage.uploadFile(data.avatar);
    }
    const updateData: Parameters<typeof api.public.nanogram.updateMember>[1] = {
      name: data.name,
      role: data.role,
      content: data.content || null,
      linkedin: data.linkedin || null,
      instagram: data.instagram || null,
      github: data.github || null,
      core: data.core,
      priority: data.priority,
      ...(storageResponse && {
        avatarId: storageResponse.$id,
        avatarUrl: api.storage.getFileUrl(storageResponse.$id),
      }),
      alumini: !data.core,
    };
    const member = await api.public.nanogram.updateMember(data.$id, updateData);

    // Delete old image AFTER successful update
    if (storageResponse && data.avatarId) {
      await api.storage.deleteFile(data.avatarId);
    }

    return member;
  } catch (error) {
    console.error("Error creating member:", error);
    // Rollback newly uploaded file if something failed
    if (storageResponse) {
      await api.storage.deleteFile(storageResponse.$id);
    }
    throw error;
  }
}

export async function deleteMember(id: string, imageId?: string) {
  try {
    await api.public.nanogram.deleteMember(id);
    if (imageId) {
      await api.storage.deleteFile(imageId);
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
}
