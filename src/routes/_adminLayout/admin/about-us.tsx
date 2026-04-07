import { AdminTable } from "@/components/routes/admin/table";
import { useGetAllTeamMembers } from "@/hooks/queries/use-nanogram";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { nanogramQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_adminLayout/admin/about-us")({
  component: RouteComponent,
  loader: () => {
    queryClient.prefetchInfiniteQuery(
      nanogramQueries.getAllTeamMembers({ enabled: true }),
    );
  },
});

function RouteComponent() {
  const teamResult = useGetAllTeamMembers({ enabled: true });
  const { items, fetchNextPage, hasNextPage, isFetchingNextPage, total } =
    usePersistentInfiniteQuery(teamResult);
  return (
    <div>
      total: {total}
      {items && <AdminTable items={items} stringField={["name", "role"]} />}
    </div>
  );
}
