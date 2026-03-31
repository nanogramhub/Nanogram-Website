import type React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const LazyMotionComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Use Intersection Observer
  const [ref, inView] = useInView({
    triggerOnce: true, // Ensures animation only triggers once per load
    threshold: 0.2, // Adjust how much of the component should be visible before triggering
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
};
