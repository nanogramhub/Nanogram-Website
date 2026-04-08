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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateEvent } from "@/hooks/mutations/use-events";
import type { EventFormValues } from "@/lib/validation";
import type { Event } from "@/types/schema";
import { toast } from "sonner";

const EditEventDialog = ({
  event,
  open,
  setOpen,
}: {
  event: Event | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const updateMember = useUpdateEvent();

  function handleSubmit(values: EventFormValues) {
    if (!event) return;
    updateMember.mutate(
      {
        ...values,
        $id: event.$id,
        imageId: event.imageId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Event updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Actions</DialogTitle>
          <DialogDescription>
            Manage {event.title}'s information.
          </DialogDescription>
          <ScrollArea className="max-h-[calc(100vh-120px)]">
            <EventForm event={event} onSubmit={handleSubmit} />
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button
                type="submit"
                form="event-form"
                disabled={updateMember.isPending}
              >
                {updateMember.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
