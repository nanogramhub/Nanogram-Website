import EventBanner from "@/components/shared/default/event-banner";
import EventCard from "@/components/shared/default/event-card";
import EventShowcase from "@/components/shared/default/event-showcase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Event } from "@/types/schema";

const ViewEventDialog = ({
  open,
  setOpen,
  event,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: Event | null;
}) => {
  if (!event) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:min-w-7xl">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            Manage this {event.title}'s information.
          </DialogDescription>
          <ScrollArea className="max-h-[calc(100vh-120px)]">
            <div className="flex flex-col gap-4 py-4">
              <EventBanner event={event} />
              <Separator />
              <EventCard
                date={event.date}
                title={event.title}
                description={event.description}
              />
              <Separator />
              <EventShowcase event={event} />
            </div>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventDialog;
