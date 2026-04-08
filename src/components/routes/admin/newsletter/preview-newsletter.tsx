import PDFPagePreview from "@/components/shared/news/pdf-page-preview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Newsletter } from "@/types/schema";

const ViewNewsletterDialog = ({
  open,
  setOpen,
  newsletter,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  newsletter: Newsletter | null;
}) => {
  if (!newsletter) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{newsletter.title}</DialogTitle>
          <DialogDescription>
            Manage {newsletter.title}'s information.
          </DialogDescription>
          <ScrollArea className="max-h-[calc(100vh-120px)]">
            <div className="flex flex-col gap-4 py-4">
              <PDFPagePreview url={newsletter.fileUrl} width={350} />
            </div>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNewsletterDialog;
