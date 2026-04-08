import type { Event } from "@/types/schema";

const EventShowcase = ({ event }: { event: Event }) => {
  return (
    <div className="w-full flex lg:flex-row flex-col justify-center gap-5 mt-5">
      <div className="w-full flex justify-between flex-col p-10 gap-10">
        <div className="flex flex-col w-full gap-5">
          <h2 className="text-3xl font-bold">{event.title}</h2>
          <p className="text-base text-muted-foreground p-2 whitespace-pre-wrap wrap-break-word">
            {event.content}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center md:p-0 p-8 w-full">
        <img
          src={event.imageUrl || "/assets/images/placeholder.png"}
          alt="Event Teaser"
          className="rounded-xl"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default EventShowcase;
