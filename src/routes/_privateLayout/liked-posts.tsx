import { createFileRoute } from "@tanstack/react-router";

import GridPosts from "@/components/posts/grid-posts";
import { Spinner } from "@/components/ui/spinner";
import { useGetLikedPosts } from "@/hooks/queries/use-posts";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { useAuthStore } from "@/store/use-auth-store";

export const Route = createFileRoute("/_privateLayout/liked-posts")({
  component: RouteComponent,
});

function RouteComponent() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const getLikedPostsResult = useGetLikedPosts({
    userId: currentUser?.$id ?? "",
    enabled: !!currentUser,
  });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getLikedPostsResult);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      <GridPosts posts={items} displayOptions={{}} />
      <div ref={ref} />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
