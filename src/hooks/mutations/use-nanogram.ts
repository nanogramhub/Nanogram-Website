import { useMutation } from "@tanstack/react-query";

import {
  getCreateMemberMutationOptions,
  getDeleteMemberMutationOptions,
  getUpdateMemberMutationOptions,
} from "@/lib/query/mutation-options";

export function useCreateMember() {
  return useMutation(getCreateMemberMutationOptions());
}

export function useUpdateMember() {
  return useMutation(getUpdateMemberMutationOptions());
}

export function useDeleteMember() {
  return useMutation(getDeleteMemberMutationOptions());
}
