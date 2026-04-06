import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteSessionMutation } from "@/hooks/mutations/use-auth";
import { useGetSessions } from "@/hooks/queries/use-auth";
import { formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import type { Models } from "appwrite";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

// function to put the current session on the top and sort by date
const sortSessions = (sessions: Models.SessionList) => {
  const sortedSessions = [...sessions.sessions];
  sortedSessions.sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
  });
  return sortedSessions;
};

const DeviceType = ({
  device,
  className,
}: {
  device: string;
  className?: string;
}) => {
  switch (device) {
    case "desktop":
      return <Monitor className={className} />;
    case "smartphone":
      return <Smartphone className={className} />;
    default:
      return <Monitor className={className} />;
  }
};

const UserSessions = ({ open }: { open: boolean }) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { data, isLoading } = useGetSessions({ enabled: open });
  const deleteSessionMutation = useDeleteSessionMutation();

  function handleDeleteSession(sessionId: string) {
    deleteSessionMutation.mutate(
      { sessionId },
      {
        onSuccess: () => {
          toast.success("Session deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex w-full h-[40vh] min-h-0 flex-col py-2">
      <ScrollArea className="flex-1 min-h-0 w-full pr-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : !data || data.sessions.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No active sessions found
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {sortSessions(data).map((session) => (
              <div
                key={session.$id}
                className="flex flex-col gap-4 rounded-lg border p-2 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="mt-1 shrink-0 rounded-full bg-primary/10 p-2 text-primary">
                    <DeviceType
                      device={session.deviceName}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium">
                        {session.osName || "Unknown OS"}
                      </span>
                      {session.current && (
                        <Badge variant="secondary" className="text-[10px]">
                          Current Session
                        </Badge>
                      )}
                    </div>
                    <div className="wrap-break-word space-y-0.5 text-xs text-muted-foreground">
                      <p className="truncate">
                        {session.clientName || "Unknown Browser"} • {session.ip}
                      </p>
                      <p className="truncate">
                        {session.countryName || "Unknown Location"}
                      </p>
                      <p className="wrap-break-word">
                        Signed in: {formatDateTime(session.$createdAt, "PPPp")}
                      </p>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto gap-2 text-destructive hover:bg-destructive/10"
                    disabled={deleteSessionMutation.isPending}
                    onClick={() => handleDeleteSession(session.$id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default UserSessions;
