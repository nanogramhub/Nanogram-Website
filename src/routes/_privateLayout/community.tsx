import { PostCard, PostCardSkeleton } from "@/components/posts/post-card";
import { useGetPosts } from "@/hooks/queries/use-posts";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { postsQueries } from "@/lib/query/query-options";
import { range } from "@/lib/utils";
import { queryClient } from "@/router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_privateLayout/community")({
  component: RouteComponent,
  loader: async () => {
    await queryClient.prefetchInfiniteQuery(
      postsQueries.getPosts({ limit: 2, enabled: true, search: undefined }),
    );
  },
  pendingComponent: () => (
    <div className="flex flex-col items-center justify-center gap-4 md:p-4 p-0">
      {range(2).map((i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  ),
});

function RouteComponent() {
  const recentPostsResult = useGetPosts({
    limit: 2,
    enabled: true,
    search: undefined,
  });
  const {
    items: posts,
    ref,
    isFetchingNextPage,
    hasNextPage,
  } = usePersistentInfiniteQuery(recentPostsResult);

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:p-4 p-0">
      {posts.map((post) => (
        <PostCard key={post.$id} post={post} />
      ))}
      {hasNextPage && isFetchingNextPage && (
        <div>
          <PostCardSkeleton />
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}
