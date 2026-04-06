import { Link } from "@tanstack/react-router";
import { useState } from "react";

import UserAvatar from "@/components/shared/profile/user-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useGetFollowers } from "@/hooks/queries/use-follows";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import type { UserProfileData } from "@/types/api";

import FollowButton from "../follow-button";

const FollowersDialog = ({ user }: { user: UserProfileData }) => {
  const [open, setOpen] = useState(false);
  const getFollowersResult = useGetFollowers({
    userId: user.$id,
    enabled: open && user.followers.length > 0,
  });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getFollowersResult);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">
        <div className="flex flex-col md:flex-row gap-1 items-center">
          <span className="font-bold text-foreground">
            {user.followers.length}
          </span>
          <span className="text-muted-foreground text-sm lowercase">
            followers
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
          <DialogDescription>Followers of {user.name}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="flex flex-col gap-2">
            {open && user.followers.length === 0 && (
              <span>{user.name} has no followers</span>
            )}
            {items.map((item) => (
              <div
                key={item.$id}
                className="w-full flex justify-between items-center"
              >
                <Link
                  to="/u/$userId"
                  params={{ userId: item.follower.$id }}
                  className="flex gap-2 items-center"
                >
                  <UserAvatar
                    name={item.follower.name}
                    imageUrl={item.follower.imageUrl}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.follower.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.follower.username}
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
};

export default FollowersDialog;
