import { useMutation } from "@tanstack/react-query";

import {
  getCreateNewsletterMutationOptions,
  getDeleteNewsletterMutationOptions,
  getUpdateNewsletterMutationOptions,
} from "@/lib/query/mutation-options";

export function useCreateNewsletter() {
  return useMutation(getCreateNewsletterMutationOptions());
}

export function useUpdateNewsletter() {
  return useMutation(getUpdateNewsletterMutationOptions());
}

export function useDeleteNewsletter() {
  return useMutation(getDeleteNewsletterMutationOptions());
}
