import { useEffect } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { Users, Cake, Cog, GraduationCap, type LucideIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";

const Achievements = () => {
  const stats: {
    icon: LucideIcon;
    title: string;
    value: string;
    color: string;
    textcolor: string;
  }[] = [
    {
      icon: Cake,
      title: "Founded",
      value: "2024",
      color: "bg-primary",
      textcolor: "text-primary-foreground",
    },
    {
      icon: Users,
      title: "Active Members",
      value: "50+",
      color: "bg-secondary",
      textcolor: "text-secondary-foreground",
    },
    {
      icon: Cog,
      title: "Workshops and Events",
      value: "10+",
      color: "bg-primary",
      textcolor: "text-primary-foreground",
    },
    {
      icon: GraduationCap,
      title: "Students Reached",
      value: "350+",
      color: "bg-secondary",
      textcolor: "text-secondary-foreground",
    },
  ];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const valueVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="w-full pt-14" ref={ref}>
      <div className="w-full flex flex-col gap-5 text-center">
        <h2 className="text-5xl font-medium mb-4">Achievements</h2>
        <p className="text-lg font-normal text-muted-foreground px-4 mb-10">
          Nanogram - The Tech Hub has been at the forefront of technological
          innovation and education.
          <br />
          We are proud of our accomplishments and the growth of our community.
        </p>
      </div>

      {/* Wrapper for proper spacing */}
      <div className="mb-16">
        <div className="relative">
          <img
            src="/assets/images/gallery_16.jpg"
            alt="Team collaboration"
            className="w-full h-[400px] object-cover grayscale"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-4 p-4 transform translate-y-1/2"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                className={`${stat.color} ${stat.textcolor} p-6 rounded-lg shadow-lg w-[40%] md:w-48 text-center`}
              >
                <div className="flex justify-center mb-2">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
                <motion.span
                  variants={valueVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="text-3xl font-bold"
                >
                  {stat.value}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
