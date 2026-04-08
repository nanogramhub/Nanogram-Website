import EventShowcase from "@/components/shared/default/event-showcase";
import { useGetLatestCompletedEvent } from "@/hooks/queries/use-events";

const RecentEvent = () => {
  const { data: event } = useGetLatestCompletedEvent();

  if (!event) return null;

  return (
    <section className="max-w-7xl mx-auto w-full flex flex-col gap-10">
      <EventShowcase event={event} />
      <div className="flex md:flex-row flex-col w-full lg:gap-10 gap-2 justify-center">
        <div className="flex w-full justify-end items-end">
          <img
            src="/assets/images/nano9124.png"
            alt="image"
            className="h-3/4 w-3/4 md:w-fit rounded-xl"
            loading="lazy"
          />
        </div>
        <div className="flex justify-center w-full">
          <img
            src="/assets/images/nano51224.png"
            alt="image"
            className="rounded-xl md:w-full w-[75%]"
            loading="lazy"
          />
        </div>
        <div className="w-full flex">
          <img
            src="/assets/images/nano13924.png"
            alt="image"
            className="h-3/4 w-3/4 md:w-fit rounded-xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default RecentEvent;
