import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
} from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
}

const PDFViewer = ({ url, title, subtitle, onBack }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages || 1);
    });
  };

  return (
    <div className="flex flex-col h-full bg-base-300/50 rounded-3xl overflow-hidden border border-border shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 px-4 bg-base-100 border-b border-border z-10 sticky top-0 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon-sm" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
          )}
          <div className="flex flex-col -space-y-0.5">
            <h2 className="font-bold text-sm md:text-base leading-tight truncate max-w-[120px] sm:max-w-[200px] md:max-w-md">
              {title || "Newsletter"}
            </h2>
            {subtitle && (
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium italic">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pagination Controls */}
          <div className="flex items-center gap-1 bg-base-200 rounded-xl p-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="px-1 md:px-2 text-[11px] md:text-sm font-bold min-w-[50px] md:min-w-[70px] text-center">
              {pageNumber} / {numPages || "--"}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pageNumber >= (numPages || 1)}
              onClick={() => changePage(1)}
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          <Separator orientation="vertical" />

          <div className="hidden lg:flex items-center gap-1 bg-base-200 rounded-xl p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            >
              <Minimize size={16} />
            </Button>
            <span className="px-1 text-[11px] font-bold w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            >
              <Maximize size={16} />
            </Button>
          </div>

          <Button
            nativeButton={false}
            variant="default"
            size="sm"
            className="hidden md:flex gap-2"
            render={(props) => (
              <a href={url} download {...props}>
                <Download size={16} />
                <span className="text-xs">Download</span>
              </a>
            )}
          />
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto bg-base-200/50 p-2 md:p-8 flex justify-center custom-scrollbar scroll-smooth">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center gap-4 py-32">
              <Spinner />
              <p className="text-muted-foreground text-sm animate-pulse tracking-wide font-medium">
                Preparing views...
              </p>
            </div>
          }
          error={
            <div className="py-20 text-error flex flex-col items-center gap-4 text-center">
              <div className="p-3 bg-error/10 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="font-bold">Failed to load publication</p>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            className="shadow-2xl rounded-sm transition-opacity duration-300"
            loading={
              <div className="w-[300px] sm:w-[600px] h-[800px] bg-base-100 flex items-center justify-center rounded-lg shadow-inner">
                <Spinner />
              </div>
            }
          />
        </Document>
      </div>

      {/* Footer / Mobile Controls */}
      <footer className="md:hidden p-3 bg-base-100/90 backdrop-blur-md border-t border-border flex justify-center items-center gap-4">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setScale((s) => Math.max(0.7, s - 0.1))}
        >
          <Minimize size={14} />
        </Button>
        <span className="text-[10px] font-bold text-muted-foreground">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
        >
          <Maximize size={14} />
        </Button>

        <Separator />

        <Button
          nativeButton={false}
          variant="default"
          size="xs"
          className="gap-2"
          render={(props) => (
            <a href={url} download {...props}>
              <Download size={14} />
              <span>Download</span>
            </a>
          )}
        />
      </footer>
    </div>
  );
};

export default PDFViewer;
