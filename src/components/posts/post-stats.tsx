import { Like, Liked, Save, Saved } from "../icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import type { User } from "@/types/schema";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import type { PostCardData } from "@/types/api";

interface PostStatsProps {
  post: Pick<PostCardData, "$id" | "likes" | "save">;
  displayOptions: {
    showLikes?: boolean;
    showComments?: boolean;
    showShare?: boolean;
    showSave?: boolean;
    align?: "start" | "end" | "between";
  };
}

function hasLiked(likes: PostStatsProps["post"]["likes"], currentUser: User) {
  return likes.some((like) => like.$id === currentUser.$id);
}

function hasSaved(saves: PostStatsProps["post"]["save"], currentUser: User) {
  return saves.some((save) => save.user === currentUser.$id);
}

const PostStats = ({
  post,
  displayOptions: {
    showLikes = true,
    showComments = true,
    showShare = true,
    showSave = true,
    align = "between",
  },
}: PostStatsProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [liked, setLiked] = useState<boolean>(false);
  const [likedCount, setLikedCount] = useState(post.likes.length);
  const [saved, setSaved] = useState<boolean>(false);

  const toggleLike = async () => {
    try {
      // Optimistically update the liked state
      setLikedCount(liked ? likedCount - 1 : likedCount + 1);
      setLiked(!liked);
      // TODO: nutation
      // const res = await likePost({
      //   postId: post._id.toString(),
      //   userId: user._id.toString(),
      // });
      // if (!res) {
      //   setLiked(!liked);
      // }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  const toggleSave = async () => {
    try {
      setSaved(!saved);
      // TODO: mutation
      // const res = await savePost({
      //   postId: post._id.toString(),
      //   userId: user._id.toString(),
      // });
      // if (!res) {
      //   setSaved(!saved);
      // }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setLiked(hasLiked(post.likes, currentUser));
      setSaved(hasSaved(post.save, currentUser));
    }
  }, [currentUser]);

  // If no post is provided and all stats are set to true, return null
  if (!post && showLikes && showComments && showShare && showSave) {
    return null;
  }
  return (
    <CardFooter className="w-full">
      <div className={`w-full flex justify-${align} gap-2`}>
        {showLikes && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-lg"
              className="flex p-0"
              onClick={() => toggleLike()}
            >
              {liked ? (
                <Liked className="size-6" />
              ) : (
                <Like className="size-5" />
              )}
            </Button>
            <p className="mt-0.5 text-xs">{likedCount}</p>
          </div>
        )}
        {/* {showComments && <Comments post={post} currentUser={user} />} */}
        {/* {showShare && <Share currentUser={user} post={post} />} */}
        {showSave && (
          <Button variant="ghost" size="icon-lg" onClick={() => toggleSave()}>
            {saved ? (
              <Saved className="text-primary size-5" />
            ) : (
              <Save className="size-5" />
            )}
          </Button>
        )}
      </div>
    </CardFooter>
  );
};

export default PostStats;
