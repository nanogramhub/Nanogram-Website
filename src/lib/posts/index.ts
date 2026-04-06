import type { Models } from "appwrite";

import { api } from "../appwrite/api";

export async function createPost({
  creator,
  caption,
  tags,
  imageFile,
}: {
  creator: string;
  caption: string;
  tags: string[];
  imageFile: File;
}) {
  const storageResponse = await api.storage.uploadFile(imageFile);
  try {
    const response = await api.posts.createPost(
      creator,
      caption,
      tags,
      storageResponse.$id,
      api.storage.getFileUrl(storageResponse.$id),
    );
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    // rollback file upload
    await api.storage.deleteFile(storageResponse.$id);
    throw error;
  }
}

export async function updatePost({
  postId,
  caption,
  tags,
  imageId,
  imageFile,
}: {
  postId: string;
  caption?: string;
  tags?: string[];
  imageId?: string;
  imageFile?: File;
}) {
  // Enforce: both or neither
  const isUpdatingImage = imageId || imageFile;
  if (isUpdatingImage && (!imageId || !imageFile)) {
    throw new Error(
      "To update image, both imageId and imageFile must be provided.",
    );
  }

  let storageResponse: Models.File | undefined;

  try {
    // Upload new image if provided
    if (imageFile && imageId) {
      storageResponse = await api.storage.uploadFile(imageFile);
    }

    const updateData: Parameters<typeof api.posts.updatePost>[1] = {
      caption,
      tags,
      ...(storageResponse && {
        imageId: storageResponse.$id,
        imageUrl: api.storage.getFileUrl(storageResponse.$id),
      }),
    };

    const response = await api.posts.updatePost(postId, updateData);

    // Delete old image AFTER successful update
    if (storageResponse && imageId) {
      await api.storage.deleteFile(imageId);
    }

    return response;
  } catch (error) {
    console.error("Error updating post:", error);

    // Rollback newly uploaded file if something failed
    if (storageResponse) {
      await api.storage.deleteFile(storageResponse.$id);
    }

    throw error;
  }
}

export async function deletePost({
  postId,
  imageId,
}: {
  postId: string;
  imageId: string;
}) {
  await api.posts.deletePost(postId);
  try {
    await api.storage.deleteFile(imageId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}
