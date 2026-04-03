import type { User } from "@/types/schema";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import UserAvatar from "../shared/profile/user-avatar";
import { Badge } from "../ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Link } from "@tanstack/react-router";

const UserCard = ({ user }: { user: User }) => {
  const isMobile = useIsMobile();
  return (
    <Card className="w-full">
      <CardContent className="w-full flex justify-between items-center">
        <Link
          to="/u/$userId"
          params={{ userId: user.username }}
          className="flex gap-3 items-end"
        >
          <div className="flex gap-2 items-center">
            <UserAvatar name={user.name} imageUrl={user.imageUrl} />
            <div className="flex flex-col">
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.username}</CardDescription>
            </div>
          </div>
          {user.admin && <Badge>Admin</Badge>}
          {!isMobile && (
            <div className="flex gap-1 items-center text-muted-foreground">
              <p>
                <span>{user.karma}</span> nanobytes
              </p>
              <span>•</span>
              <p>
                Joined <span>{formatRelativeTime(user.$createdAt)}</span>
              </p>
            </div>
          )}
        </Link>
      </CardContent>
    </Card>
  );
};

export default UserCard;
