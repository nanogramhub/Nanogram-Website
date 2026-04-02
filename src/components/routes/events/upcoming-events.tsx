import EventCard from "@/components/shared/default/event-card";
import { useGetUpcomingEvents } from "@/hooks/queries/use-events";
import { useInView } from "react-intersection-observer";

const Upcoming = () => {
  const { ref: containerRef, inView } = useInView({ triggerOnce: true });
  const { data: events } = useGetUpcomingEvents({ enabled: inView });

  if (!events) return null;

  return (
    <>
      {events.rows.length !== 0 ? (
        <section
          className="max-w-7xl mx-auto w-full text-base-content-black py-16 sm:py-10"
          id="new-events"
          ref={containerRef}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {events.rows.map((event, index) => {
                const date = new Date(event?.date);
                return (
                  <EventCard
                    key={index}
                    date={date.toDateString()}
                    title={event?.title}
                    description={event?.description}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default Upcoming;
