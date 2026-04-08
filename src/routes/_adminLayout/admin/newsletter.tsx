import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import AddNewsletterButton from "@/components/routes/admin/newsletter/add-newsletter";
import { NewsletterDialogContextProvider } from "@/components/routes/admin/newsletter/context/newsletter-dialog-context";
import EditNewsletterDialog from "@/components/routes/admin/newsletter/edit-newsletter-dialog";
import ViewNewsletterDialog from "@/components/routes/admin/newsletter/preview-newsletter";
import NewsletterTable from "@/components/routes/admin/newsletter/table";
import AdminPagination from "@/components/routes/admin/pagination";
import { Separator } from "@/components/ui/separator";
import { useNewsletters } from "@/hooks/queries/use-newsletters";
import { usePaginatedInfinitePagination } from "@/hooks/use-paginated-infinite-query";
import { newslettersQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import type { Newsletter } from "@/types/schema";

export const Route = createFileRoute("/_adminLayout/admin/newsletter")({
  component: RouteComponent,
  loader: () => {
    queryClient.prefetchInfiniteQuery(
      newslettersQueries.getNewsletters({
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
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const newsletterResult = useNewsletters({
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
  } = usePaginatedInfinitePagination(newsletterResult, pageSize);

  return (
    <div className="lg:px-10 px-2">
      <div className="flex justify-between items-end-safe mb-2">
        <h2>
          All Members
          <span className="text-xs text-muted-foreground ml-2">[{total}]</span>
        </h2>
        <div className="flex gap-2">
          <AddNewsletterButton />
        </div>
      </div>
      <NewsletterDialogContextProvider
        value={{
          editOpen,
          setEditOpen,
          previewOpen,
          setPreviewOpen,
          newsletter,
          setNewsletter,
        }}
      >
        <NewsletterTable
          items={items}
          isFetchingNextPage={isFetchingNextPage}
          pageSize={pageSize}
        />
      </NewsletterDialogContextProvider>
      <Separator className="my-2" />
      <AdminPagination
        currentPage={currentPage}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <EditNewsletterDialog
        open={editOpen}
        setOpen={setEditOpen}
        newsletter={newsletter}
      />
      <ViewNewsletterDialog
        open={previewOpen}
        setOpen={setPreviewOpen}
        newsletter={newsletter}
      />
    </div>
  );
}
