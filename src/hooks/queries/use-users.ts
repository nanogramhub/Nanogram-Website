import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { usersQueries } from "@/lib/query/query-options";

export const useGetUsers = ({
  searchTerm,
  enabled,
  limit,
}: {
  searchTerm?: string;
  enabled: boolean;
  limit?: number;
}) => {
  return useInfiniteQuery(
    usersQueries.getUsers({ searchTerm, enabled, limit }),
  );
};

export const useGetUserByUsername = (username: string) => {
  return useQuery(usersQueries.getUserByUsername(username));
};
