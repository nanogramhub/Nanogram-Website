import Achievements from "./achievements-block";
import Gallery from "./gallery-block";
import Hero from "./hero-section";
import Highlights from "./highlights-block";
import Initiatives from "./out-Initiatives";
import Testimonials from "./testimonials-carousel";

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
