import { Suspense } from "react";
import AnimatedTestimonial from "@/components/motion/AnimatedTestimonial";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTestimonials } from "@/hooks/queries/useNanogram";
import { usePerformance } from "@/hooks/usePerformance";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TestimonialDiv from "@/components/shared/default/TestimonialDiv";

export default function Testimonials() {
  const { performance } = usePerformance();
  const { data } = useGetTestimonials();

  if (!data) return null;
  const testimonials = data.rows;

  return (
    <section
      aria-label="Testimonials"
      className="relative w-full px-4 lg:pt-20 md:pt-32 pt-52 py-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {performance ? (
          <Carousel>
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
