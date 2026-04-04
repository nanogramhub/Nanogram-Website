import PostForm from "@/components/forms/post-form";
import { type PostFormValues } from "@/lib/validation";
import { useCreatePost } from "@/hooks/mutations/use-posts";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_privateLayout/create-post")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();

  const handleSubmit = (values: PostFormValues) => {
    if (!values.image || !(values.image instanceof File)) {
      toast.error("No image file provided");
      return;
    }

    createPostMutation.mutate(
      {
        creator: values.creator,
        caption: values.caption,
        tags: values.tags,
        imageFile: values.image,
      },
      {
        onSuccess: () => {
          toast.success("Post created successfully");
          navigate({ to: "/community" });
        },
        onError: () => {
          toast.error("Failed to create post");
        },
      },
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <PostForm action="Create" onSubmit={handleSubmit} />
      <div className="flex items-center justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.history.back()}
          disabled={createPostMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="post-form"
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </div>
  );
}
