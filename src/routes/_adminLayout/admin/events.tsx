import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import AddEventButton from "@/components/routes/admin/events/add-event-button";
import { EventDialogContextProvider } from "@/components/routes/admin/events/context/event-dialog-context";
import EditEventDialog from "@/components/routes/admin/events/edit-event-dialog";
import ViewEventDialog from "@/components/routes/admin/events/preview-event";
import EventTable from "@/components/routes/admin/events/table";
import AdminPagination from "@/components/routes/admin/pagination";
import { Separator } from "@/components/ui/separator";
import { useGetEvents } from "@/hooks/queries/use-events";
import { usePaginatedInfinitePagination } from "@/hooks/use-paginated-infinite-query";
import { eventsQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import type { Event } from "@/types/schema";

export const Route = createFileRoute("/_adminLayout/admin/events")({
  component: RouteComponent,
  loader: () => {
    queryClient.prefetchInfiniteQuery(
      eventsQueries.getEvents({
        enabled: true,
        limit: 8,
      }),
    );
  },
});

function RouteComponent() {
  const [pageSize, setPageSize] = useState(8);
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);

  const teamResult = useGetEvents({
    enabled: true,
    limit: pageSize,
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
          All Events
          <span className="text-xs text-muted-foreground ml-2">[{total}]</span>
        </h2>
        <div className="flex gap-2">
          <AddEventButton />
        </div>
      </div>
      <EventDialogContextProvider
        value={{
          editOpen,
          setEditOpen,
          previewOpen,
          setPreviewOpen,
          event,
          setEvent,
        }}
      >
        <EventTable
          items={items}
          isFetchingNextPage={isFetchingNextPage}
          pageSize={pageSize}
        />
      </EventDialogContextProvider>
      <Separator className="my-2" />
      <AdminPagination
        currentPage={currentPage}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <EditEventDialog open={editOpen} setOpen={setEditOpen} event={event} />
      <ViewEventDialog
        open={previewOpen}
        setOpen={setPreviewOpen}
        event={event}
      />
    </div>
  );
}
