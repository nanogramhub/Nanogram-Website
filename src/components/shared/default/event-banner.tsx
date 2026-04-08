import { CalendarDays, Pin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { Event } from "@/types/schema";

const EventBanner = ({ event }: { event: Event }) => {
  return (
    <section className="max-w-7xl mx-auto w-full flex lg:flex-row flex-col justify-center gap-5 md:px-10 px-0">
      <div className="flex justify-center items-center w-full md:p-0 p-8">
        <img
          src={event.imageUrl || "/assets/images/placeholder.png"}
          alt="Event Teaser"
          className="rounded-xl "
          loading="lazy"
        />
      </div>
      <div className="w-full flex justify-between flex-col p-10">
        <div className="flex flex-col w-full gap-5">
          <h1 className="text-3xl font-bold text-foreground">{event?.title}</h1>
          <p className="text-base text-muted-foreground p-2 whitespace-pre-wrap wrap-break-word">
            {event?.content}
          </p>
          <div className="text-xs w-fit text-chart-2 font-semibold p-4 flex flex-col gap-2">
            <Button
              nativeButton={false}
              size="lg"
              className="flex justify-start"
              render={(props) => (
                <div {...props}>
                  <CalendarDays />
                  <span>
                    {event.date && `${formatDateTime(event.date, "PPPp")}`}
                  </span>
                </div>
              )}
            />
            <Button
              nativeButton={false}
              size="lg"
              variant="outline"
              className="flex justify-start"
              render={(props) => (
                <div {...props}>
                  {event.location && (
                    <>
                      <Pin /> {event.location}
                    </>
                  )}
                </div>
              )}
            />
          </div>
        </div>
        {event.registration && (
          <div className="p-4">
            <Button
              nativeButton={false}
              size="lg"
              className="w-fit"
              render={(props) => (
                <a
                  {...props}
                  href={event.registration ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register now
                </a>
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EventBanner;
