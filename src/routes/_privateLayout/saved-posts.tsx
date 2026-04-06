import { createFileRoute } from "@tanstack/react-router";

import GridPosts from "@/components/posts/grid-posts";
import { Spinner } from "@/components/ui/spinner";
import { useGetSavedPosts } from "@/hooks/queries/use-saves";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { useAuthStore } from "@/store/use-auth-store";

export const Route = createFileRoute("/_privateLayout/saved-posts")({
  component: RouteComponent,
});

function RouteComponent() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const getSavedPostsResult = useGetSavedPosts({
    userId: currentUser?.$id ?? "",
    enabled: !!currentUser,
  });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getSavedPostsResult);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col max-w-4xl mx-auto">
      <GridPosts posts={items.map((item) => item.post)} displayOptions={{}} />
      <div ref={ref} />
      {isFetchingNextPage && <Spinner />}
    </div>
  );
}
