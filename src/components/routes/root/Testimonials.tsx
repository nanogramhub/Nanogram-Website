import { Suspense } from "react";
import AnimatedTestimonial from "@/components/motion/AnimatedTestimonial";
import { Skeleton } from "@/components/ui/skeleton";

export default function Testimonials() {
  return (
    <section
      aria-label="Testimonials"
      className="relative w-full px-4 lg:pt-20 md:pt-32 pt-52 py-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <AnimatedTestimonial />
        </Suspense>
      </div>
    </section>
  );
}
