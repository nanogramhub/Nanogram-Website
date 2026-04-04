import GridPosts from "@/components/posts/grid-posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import FollowersDialog from "@/components/users/dialogs/followers-dialog";
import FollowingDialog from "@/components/users/dialogs/following-dialog";
import FollowButton from "@/components/users/follow-button";
import { useGetPostsByUserId } from "@/hooks/queries/use-posts";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { usersQueries } from "@/lib/query/query-options";
import { formatDateTime, getInitials } from "@/lib/utils";
import { queryClient } from "@/router";
import { useAuthStore } from "@/store/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_privateLayout/u/$userId")({
  component: RouteComponent,
  loader: ({ params }) => {
    queryClient.prefetchQuery(usersQueries.getUserByUsername(params.userId));
  },
});

function RouteComponent() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { userId } = Route.useParams();
  const { data: user } = useQuery(usersQueries.getUserByUsername(userId));

  if (!currentUser || !user) return null;

  const getUserPostsResult = useGetPostsByUserId({
    userId: user.$id,
    enabled: true,
  });
  const { items, ref, isFetchingNextPage } =
    usePersistentInfiniteQuery(getUserPostsResult);

  const isOwnProfile = currentUser.$id === user.$id;

  return (
    <div className="max-w-5xl w-full mx-auto px-4 py-6 md:py-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row gap-8 md:gap-20 items-center md:items-start mb-10">
        {/* Avatar Section */}
        <div className="shrink-0 text-center md:text-left">
          <div className="p-1 bg-background rounded-full">
            <Avatar className="w-24 h-24 md:w-44 md:h-44 border-none ring-4 ring-background">
              <AvatarImage src={user.imageUrl} className="object-cover" />
              <AvatarFallback className="text-3xl bg-muted font-bold text-muted-foreground uppercase">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          {/* Top Row: Username and Actions */}
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <h2 className="text-xl md:text-2xl font-light text-foreground lowercase tracking-tight">
              {user.username}
            </h2>
            {user.admin && <Badge>Admin</Badge>}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 px-4 font-semibold text-sm bg-secondary/80 hover:bg-secondary"
                >
                  Edit profile
                </Button>
              ) : (
                <>
                  <FollowButton
                    userId={user.$id}
                    className="h-9 px-6 font-semibold text-sm"
                  />
                  <Button
                    nativeButton={false}
                    variant="secondary"
                    size="sm"
                    className="h-9 px-6 font-semibold text-sm bg-secondary/80 hover:bg-secondary"
                    render={(props) => (
                      <Link to="/test" {...props}>
                        Message
                      </Link>
                    )}
                  />
                </>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4 md:gap-10 justify-center md:justify-start border-y md:border-none py-3 md:py-0 w-full md:w-auto">
            <div className="flex flex-col md:flex-row gap-1 items-center">
              <span className="font-bold text-foreground">
                {user.posts?.length || 0}
              </span>
              <span className="text-muted-foreground text-sm lowercase">
                posts
              </span>
            </div>
            <Separator orientation="vertical" />
            <FollowersDialog user={user} />
            <Separator orientation="vertical" />
            <FollowingDialog user={user} />
            <Separator orientation="vertical" />
            <div className="flex flex-col md:flex-row gap-1 items-center">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground">{user.karma}</span>
              </div>
              <span className="text-muted-foreground text-sm lowercase">
                nanobytes
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <h1 className="font-bold text-sm md:text-base">{user.name}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1 group">
              <span>Joined {formatDateTime(user.$createdAt, "PPP")}</span>
            </div>
            {user.bio ? (
              <p className="text-sm leading-relaxed max-w-md whitespace-pre-line text-foreground/90">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm italic text-muted-foreground">No bio yet</p>
            )}
          </div>
        </div>
      </header>

      <Separator />

      {/* Grid Posts Section */}
      <div className="mt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-70">
            <p className="text-sm font-semibold text-muted-foreground tracking-tight">
              No Posts Yet
            </p>
          </div>
        ) : (
          <GridPosts posts={items} displayOptions={{}} />
        )}
        <div ref={ref} />
        {isFetchingNextPage && (
          <div className="flex w-full justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
