import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, TriangleAlert } from "lucide-react";

import PDFViewer from "@/components/shared/news/pdf-viewer";
import { useNewsletterById } from "@/hooks/queries/use-newsletters";
import { newslettersQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";

export const Route = createFileRoute("/_privateLayout/newsletter/$newsId")({
  component: RouteComponent,
  loader: ({ params }) => {
    queryClient.prefetchQuery(
      newslettersQueries.getNewsletterById(params.newsId),
    );
  },
});

function RouteComponent() {
  const { newsId } = Route.useParams();
  const { data: newsletter, isLoading, isError } = useNewsletterById(newsId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto h-[90vh] justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-muted-foreground animate-pulse text-lg">
          Preparing your newsletter...
        </p>
      </div>
    );
  }

  if (isError || !newsletter) {
    return (
      <div className="flex flex-col gap-6 p-12 max-w-7xl mx-auto h-[80vh] justify-center items-center text-center">
        <div className="p-4 bg-error/10 rounded-full text-error mb-4">
          <TriangleAlert className="size-12" />
        </div>
        <h2 className="text-3xl font-bold">Newsletter not found</h2>
        <p className="text-muted-foreground max-w-md">
          The newsletter you are looking for might have been moved or doesn't
          exist anymore.
        </p>
        <Link
          to="/newsletter"
          className="btn btn-outline btn-primary rounded-xl px-8"
        >
          <ArrowLeft size={18} />
          Back to Newsletters
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      <main className="flex-1 p-2 md:p-4 flex justify-center bg-muted/10 h-full overflow-hidden">
        <div className="w-full max-w-6xl h-full">
          <PDFViewer
            url={newsletter.fileUrl}
            title={newsletter.title}
            subtitle={format(new Date(newsletter.$createdAt), "MMMM dd, yyyy")}
            onBack={() => window.history.back()}
          />
        </div>
      </main>
    </div>
  );
}
