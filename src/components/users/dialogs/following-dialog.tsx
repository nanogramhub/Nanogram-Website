import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FollowButton from "../follow-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { useGetFollowing } from "@/hooks/queries/use-follows";
import { useState } from "react";
import type { UserProfileData } from "@/types/api";
import UserAvatar from "@/components/shared/profile/user-avatar";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@tanstack/react-router";

function FollowingDialog({ user }: { user: UserProfileData }) {
  const [open, setOpen] = useState(false);
  const getFollowingResult = useGetFollowing({
    userId: user.$id,
    enabled: open && user.following.length > 0,
  });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getFollowingResult);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">
        <div className="flex flex-col md:flex-row gap-1 items-center">
          <span className="font-bold text-foreground">
            {user.following?.length || 0}
          </span>
          <span className="text-muted-foreground text-sm lowercase">
            following
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
          <DialogDescription>{user.name} is following</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {open && user.following.length === 0 && (
            <span>{user.name} is not following anyone</span>
          )}
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div
                key={item.$id}
                className="w-full flex justify-between items-center"
              >
                <Link
                  to="/u/$userId"
                  params={{ userId: item.followed.$id }}
                  className="flex gap-2 items-center"
                >
                  <UserAvatar
                    name={item.followed.name}
                    imageUrl={item.followed.imageUrl}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.followed.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.followed.username}
                    </span>
                  </div>
                </Link>
                <FollowButton userId={user.$id} />
              </div>
            ))}
          </div>
          {isFetchingNextPage && (
            <div className="flex w-full justify-center">
              <Spinner />
            </div>
          )}
          <div ref={ref} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default FollowingDialog;
