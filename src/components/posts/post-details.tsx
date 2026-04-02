import type { PostDetailsData } from "@/types/api";
import PostCreator from "./post-creator";
import PostActions from "./post-actions";
import { formatRelativeTime } from "@/lib/utils";
import PostStats from "./post-stats";
import { Card, CardContent, CardHeader } from "../ui/card";

const PostDetails = ({ post }: { post: PostDetailsData }) => {
  return (
    <Card className="w-full flex flex-wrap lg:flex-row p-0 gap-0">
      <CardHeader className="lg:w-1/2 w-full block p-0">
        <img
          src={post.imageUrl}
          alt={post.imageId || "post"}
          className="object-cover"
        />
      </CardHeader>
      <CardContent className="flex md:justify-between flex-1 flex-col lg:aspect-square p-2">
        <div className="md:overflow-y-auto">
          <div className="sticky top-0 bg-base-200 flex justify-between py-2">
            <PostCreator creator={post.creator} />
            <PostActions
              post={{ $id: post.$id, creator: post.creator.$id }}
              showViewButton={false}
            />
          </div>
          <p className="text-xs text-base-content/30">
            Posted on Nanogram, {formatRelativeTime(post.$createdAt)}
          </p>
          <p className="text-sm">{post.caption}</p>
          <ul className="flex flex-wrap gap-1 mt-1">
            {post.tags.length === 0
              ? null
              : post.tags.map((tag) => (
                  <li key={tag} className="text-primary font-light">
                    #{tag}
                  </li>
                ))}
          </ul>
        </div>
        <div className="">
          <PostStats post={post} displayOptions={{ align: "between" }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetails;
