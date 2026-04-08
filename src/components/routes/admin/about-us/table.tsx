import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { GitHub, Instagram, LinkedIn } from "@/components/icons/brands";
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
import { useDeleteMember } from "@/hooks/mutations/use-nanogram";
import { formatDateTime, range } from "@/lib/utils";
import type { Nanogram } from "@/types/schema";

import { useMemberDialog } from "./context/use-admin-about-us";

const AboutUsActions = ({ member }: { member: Nanogram }) => {
  const { setMember, setEditOpen, setPreviewOpen } = useMemberDialog();
  const deleteMember = useDeleteMember();

  function handleDelete() {
    deleteMember.mutate(
      {
        id: member.$id,
        imageId: member.avatarId,
      },
      {
        onSuccess: () => {
          toast.success("Member deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  const isDisabled = deleteMember.isPending;

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
              setMember(member);
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => {
              setMember(member);
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

const AboutUsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead> </TableHead>
        <TableHead>Sl. No</TableHead>
        <TableHead>Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Socials</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>Updated At</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const AboutUsTableSkeleton = ({ pageSize }: { pageSize: number }) => {
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

const AboutUsTableBody = ({
  items,
  pageSize,
  isFetchingNextPage,
}: {
  items: Nanogram[];
  pageSize: number;
  isFetchingNextPage: boolean;
}) => {
  if (isFetchingNextPage) {
    return <AboutUsTableSkeleton pageSize={pageSize} />;
  }
  return (
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.$id}>
          <TableCell>
            <AboutUsActions member={item} />
          </TableCell>
          <TableCell>{item.priority + 1}</TableCell>
          <TableCell>
            <img
              src={item.avatarUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
          </TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.role}</TableCell>
          <TableCell>{item.core ? "Core" : "Alumini"}</TableCell>
          <TableCell>
            <span className="flex gap-1">
              {item.github && (
                <a href={item.github}>
                  <GitHub className="dark:fill-white" />
                </a>
              )}
              {item.instagram && (
                <a href={item.instagram}>
                  <Instagram />
                </a>
              )}
              {item.linkedin && (
                <a href={item.linkedin}>
                  <LinkedIn />
                </a>
              )}
            </span>
          </TableCell>
          <TableCell>{formatDateTime(item.$createdAt, "PPPp")}</TableCell>
          <TableCell>{formatDateTime(item.$updatedAt, "PPPp")}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

const AboutUsTable = ({
  items,
  pageSize,
  isFetchingNextPage,
}: {
  items: Nanogram[];
  pageSize: number;
  isFetchingNextPage: boolean;
}) => {
  return (
    <Table>
      <AboutUsTableHeader />
      <AboutUsTableBody
        items={items}
        pageSize={pageSize}
        isFetchingNextPage={isFetchingNextPage}
      />
    </Table>
  );
};

export default AboutUsTable;
