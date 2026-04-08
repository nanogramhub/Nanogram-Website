import { Ellipsis } from "lucide-react";
// import { useDeleteMember } from "@/hooks/mutations/use-nanogram";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteNewsletter } from "@/hooks/mutations/use-newsletter";
import { formatDateTime, range } from "@/lib/utils";
import type { Newsletter } from "@/types/schema";

import { useNewsletterDialog } from "./context/use-admin-newsletter";

const NewsletterActions = ({ newsletter }: { newsletter: Newsletter }) => {
  const { setNewsletter, setEditOpen, setPreviewOpen } = useNewsletterDialog();
  const deleteEvent = useDeleteNewsletter();

  function handleDelete() {
    deleteEvent.mutate(
      {
        id: newsletter.$id,
        fileId: newsletter.fileId,
      },
      {
        onSuccess: () => {
          toast.success("Newsletter deleted successfully");
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
              setNewsletter(newsletter);
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => {
              setNewsletter(newsletter);
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

const NewsletterTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead> </TableHead>
        <TableHead>Sl. No</TableHead>
        <TableHead>File</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Updated At</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const NewsletterTableSkeleton = ({ pageSize }: { pageSize: number }) => {
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

const NewsletterTableBody = ({
  items,
  pageSize,
  isFetchingNextPage,
}: {
  items: Newsletter[];
  pageSize: number;
  isFetchingNextPage: boolean;
}) => {
  if (isFetchingNextPage) {
    return <NewsletterTableSkeleton pageSize={pageSize} />;
  }
  return (
    <TableBody>
      {items.map((item, index) => (
        <TableRow key={item.$id}>
          <TableCell>
            <NewsletterActions newsletter={item} />
          </TableCell>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            <a href={item.fileUrl} target="_blank" className="underline">
              {item.title}
            </a>
          </TableCell>
          <TableCell>{item.title}</TableCell>
          <TableCell>{formatDateTime(item.$createdAt, "PPPp")}</TableCell>
          <TableCell>{formatDateTime(item.$updatedAt, "PPPp")}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const NewsletterTable = ({
  items,
  pageSize,
  isFetchingNextPage,
}: {
  items: Newsletter[];
  pageSize: number;
  isFetchingNextPage: boolean;
}) => {
  return (
    <Table scrollarea="lg:w-[calc(100vw-80px)] w-[calc(100vw-16px)]">
      <NewsletterTableHeader />
      <NewsletterTableBody
        items={items}
        pageSize={pageSize}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Table>
  );
};

export default NewsletterTable;
