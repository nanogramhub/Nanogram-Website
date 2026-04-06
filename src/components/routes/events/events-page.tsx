import EventGallery from "./event-gallery";
import Faq from "./faq";
import NextEvent from "./next-event";
import RecentEvent from "./recent-event";
import Upcoming from "./upcoming-events";

const Events = () => {
  return (
    <>
      <NextEvent />
      <RecentEvent />
      <Upcoming />
      <EventGallery />
      <Faq />
    </>
  );
};

export default Events;
