import { useQuery } from "@tanstack/react-query";

import { authQueries } from "@/lib/query/query-options";

export const useGetIdentities = ({ enabled }: { enabled: boolean }) => {
  return useQuery(authQueries.getAllIdentities({ enabled }));
};

export const useGetSessions = ({ enabled }: { enabled: boolean }) => {
  return useQuery(authQueries.getAllSessions({ enabled }));
};
