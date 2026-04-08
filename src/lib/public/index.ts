import type { Models } from "appwrite";
import { api } from "../appwrite/api";
import type {
  EventFormValues,
  MemberFormValues,
  NewsLetterFormValues,
} from "../validation";

function isFile(value: unknown): value is File {
  return value instanceof File;
}

export async function createMember(data: MemberFormValues) {
  if (data.avatar && isFile(data.avatar)) {
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

export async function createEvent(data: EventFormValues) {
  if (data.image && isFile(data.image)) {
    const image = await api.storage.uploadFile(data.image);
    try {
      const event = await api.public.events.createEvent({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        content: data.content,
        completed: data.completed,
        registration: data.registration || null,
        date: data.date,
        location: data.location,
        imageUrl: api.storage.getFileUrl(image.$id),
        imageId: image.$id,
      });
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      await api.storage.deleteFile(image.$id);
      throw error;
    }
  }
  throw new Error("Image is required");
}

export async function updateEvent(
  data: EventFormValues & { $id: string; imageId?: string },
) {
  const isNewImage = data.image && isFile(data.image);
  if (isNewImage && !data.imageId) {
    throw new Error("Image ID is required");
  }
  let storageResponse: Models.File | undefined;
  try {
    if (data.image && isFile(data.image)) {
      storageResponse = await api.storage.uploadFile(data.image);
    }
    const updateData: Parameters<typeof api.public.events.updateEvent>[1] = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      content: data.content,
      completed: data.completed,
      registration: data.registration || null,
      date: data.date,
      location: data.location,
      ...(storageResponse && {
        imageId: storageResponse.$id,
        imageUrl: api.storage.getFileUrl(storageResponse.$id),
      }),
    };
    const event = await api.public.events.updateEvent(data.$id, updateData);

    // Delete old image AFTER successful update
    if (storageResponse && data.imageId) {
      await api.storage.deleteFile(data.imageId);
    }

    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    // Rollback newly uploaded file if something failed
    if (storageResponse) {
      await api.storage.deleteFile(storageResponse.$id);
    }
    throw error;
  }
}

export async function deleteEvent(id: string, imageId?: string) {
  try {
    await api.public.events.deleteEvent(id);
    if (imageId) {
      await api.storage.deleteFile(imageId);
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

export async function createNewsletter(data: NewsLetterFormValues) {
  if (data.file && isFile(data.file)) {
    const file = await api.storage.uploadFile(data.file);
    try {
      const newsletter = await api.newsletters.createNewsletter({
        title: data.title,
        fileId: file.$id,
        fileUrl: api.storage.getFileUrl(file.$id),
      });
      return newsletter;
    } catch (error) {
      console.error("Error creating newsletter:", error);
      await api.storage.deleteFile(file.$id);
      throw error;
    }
  }
  throw new Error("File is required");
}

export async function updateNewsletter(
  data: NewsLetterFormValues & { $id: string; fileId?: string },
) {
  const isNewFile = data.file && isFile(data.file);
  if (isNewFile && !data.fileId) {
    throw new Error("File ID is required");
  }
  let storageResponse: Models.File | undefined;
  try {
    if (data.file && isFile(data.file)) {
      storageResponse = await api.storage.uploadFile(data.file);
    }
    const updateData: Parameters<typeof api.newsletters.updateNewsletter>[1] = {
      title: data.title,
      ...(storageResponse && {
        fileId: storageResponse.$id,
        fileUrl: api.storage.getFileUrl(storageResponse.$id),
      }),
    };
    const newsletter = await api.newsletters.updateNewsletter(
      data.$id,
      updateData,
    );
    if (storageResponse && data.fileId) {
      await api.storage.deleteFile(data.fileId);
    }
    return newsletter;
  } catch (error) {
    console.error("Error updating newsletter:", error);
    if (storageResponse) {
      await api.storage.deleteFile(storageResponse.$id);
    }
    throw error;
  }
}

export async function deleteNewsletter(id: string, fileId?: string) {
  try {
    await api.newsletters.deleteNewsletter(id);
    if (fileId) {
      await api.storage.deleteFile(fileId);
    }
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    throw error;
  }
}
