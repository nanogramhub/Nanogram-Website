import { debounce } from "@tanstack/react-pacer";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import GridPosts from "@/components/posts/grid-posts";
import SearchInput from "@/components/shared/default/search-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetPosts } from "@/hooks/queries/use-posts";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import type { PostsFilter } from "@/types/api";

export const Route = createFileRoute("/_privateLayout/explore")({
  component: RouteComponent,
});

const sortOptions: { label: string; value: PostsFilter }[] = [
  { label: "Trending", value: "trending" },
  { label: "New", value: "recent" },
  { label: "Oldest", value: "oldest" },
];

function RouteComponent() {
  const [search, setSearch] = useState<string | undefined>();
  const [filter, setFilter] = useState<PostsFilter>("trending");
  const debouncedSearch = debounce((query: string) => setSearch(query), {
    wait: 500,
  });

  const getPostsResult = useGetPosts({
    limit: 3,
    search,
    filter,
    enabled: true,
  });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getPostsResult);

  function handleFilterChange(value: string | null) {
    if (value === "trending" || value === "recent" || value === "oldest") {
      setFilter(value);
    }
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      <div className="w-full flex justify-between gap-3 lg:px-0 md:px-10 px-5">
        <SearchInput setSearchQuery={debouncedSearch} />
        <Select
          items={sortOptions}
          defaultValue="trending"
          onValueChange={(value) => handleFilterChange(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={true}>
            <SelectGroup>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <GridPosts posts={items} displayOptions={{}} />
      <div ref={ref} />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
