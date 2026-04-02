import Activities from "./activities-block";
import Alumini from "./alumini-grid";
import ContactUs from "./contact-us";
import Mission from "./our-mission";
import Team from "./core-team-grid";
import Unique from "./unique-block";

const AboutUs = () => {
  return (
    <>
      <Mission />
      <Unique />
      <Team />
      <Alumini />
      <Activities />
      <ContactUs />
    </>
  );
};

export default AboutUs;
