import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

const Highlights = () => {
  return (
    <div className="w-full h-full flex lg:flex-row flex-col gap-10 md:px-14 px-10 py-10 max-w-2xl lg:max-w-7xl mx-auto overflow-clip">
      <div className="w-full h-full flex -space-x-[12%] justify-center">
        <div className="lg:size-1/3 size-52 bg-accent rounded-xl shadow-lg -rotate-30 aspect-square">
          <img
            src="/assets/images/home_1.jpg"
            alt="event-img"
            className="rounded-xl object-cover size-full"
          />
        </div>
        <div className="lg:size-1/3 size-52 bg-accent rounded-xl shadow-lg -rotate-20 aspect-square">
          <img
            src="/assets/images/home_2.jpg"
            alt="event-img"
            className="rounded-xl object-cover size-full"
          />
        </div>
        <div className="lg:size-1/3 size-52 bg-accent rounded-xl shadow-lg -rotate-10 aspect-square">
          <img
            src="/assets/images/home_3.jpg"
            alt="event-img"
            className="rounded-xl object-cover size-full"
          />
        </div>
        <div className="lg:size-1/3 size-52 bg-accent rounded-xl shadow-lg rotate-0 aspect-square">
          <img
            src="/assets/images/home_4.jpg"
            alt="event-img"
            className="rounded-xl object-cover size-full"
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <h2 className="text-5xl font-medium mb-4">Highlights</h2>
        <p className="text-lg font-normal text-muted-foreground px-4">
          At Nanogram we actively engage in various activities to keep our
          members updated with the latest trends in technology.
        </p>
        <Button
          nativeButton={false}
          variant="link"
          className={"w-fit ml-2 text-chart-2"}
          render={(props) => (
            <Link to="/events" {...props}>
              Events at Nanogram
            </Link>
          )}
        />
      </div>
    </div>
  );
};

export default Highlights;
