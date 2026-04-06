import type { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";

import { useFollowUser, useUnfollowUser } from "@/hooks/mutations/use-follows";
import { useAuthStore } from "@/store/use-auth-store";
import type { CurrentUser } from "@/types/api";

import { Button } from "../ui/button";
import type { buttonVariants } from "../ui/constants";

function isFollowing(currentUser: CurrentUser, userId: string) {
  return currentUser.following.some((f) => f.followed === userId);
}

function getFollowedRecordId(currentUser: CurrentUser, userId: string) {
  const followed = currentUser.following.find((f) => f.followed === userId);
  if (followed) {
    return followed.$id;
  }
  throw new Error("Impossible state: are you sure you checked isFollowing?");
}

type FollowButtonProps = {
  userId: string;
} & Omit<ButtonPrimitive.Props, "children" | "disabled" | "onClick"> &
  VariantProps<typeof buttonVariants>;

const FollowButton = ({ userId, ...props }: FollowButtonProps) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  if (!currentUser) return null;
  if (currentUser.$id === userId) return null;
  if (isFollowing(currentUser, userId)) {
    return (
      <Button
        variant="outline"
        onClick={() =>
          unfollowUser.mutate({
            followedRecordId: getFollowedRecordId(currentUser, userId),
          })
        }
        disabled={unfollowUser.isPending}
        {...props}
      >
        Unfollow
      </Button>
    );
  }
  return (
    <Button
      onClick={() =>
        followUser.mutate({
          followerId: currentUser.$id,
          followedId: userId,
        })
      }
      disabled={followUser.isPending}
      {...props}
    >
      Follow
    </Button>
  );
};

export default FollowButton;
