import Banner from "@/components/motion/event-banner";
import ShiftingCountdown from "@/components/motion/shifting-countdown";
import EventBanner from "@/components/shared/default/event-banner";
import { useGetNextEvent } from "@/hooks/queries/use-events";
import { usePerformance } from "@/hooks/use-performance";

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
      <EventBanner event={event} />
    </>
  );
};

export default NextEvent;
