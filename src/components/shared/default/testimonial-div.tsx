import type { Testimonial } from "@/types/components";

const TestimonialDiv = ({ member }: { member: Testimonial }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={member.avatarUrl}
        alt={member.name}
        className="w-24 h-24 rounded-full border border-neutral-black/10 object-cover mx-auto"
      />
      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
      <p className="text-neutral-black/70 mb-4">{member.role}</p>
      <blockquote className="text-lg italic text-neutral-black">
        "{member.content}"
      </blockquote>
    </div>
  );
};

export default TestimonialDiv;
