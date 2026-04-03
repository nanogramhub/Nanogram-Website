import { mutationOptions } from "@tanstack/react-query";
import { api } from "../appwrite/api";
import { queryKeys } from "./query-keys";
import { queryClient } from "@/router";
import { useAuthStore } from "@/store/useAuthStore";

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
