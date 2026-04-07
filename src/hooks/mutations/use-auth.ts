import { useMutation } from "@tanstack/react-query";

import {
  getDeleteAvatarMutationOptions,
  getDeleteIdentityMutationOptions,
  getDeleteSessionMutationOptions,
  getResetPasswordMutationOptions,
  getSendResetLinkMutationOptions,
  getUpdateAvatarMutationOptions,
  getUpdateBioMutationOptions,
  getUpdateEmailMutationOptions,
  getUpdateNameMutationOptions,
  getUpdatePasswordMutationOptions,
  getUpdateUsernameMutationOptions,
} from "@/lib/query/mutation-options";

export const useSendResetLinkMutation = () => {
  return useMutation(getSendResetLinkMutationOptions());
};

export const useResetPasswordMutation = () => {
  return useMutation(getResetPasswordMutationOptions());
};

export const useUpdateNameMutation = () => {
  return useMutation(getUpdateNameMutationOptions());
};

export const useUpdateUsernameMutation = () => {
  return useMutation(getUpdateUsernameMutationOptions());
};

export const useUpdateBioMutation = () => {
  return useMutation(getUpdateBioMutationOptions());
};

export const useUpdateAvatarMutation = () => {
  return useMutation(getUpdateAvatarMutationOptions());
};

export const useDeleteAvatarMutation = () => {
  return useMutation(getDeleteAvatarMutationOptions());
};

export const useUpdateEmailMutation = () => {
  return useMutation(getUpdateEmailMutationOptions());
};

export const useUpdatePasswordMutation = () => {
  return useMutation(getUpdatePasswordMutationOptions());
};

export const useDeleteSessionMutation = () => {
  return useMutation(getDeleteSessionMutationOptions());
};

export const useDeleteIdentityMutation = () => {
  return useMutation(getDeleteIdentityMutationOptions());
};
