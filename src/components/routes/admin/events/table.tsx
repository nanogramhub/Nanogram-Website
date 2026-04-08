import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, range, truncate } from "@/lib/utils";
import type { Event } from "@/types/schema";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventDialog } from "./context/use-admin-events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useDeleteMember } from "@/hooks/mutations/use-nanogram";
import { toast } from "sonner";
import { useDeleteEvent } from "@/hooks/mutations/use-events";
import { Badge } from "@/components/ui/badge";

const EventActions = ({ event }: { event: Event }) => {
  const { setEvent, setEditOpen, setPreviewOpen } = useEventDialog();
  const deleteEvent = useDeleteEvent();

  function handleDelete() {
    deleteEvent.mutate(
      {
        id: event.$id,
        imageId: event.imageId,
      },
      {
        onSuccess: () => {
          toast.success("Event deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  const isDisabled = deleteEvent.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button variant="ghost" size="icon" {...props}>
            <Ellipsis />
          </Button>
        )}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => {
              setEvent(event);
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => {
              setEvent(event);
              setPreviewOpen(true);
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
            disabled={isDisabled}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const EventTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead> </TableHead>
        <TableHead>Sl. No</TableHead>
        <TableHead>Image</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Subtitle</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Content</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Updated At</TableHead>
        <TableHead>Registration</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const EventTableSkeleton = ({ pageSize }: { pageSize: number }) => {
  return (
    <TableBody>
      {range(pageSize).map((i) => (
        <TableRow key={i}>
          <TableCell>
            <Ellipsis />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-10 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const EventTableBody = ({
  items,
  pageSize,
  isFetchingNextPage,
}: {
  items: Event[];
  pageSize: number;
  isFetchingNextPage: boolean;
}) => {
  if (isFetchingNextPage) {
    return <EventTableSkeleton pageSize={pageSize} />;
  }
  return (
    <TableBody>
      {items.map((item, index) => (
        <TableRow key={item.$id}>
          <TableCell>
            <EventActions event={item} />
          </TableCell>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            <img src={item.imageUrl} className="w-10 h-10 object-cover" />
          </TableCell>
          <TableCell>{formatDateTime(item.date, "PPPp")}</TableCell>
          <TableCell>
            {item.completed ? (
              <Badge variant="secondary">Completed</Badge>
            ) : (
              <Badge variant="secondary">Ongoing</Badge>
            )}
          </TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{item.subtitle}</TableCell>
          <TableCell>{item.location}</TableCell>
          <TableCell>{truncate(item.description, 30).truncated}</TableCell>
          <TableCell>{truncate(item.content, 30).truncated}</TableCell>
          <TableCell>{formatDateTime(item.$createdAt, "PPPp")}</TableCell>
          <TableCell>{formatDateTime(item.$updatedAt, "PPPp")}</TableCell>
          <TableCell>{item.completed ? "- completed -" : item.registration}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const EventTable = ({
  items,
  pageSize,
  isFetchingNextPage,
}: {
  items: Event[];
  pageSize: number;
  isFetchingNextPage: boolean;
}) => {
  return (
    <Table scrollarea="lg:w-[calc(100vw-80px)] w-[calc(100vw-16px)]">
      <EventTableHeader />
      <EventTableBody
        items={items}
        pageSize={pageSize}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Table>
  );
};

export default EventTable;
