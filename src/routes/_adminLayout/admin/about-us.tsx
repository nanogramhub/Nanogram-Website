import { debounce } from "@tanstack/react-pacer";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import AddMemberButton from "@/components/routes/admin/about-us/add-member-button";
import { MemberDialogContextProvider } from "@/components/routes/admin/about-us/context/member-dialog-context";
import EditMemberDialog from "@/components/routes/admin/about-us/edit-member-dialog";
import ViewMemberDialog from "@/components/routes/admin/about-us/preview-member";
import AboutUsTable from "@/components/routes/admin/about-us/table";
import AdminPagination from "@/components/routes/admin/pagination";
import SearchInput from "@/components/shared/default/search-input";
import { Separator } from "@/components/ui/separator";
import { useGetAllTeamMembers } from "@/hooks/queries/use-nanogram";
import { usePaginatedInfinitePagination } from "@/hooks/use-paginated-infinite-query";
import { nanogramQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import type { Nanogram } from "@/types/schema";

export const Route = createFileRoute("/_adminLayout/admin/about-us")({
  component: RouteComponent,
  loader: () => {
    queryClient.prefetchInfiniteQuery(
      nanogramQueries.getAllTeamMembers({
        enabled: true,
        limit: 8,
        search: "",
      }),
    );
  },
});

function RouteComponent() {
  const [pageSize, setPageSize] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [member, setMember] = useState<Nanogram | null>(null);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), { wait: 500 }),
    [],
  );
  const teamResult = useGetAllTeamMembers({
    enabled: true,
    limit: pageSize,
    search: searchQuery,
  });
  const {
    items,
    prevPage,
    nextPage,
    totalPages,
    currentPage,
    total,
    isFetchingNextPage,
  } = usePaginatedInfinitePagination(teamResult, pageSize);

  return (
    <div className="lg:px-10 px-2">
      <div className="flex justify-between items-end-safe mb-2">
        <h2>
          All Members
          <span className="text-xs text-muted-foreground ml-2">[{total}]</span>
        </h2>
        <div className="flex gap-2">
          <SearchInput setSearchQuery={debouncedSearch} />
          <AddMemberButton />
        </div>
      </div>
      <MemberDialogContextProvider
        value={{
          editOpen,
          setEditOpen,
          previewOpen,
          setPreviewOpen,
          member,
          setMember,
        }}
      >
        <AboutUsTable
          items={items}
          isFetchingNextPage={isFetchingNextPage}
          pageSize={pageSize}
        />
      </MemberDialogContextProvider>
      <Separator className="my-2" />
      <AdminPagination
        currentPage={currentPage}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <EditMemberDialog open={editOpen} setOpen={setEditOpen} member={member} />
      <ViewMemberDialog
        open={previewOpen}
        setOpen={setPreviewOpen}
        member={member}
      />
    </div>
  );
}
