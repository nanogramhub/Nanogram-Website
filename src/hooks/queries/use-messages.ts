import { useInfiniteQuery } from "@tanstack/react-query";

import { messagesQueries } from "@/lib/query/query-options";

/**
 * Fetch paginated messages between two users.
 * Use with usePersistentInfiniteQuery for infinite scroll.
 */
export const useGetMessages = ({
  senderId,
  receiverId,
  cursorAfter,
  limit,
  enabled,
}: {
  senderId: string;
  receiverId: string;
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) => {
  return useInfiniteQuery(
    messagesQueries.getMessages({
      senderId,
      receiverId,
      cursorAfter,
      limit,
      enabled,
    }),
  );
};

/**
 * Fetch paginated messages to derive a contacts list.
 * The component de-duplicates sender/receiver into unique contacts.
 */
export const useGetContacts = ({
  userId,
  cursorAfter,
  limit,
  enabled,
}: {
  userId: string;
  cursorAfter?: string;
  limit?: number;
  enabled: boolean;
}) => {
  return useInfiniteQuery(
    messagesQueries.getContacts({
      userId,
      cursorAfter,
      limit,
      enabled,
    }),
  );
};
