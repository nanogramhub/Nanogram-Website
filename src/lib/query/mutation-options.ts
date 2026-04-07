import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/router";
import { useAuthStore } from "@/store/use-auth-store";

import { api } from "../appwrite/api";
import { createPost, deletePost, updatePost } from "../posts";
import { queryKeys } from "./query-keys";
import {
  deleteAvatar,
  updateAvatar,
  updateEmail,
  updateName,
  updateUsername,
} from "../auth";

// AUTH AND USER INFO MUTATION
export const getDeleteSessionMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.auth.deleteSession,
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const response = await api.auth.deleteSession(sessionId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.getAllSessions,
      });
    },
  });
};

export const getDeleteIdentityMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.auth.deleteIdentity,
    mutationFn: async ({ identityId }: { identityId: string }) => {
      const response = await api.auth.deleteIdentity(identityId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.getAllIdentities,
      });
    },
  });
};

export const getUpdateAvatarMutationOptions = () => {
  const currentUser = useAuthStore.getState().currentUser;
  return mutationOptions({
    mutationKey: queryKeys.users.updateAvatar,
    mutationFn: async ({ avatar }: { avatar: File }) => {
      if (!currentUser) {
        throw new Error("User not found");
      }
      const response = await updateAvatar({
        userId: currentUser.$id,
        avatar,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getDeleteAvatarMutationOptions = () => {
  const currentUser = useAuthStore.getState().currentUser;
  return mutationOptions({
    mutationKey: queryKeys.users.deleteAvatar,
    mutationFn: async () => {
      if (!currentUser) {
        throw new Error("User not found");
      }
      const response = await deleteAvatar(currentUser);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getUpdateNameMutationOptions = () => {
  const currentUser = useAuthStore.getState().currentUser;
  return mutationOptions({
    mutationKey: queryKeys.auth.updateName,
    mutationFn: async ({ name }: { name: string }) => {
      if (!currentUser) {
        throw new Error("User not found");
      }
      const response = await updateName({
        userId: currentUser.$id,
        name,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getUpdateUsernameMutationOptions = () => {
  const currentUser = useAuthStore.getState().currentUser;
  return mutationOptions({
    mutationKey: queryKeys.users.updateUsername,
    mutationFn: async ({ username }: { username: string }) => {
      if (!currentUser) {
        throw new Error("User not found");
      }
      const response = await updateUsername({
        userId: currentUser.$id,
        username,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getUpdateBioMutationOptions = () => {
  const currentUser = useAuthStore.getState().currentUser;
  return mutationOptions({
    mutationKey: queryKeys.users.updateBio,
    mutationFn: async ({ bio }: { bio: string }) => {
      if (!currentUser) {
        throw new Error("User not found");
      }
      const response = await api.users.updateUser(currentUser.$id, { bio });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getUpdateEmailMutationOptions = () => {
  const currentUser = useAuthStore.getState().currentUser;
  return mutationOptions({
    mutationKey: queryKeys.auth.updateEmail,
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      if (!currentUser) {
        throw new Error("User not found");
      }
      const response = await updateEmail({
        userId: currentUser.$id,
        email,
        password,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getUpdatePasswordMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.auth.updatePassword,
    mutationFn: async ({
      password,
      oldPassword,
    }: {
      password: string;
      oldPassword?: string;
    }) => {
      const response = await api.auth.updatePassword(password, oldPassword);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
    },
  });
};

export const getSendResetLinkMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.auth.sendResetLink,
    mutationFn: async ({ email }: { email: string }) => {
      const response = await api.auth.sendResetPasswordEmail(email);
      return response;
    },
  });
};

export const getResetPasswordMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.auth.resetPassword,
    mutationFn: async ({
      userId,
      secret,
      password,
    }: {
      userId: string;
      secret: string;
      password: string;
    }) => {
      const response = await api.auth.resetPassword(userId, secret, password);
      return response;
    },
  });
};

// FOLLOWS MUTATION
export const getFollowUserMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.follows.followUser,
    mutationFn: async ({
      followerId,
      followedId,
    }: {
      followerId: string;
      followedId: string;
    }) => {
      const response = await api.users.follows.followUser(
        followerId,
        followedId,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.follows.getFollowers,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follows.getFollowing,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      // Synchronize AuthStore
      useAuthStore.getState().getCurrentUser();
    },
  });
};

export const getUnfollowUserMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.follows.unfollowUser,
    mutationFn: async ({ followedRecordId }: { followedRecordId: string }) => {
      const response = await api.users.follows.unfollowUser(followedRecordId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.follows.getFollowers,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.follows.getFollowing,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByAccountId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.getUserByUsername,
      });
      // Synchronize AuthStore
      useAuthStore.getState().getCurrentUser();
    },
  });
};

// POSTS MUTATION
export const getUpdateLikesMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.posts.updateLikes,
    mutationFn: async ({
      likeArray,
      postId,
    }: {
      likeArray: string[];
      postId: string;
    }) => {
      const response = await api.posts.updateLikes(likeArray, postId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getRecentPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostById,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostsByUserId,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getLikedPosts,
      });
    },
  });
};

export const getSavePostMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.saves.savePost,
    mutationFn: async ({
      userId,
      postId,
    }: {
      userId: string;
      postId: string;
    }) => {
      const response = await api.posts.saves.savePost(userId, postId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.saves.getSavedPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getRecentPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostById,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostsByUserId,
      });
    },
  });
};

export const getUnsavePostMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.saves.unsavePost,
    mutationFn: async ({ savedRecordId }: { savedRecordId: string }) => {
      const response = await api.posts.saves.unsavePost(savedRecordId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.saves.getSavedPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getRecentPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostById,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostsByUserId,
      });
    },
  });
};

export const getUpdateCommentLikesMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.comments.updateLikes,
    mutationFn: async ({
      likeArray,
      commentId,
    }: {
      likeArray: string[];
      commentId: string;
    }) => {
      const response = await api.posts.comments.updateLikes(
        likeArray,
        commentId,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.getCommentsByPostId,
      });
    },
  });
};

export const getCreateCommentMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.comments.createComment,
    mutationFn: async ({
      content,
      postId,
      userId,
    }: {
      content: string;
      postId: string;
      userId: string;
    }) => {
      const response = await api.posts.comments.createComment(
        content,
        postId,
        userId,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.getCommentsByPostId,
      });
    },
  });
};

export const getDeleteCommentMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.comments.deleteComment,
    mutationFn: async ({ commentId }: { commentId: string }) => {
      const response = await api.posts.comments.deleteComment(commentId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.getCommentsByPostId,
      });
    },
  });
};

export const getCreatePostMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.posts.createPost,
    mutationFn: async (data: {
      creator: string;
      caption: string;
      tags: string[];
      imageFile: File;
    }) => {
      const response = await createPost(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getRecentPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostById,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostsByUserId,
      });
    },
  });
};

export const getUpdatePostMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.posts.updatePost,
    mutationFn: async (data: {
      postId: string;
      caption?: string;
      tags?: string[];
      imageId?: string;
      imageFile?: File;
    }) => {
      const response = await updatePost(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getRecentPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostById,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostsByUserId,
      });
    },
  });
};

export const getDeletePostMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.posts.deletePost,
    mutationFn: async (data: { postId: string; imageId: string }) => {
      const response = await deletePost(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getRecentPosts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostById,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.getPostsByUserId,
      });
    },
  });
};

// MESSAGES MUTATION
export const getSendMessageMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.messages.sendMessage,
    mutationFn: async ({
      senderId,
      receiverId,
      content,
    }: {
      senderId: string;
      receiverId: string;
      content: string;
    }) => {
      const response = await api.messages.sendMessage({
        senderId,
        receiverId,
        content,
      });
      return response;
    },
    onSuccess: () => {
      // Refresh messages list and contacts sidebar
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.getMessages,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.getContacts,
      });
    },
  });
};

export const getUpdateMessageMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.messages.updateMessage,
    mutationFn: async ({
      messageId,
      content,
      reactions,
    }: {
      messageId: string;
      content?: string;
      reactions?: string[];
    }) => {
      const response = await api.messages.updateMessage({
        messageId,
        content,
        reactions,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.getMessages,
      });
    },
  });
};

export const getDeleteMessageMutationOptions = () => {
  return mutationOptions({
    mutationKey: queryKeys.messages.deleteMessage,
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const response = await api.messages.deleteMessage(messageId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.getMessages,
      });
    },
  });
};
