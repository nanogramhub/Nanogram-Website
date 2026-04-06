import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { useUpdateLikes } from "@/hooks/mutations/use-posts";
import { useSavePost, useUnSavePost } from "@/hooks/mutations/use-saves";
import { useAuthStore } from "@/store/use-auth-store";
import type { PostCardData } from "@/types/api";
import type { User } from "@/types/schema";

import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import Comments from "./dialogs/comments";
import ShareDialog from "./dialogs/share";

interface PostStatsProps {
  post: Pick<PostCardData, "$id" | "likes" | "save" | "caption">;
  displayOptions: {
    showLikes?: boolean;
    showComments?: boolean;
    showShare?: boolean;
    showSave?: boolean;
    align?: "start" | "end" | "between";
  };
}

function flattenLikes(likes: PostStatsProps["post"]["likes"]) {
  return likes.map((like) => like.$id);
}

function hasLiked(likes: PostStatsProps["post"]["likes"], currentUser: User) {
  return flattenLikes(likes).includes(currentUser.$id);
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
  const updateLikes = useUpdateLikes();
  const savePost = useSavePost();
  const unSavePost = useUnSavePost();

  const toggleLike = async () => {
    if (!currentUser) return;
    // Optimistically update UI
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikedCount((c) => (nextLiked ? c + 1 : c - 1));

    const nextLikeArray = nextLiked
      ? [...flattenLikes(post.likes), currentUser.$id]
      : flattenLikes(post.likes).filter((id) => id !== currentUser.$id);

    updateLikes.mutate(
      { likeArray: nextLikeArray, postId: post.$id },
      {
        onError: () => {
          // Roll back on failure
          setLiked(!nextLiked);
          setLikedCount((c) => (nextLiked ? c - 1 : c + 1));
        },
      },
    );
  };

  const toggleSave = async () => {
    if (!currentUser) return;
    // Optimistically update UI
    const nextSaved = !saved;
    setSaved(nextSaved);

    if (nextSaved) {
      savePost.mutate(
        { userId: currentUser.$id, postId: post.$id },
        { onError: () => setSaved(!nextSaved) },
      );
    } else {
      const saveRecord = post.save.find((s) => s.user === currentUser.$id);
      if (!saveRecord) return;
      unSavePost.mutate(
        { savedRecordId: saveRecord.$id },
        { onError: () => setSaved(!nextSaved) },
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      setLiked(hasLiked(post.likes, currentUser));
      setSaved(hasSaved(post.save, currentUser));
    }
  }, [currentUser, post.likes, post.save]);

  // If no post is provided and all stats are set to true, return null
  if (!post && showLikes && showComments && showShare && showSave) {
    return null;
  }

  const shareUrl = `${window.location.origin}/posts/${post.$id}`;

  return (
    <CardFooter className="w-full">
      <div className={`w-full flex justify-${align} items-center gap-2`}>
        <div className="flex items-center gap-4">
          {showLikes && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-lg"
                className="flex p-0"
                onClick={() => toggleLike()}
                disabled={updateLikes.isPending}
              >
                {liked ? (
                  <Heart className="size-6 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="size-6" />
                )}
              </Button>
              <p className="mt-0.5 text-xs">{likedCount}</p>
            </div>
          )}
          {showComments && (
            <div className="flex items-center gap-1">
              <Comments
                postId={post.$id}
                trigger={<MessageCircle className="size-6" />}
              />
            </div>
          )}
          {showShare && (
            <ShareDialog
              url={shareUrl}
              postId={post.$id}
              title={post.caption}
            />
          )}
        </div>

        {showSave && (
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => toggleSave()}
            disabled={savePost.isPending || unSavePost.isPending}
          >
            {saved ? (
              <Bookmark className="text-primary size-6 fill-primary" />
            ) : (
              <Bookmark className="size-6" />
            )}
          </Button>
        )}
      </div>
    </CardFooter>
  );
};

export default PostStats;
