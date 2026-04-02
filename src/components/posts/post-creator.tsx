import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDateTime } from "@/lib/utils";
import type { User } from "@/types/schema";
import { Link } from "@tanstack/react-router";
import { Binary, CakeSlice } from "lucide-react";
import { Button } from "../ui/button";
import UserAvatar from "../shared/profile/user-avatar";

const PostCreator = ({
  creator,
  onlyImage = false,
}: {
  creator: Pick<
    User,
    "username" | "name" | "imageUrl" | "bio" | "karma" | "$createdAt"
  >;
  onlyImage?: boolean;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={(props) => (
          <Link {...props} to="/test">
            <div className="flex items-center gap-2 cursor-pointer">
              <UserAvatar
                name={creator.name}
                imageUrl={creator.imageUrl}
                size="lg"
              />
              {!onlyImage && (
                <div className="text-start">
                  <h2 className="text-sm font-bold">{creator.name}</h2>
                  <p className="text-xs">@{creator.username}</p>
                </div>
              )}
            </div>
          </Link>
        )}
      />
      <HoverCardContent>
        <div className="w-full text-wrap">
          <div className="flex items-center gap-2 py-2">
            <img
              width={40}
              height={40}
              src={creator.imageUrl || "/assets/images/placeholder.png"}
              alt={creator.username}
              className="rounded-full"
            />
            <div>
              <h2 className="text-sm">
                {creator.name ? creator.name : "[deleted user]"}
              </h2>
              <p className="text-xs">
                {creator.username ? `@${creator.username}` : "[deleted user]"}
              </p>
            </div>
          </div>
          {creator.bio && (
            <p className="text-xs text-muted-foreground">{creator.bio}</p>
          )}

          <div className="py-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Binary strokeWidth={1.5} />
              {creator.karma} Nanobytes{" "}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CakeSlice strokeWidth={1.5} />
              Joined on {formatDateTime(creator.$createdAt, "PPP")}
            </p>
          </div>
          <div className="flex justify-end">
            {creator && (
              <div className="flex gap-2">
                <Button
                  nativeButton={false}
                  render={(props) => (
                    <Link
                      to="/community"
                      // TODO: Add the route for the user profile
                      //   params={{ username: creator.username }}
                      {...props}
                    >
                      View
                    </Link>
                  )}
                />
                <Button variant="outline">Message</Button>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PostCreator;
