import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import EventForm from "@/components/forms/event-form";
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
import { useCreateEvent } from "@/hooks/mutations/use-events";
import type { EventFormValues } from "@/lib/validation";

const AddEventButton = () => {
  const [open, setOpen] = useState(false);
  const createEvent = useCreateEvent();

  function handleSubmit(values: EventFormValues) {
    createEvent.mutate(values, {
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
          <EventForm onSubmit={handleSubmit} />
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button
              type="submit"
              form="event-form"
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventButton;
