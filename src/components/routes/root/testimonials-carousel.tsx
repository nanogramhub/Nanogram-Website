import { Suspense } from "react";
import { useInView } from "react-intersection-observer";

import AnimatedTestimonial from "@/components/motion/animated-testimonial";
import TestimonialDiv from "@/components/shared/default/testimonial-div";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTestimonials } from "@/hooks/queries/use-nanogram";
import { usePerformance } from "@/hooks/use-performance";

export default function Testimonials() {
  const { performance } = usePerformance();
  const { ref, inView } = useInView({ triggerOnce: true });
  const { data } = useGetTestimonials({ enabled: inView });

  if (!data) return <div ref={ref} />;
  const testimonials = data.rows;

  return (
    <section
      aria-label="Testimonials"
      className="relative w-full px-4 lg:pt-20 md:pt-32 pt-52 py-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {performance ? (
          <Carousel opts={{ loop: true }}>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.$id}>
                  <TestimonialDiv member={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <AnimatedTestimonial testimonials={testimonials} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
