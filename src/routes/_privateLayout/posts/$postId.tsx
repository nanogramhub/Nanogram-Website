import PostDetails from "@/components/posts/post-details";
import { Spinner } from "@/components/ui/spinner";
import { useGetPostById } from "@/hooks/queries/use-posts";
import { postsQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_privateLayout/posts/$postId")({
  component: RouteComponent,
  loader: ({ params }) => {
    queryClient.prefetchQuery(postsQueries.getPostById(params.postId));
  },
});

function RouteComponent() {
  const { postId } = Route.useParams();
  const { data: post, isPending } = useGetPostById(postId);

  if (isPending) {
    return (
      <div className="w-full flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="mx-auto lg:w-4xl w-xl lg:my-10 my-2 flex flex-col gap-4">
      <PostDetails post={post} />
      <h2 className="text-2xl font-semibold">Similar Posts</h2>
      {/* <GridPosts posts={similarPosts} /> */}
    </div>
  );
}
