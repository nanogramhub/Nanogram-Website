import NewsletterForm from "@/components/forms/newsletter-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateNewsletter } from "@/hooks/mutations/use-newsletter";
import type { NewsLetterFormValues } from "@/lib/validation";
import type { Newsletter } from "@/types/schema";
import { toast } from "sonner";

const EditNewsletterDialog = ({
  newsletter,
  open,
  setOpen,
}: {
  newsletter: Newsletter | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const updateNewsletter = useUpdateNewsletter();

  function handleSubmit(values: NewsLetterFormValues) {
    if (!newsletter) return;
    updateNewsletter.mutate(
      {
        ...values,
        $id: newsletter.$id,
        fileId: newsletter.fileId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Newsletter updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }
  if (!newsletter) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Newsletter Actions</DialogTitle>
          <DialogDescription>
            Manage this {newsletter.title}'s information.
          </DialogDescription>
          <ScrollArea className="max-h-[calc(100vh-120px)]">
            <NewsletterForm newsletter={newsletter} onSubmit={handleSubmit} />
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button
                type="submit"
                form="newsletter-form"
                disabled={updateNewsletter.isPending}
              >
                {updateNewsletter.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditNewsletterDialog;
