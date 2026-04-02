import Hero from "./hero-section";
import Gallery from "./gallery-block";
import Testimonials from "./testimonials-carousel";
import Initiatives from "./out-Initiatives";
import Highlights from "./highlights-block";
import Achievements from "./achievements-block";

const Home = () => {
  return (
    <>
      <Hero />
      <Initiatives />
      <Highlights />
      <Gallery />
      <Achievements />
      <Testimonials />
    </>
  );
};

export default Home;
