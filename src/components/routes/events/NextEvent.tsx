import { Button } from "@/components/ui/button";
import ShiftingCountdown from "@/components/motion/ShiftingCountdown";
import Banner from "@/components/motion/Banner";
import { CalendarDays, Pin } from "lucide-react";
import { useGetNextEvent } from "@/hooks/queries/useEvents";
import { formatDateTime } from "@/lib/utils";
import { usePerformance } from "@/hooks/usePerformance";

const NextEvent = () => {
  const { performance } = usePerformance();
  const { data: event } = useGetNextEvent();

  if (!event) {
    if (performance)
      return (
        <div className="w-full bg-linear-to-b from-primary to-secondary text-white text-center p-6 shadow-lg flex flex-col items-center justify-center space-y-4">
          <div className="text-xl font-semibold">
            🚀 No new events to register right now!
          </div>
          <p className="text-sm opacity-80">
            Stay tuned for upcoming announcements.
          </p>
        </div>
      );
    return <Banner />;
  }

  return (
    <>
      {event.date && (
        <ShiftingCountdown
          title={event.registration ? "Register Now!" : "Event Update!"}
          countdownFrom={new Date(event.date)}
        />
      )}
      <section className="max-w-7xl mx-auto w-full flex lg:flex-row flex-col justify-center gap-5 md:px-10 px-0">
        <div className="flex justify-center items-center w-full md:p-0 p-8">
          <img
            src={event.imageUrl || "/assets/images/placeholder.png"}
            alt="Event Teaser"
            className="rounded-xl "
            loading="lazy"
          />
        </div>
        <div className="w-full flex justify-between flex-col p-10 gap-10">
          <div className="flex flex-col w-full gap-5">
            <h1 className="text-3xl font-bold text-base-content">
              {event?.title}
            </h1>
            <p className="text-lg text-base-content/70 p-2">{event?.content}</p>
            <div className="text-lg text-base-content/70 font-semibold p-4">
              <div className="flex justify-start items-center gap-2">
                <CalendarDays />{" "}
                {event.date && `${formatDateTime(event.date, "PPPp")}`}
              </div>
              <div className="flex justify-start items-center gap-2">
                {event.location && (
                  <>
                    <Pin /> {event.location}
                  </>
                )}
              </div>
            </div>
          </div>
          {event.registration && (
            <Button
              className={"w-fit btn btn-primary"}
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
          )}
        </div>
      </section>
    </>
  );
};

export default NextEvent;
