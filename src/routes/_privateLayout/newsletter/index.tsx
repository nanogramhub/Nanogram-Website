import PDFPagePreview from "@/components/shared/news/pdf-page-preview";
import { useNewsletters } from "@/hooks/queries/use-newsletters";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { newslettersQueries } from "@/lib/query/query-options";
import { queryClient } from "@/router";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/_privateLayout/newsletter/")({
  component: RouteComponent,
  loader: () => {
    queryClient.prefetchInfiniteQuery(
      newslettersQueries.getNewsletters({ enabled: true }),
    );
  },
});

function RouteComponent() {
  const getNewslettersResult = useNewsletters({ enabled: true });
  const { items, ref } = usePersistentInfiniteQuery(getNewslettersResult);

  if (getNewslettersResult.isLoading || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const highlight = items[0];
  const others = items.slice(1);

  return (
    <div className="flex flex-col gap-12 p-6 max-w-6xl w-full mx-auto mb-20 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Newsletters
        </h1>
        <p className="text-muted-foreground text-base">
          Latest updates and institutional insights.
        </p>
      </header>

      {/* Featured Newsletter */}
      <section className="group">
        <Link
          to="/newsletter/$newsId"
          params={{ newsId: highlight.$id }}
          className="flex flex-col sm:flex-row gap-5 bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 max-w-2xl"
        >
          <div className="w-full sm:w-48 shrink-0 p-1 bg-muted/10">
            <div className="rounded-lg overflow-hidden shadow-sm h-full flex items-center justify-center">
              <PDFPagePreview width={200} url={highlight.fileUrl} />
            </div>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[9px]">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Latest Issue
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {highlight.title || "Latest Publication"}
              </h2>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <Calendar size={13} />
                <span>
                  {format(new Date(highlight.$createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
            <div className="pt-1 flex items-center gap-1 text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">
              Read Issue
              <span className="text-sm">→</span>
            </div>
          </div>
        </Link>
      </section>

      {/* All Newsletters Grid */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-foreground tracking-tight underline sm:un-underline decoration-primary/30 decoration-2 underline-offset-8">
          Previous Issues
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {others.length === 0 ? (
            <span className="text-muted-foreground">
              No previous issues found
            </span>
          ) : (
            others.map((news) => (
              <Link
                key={news.$id}
                to="/newsletter/$newsId"
                params={{ newsId: news.$id }}
                className="group flex flex-col gap-3 bg-card/40 hover:bg-card border border-border/40 hover:border-primary/20 p-3 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-3/4 rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
                  <PDFPagePreview width={220} url={news.fileUrl} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                    {news.title || "Newsletter"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground uppercase font-medium">
                    {format(new Date(news.$createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <div ref={ref} className="h-20 flex justify-center items-center">
        {getNewslettersResult.hasNextPage && (
          <span className="loading loading-dots loading-md text-primary/40"></span>
        )}
      </div>
    </div>
  );
}
