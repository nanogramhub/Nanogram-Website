import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";

import { Spinner } from "@/components/ui/spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFPagePreview = ({ width, url }: { width: number; url: string }) => {
  return (
    <div className="w-full h-auto overflow-hidden">
      <Document
        file={url}
        loading={
          <div className="w-full flex justify-center items-center py-10 bg-muted/20">
            <Spinner />
          </div>
        }
      >
        <Page
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={width}
          className="max-w-full h-auto"
        />
      </Document>
    </div>
  );
};

export default PDFPagePreview;
