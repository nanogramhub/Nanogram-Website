import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateNewsletter } from "@/hooks/mutations/use-newsletter";
import type { NewsLetterFormValues } from "@/lib/validation";

const AddNewsletterButton = () => {
  const [open, setOpen] = useState(false);
  const createNewsletter = useCreateNewsletter();

  function handleSubmit(values: NewsLetterFormValues) {
    createNewsletter.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Event added successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) => (
          <Button {...props}>
            <Plus />
            Add Event
          </Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>Add a new event to the team.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-120px)]">
          <NewsletterForm onSubmit={handleSubmit} />
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button
              type="submit"
              form="newsletter-form"
              disabled={createNewsletter.isPending}
            >
              {createNewsletter.isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsletterButton;
