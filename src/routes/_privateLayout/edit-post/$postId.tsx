import PostForm from "@/components/forms/post-form";
import { Button } from "@/components/ui/button";
import { useUpdatePost } from "@/hooks/mutations/use-posts";
import { useGetPostById } from "@/hooks/queries/use-posts";
import { postsQueries } from "@/lib/query/query-options";
import type { PostFormValues } from "@/lib/validation";
import { queryClient } from "@/router";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_privateLayout/edit-post/$postId")({
  component: RouteComponent,
  loader: ({ params }) => {
    queryClient.prefetchQuery(postsQueries.getPostById(params.postId));
  },
});

function RouteComponent() {
  const { postId } = Route.useParams();
  const { data: post } = useGetPostById(postId);
  const updatePostMutation = useUpdatePost();

  const router = useRouter();
  const navigate = useNavigate();

  const handleSubmit = (values: PostFormValues) => {
    if (!post) return;
    if (values.image && typeof values.image === "string") {
      values.image = undefined;
    }
    console.log(values);

    updatePostMutation.mutate(
      {
        postId: post.$id,
        ...(values.image instanceof File && {
          imageFile: values.image,
          imageId: post.imageId,
        }),
        ...values,
      },
      {
        onSuccess: () => {
          toast.success("Post updated successfully");
          navigate({ to: "/community" });
        },
        onError: () => {
          toast.error("Failed to update post");
        },
      },
    );
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  const sanitizedPost = {
    ...post,
    creator: post.creator.$id,
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <PostForm action="Update" post={sanitizedPost} onSubmit={handleSubmit} />
      <div className="flex items-center justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.history.back()}
          disabled={updatePostMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="post-form"
          disabled={updatePostMutation.isPending}
        >
          {updatePostMutation.isPending ? "Updating..." : "Update Post"}
        </Button>
      </div>
    </div>
  );
}
