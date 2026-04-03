import SearchInput from "@/components/shared/default/search-input";
import { Spinner } from "@/components/ui/spinner";
import UserCard from "@/components/users/user-card";
import { useGetUsers } from "@/hooks/queries/use-users";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { usersQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import { debounce } from "@tanstack/react-pacer";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_privateLayout/all-users")({
  component: RouteComponent,
  loader: () => {
    queryClient.prefetchInfiniteQuery(
      usersQueries.getUsers({ searchTerm: "", enabled: true, limit: 8 }),
    );
  },
});

function RouteComponent() {
  const [search, setSearch] = useState<string | undefined>();
  const debouncedSearch = debounce((query: string) => setSearch(query), {
    wait: 500,
  });
  const getUsersResult = useGetUsers({
    searchTerm: search,
    enabled: true,
    limit: 8,
  });
  const {
    items: users,
    ref,
    hasNextPage,
    isFetchingNextPage,
  } = usePersistentInfiniteQuery(getUsersResult);

  return (
    <div className="flex flex-col max-w-4xl w-full mx-auto">
      <div className="w-full flex justify-between gap-3 lg:px-0 md:px-10 px-5">
        <SearchInput setSearchQuery={debouncedSearch} />
      </div>
      <div className="w-full flex flex-col gap-3 lg:px-0 md:px-10 px-5 py-5">
        {users?.map((user) => (
          <UserCard key={user.$id} user={user} />
        ))}
        <div ref={ref} />
      </div>
      {isFetchingNextPage && (
        <span className="flex w-full items-center justify-center">
          <Spinner />
        </span>
      )}
      {!hasNextPage && (
        <p className="text-center text-muted-foreground mb-10">End of List</p>
      )}
    </div>
  );
}
