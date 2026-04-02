import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetEvents } from "@/hooks/queries/use-events";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import { useInView } from "react-intersection-observer";

const EventGallery = () => {
  const { ref: containerRef, inView } = useInView({ triggerOnce: true });
  const getEventsResult = useGetEvents({ enabled: inView });
  const { items: events, ref } = usePersistentInfiniteQuery(getEventsResult);

  return (
    <section className="max-w-7xl mx-auto py-20" ref={containerRef}>
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-12">
        <div className="w-full flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-4xl font-semibold">Event Gallery</h1>
          <p className="font-normal text-base-content-neutral/70">
            A glimpse into our past events and activities. Experience the
            excitement and innovation at Nanogram - The Tech Hub.
          </p>
        </div>
        <div className="px-10">
          <Carousel>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselContent>
              {events.map((highlight, index) => (
                <CarouselItem
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5 "
                  key={index}
                >
                  <div
                    className="relative group"
                    ref={index === events.length - 1 ? ref : undefined}
                  >
                    <div className="overflow-hidden aspect-w-3 aspect-h-4 flex justify-center items-center">
                      <div className="object-cover w-full h-full transition-all duration-300 origin-bottom group-hover:scale-110 aspect-3/4">
                        <img
                          alt={highlight.title}
                          className="object-cover w-full h-full transition-all duration-300 origin-bottom group-hover:scale-110 aspect-3/4"
                          src={
                            highlight.imageUrl ||
                            "/assets/images/placeholder.png"
                          }
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute z-20 flex flex-col justify-center items-center">
                        <h3 className="text-base font-bold text-primary-content text-center">
                          {highlight.title}
                        </h3>
                        <p className="text-sm font-medium text-primary-content/75 text-center">
                          {highlight.subtitle}
                        </p>
                      </div>
                      <div className="absolute z-10 inset-0 bg-neutral/20 pointer-events-none"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default EventGallery;
