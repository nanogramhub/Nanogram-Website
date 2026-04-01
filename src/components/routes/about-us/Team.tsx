import GridTeamList from "@/components/shared/default/GridTeamList";
import { useGetCoreMembers } from "@/hooks/queries/useNanogram";
import { usePersistentInfiniteQuery } from "@/hooks/usePersistentInfiniteQuery";
import type { Nanogram } from "@/types/api";
import { useInView } from "react-intersection-observer";

const Team = () => {
  const { ref: containerRef, inView } = useInView({ triggerOnce: true });
  const infiniteQueryResult = useGetCoreMembers({ enabled: inView });
  const { items: teamMembers, ref } =
    usePersistentInfiniteQuery<Nanogram>(infiniteQueryResult);

  return (
    <div className="w-full pt-20" id="team" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-4xl font-extrabold text-neutral-black">
            Meet Our Team
          </h2>
          <p className="mt-6 text-base font-normal text-neutral-black/70">
            Our team consists of passionate professionals dedicated to advancing
            technology.
          </p>
        </div>

        <GridTeamList teamMembers={teamMembers} />
        <div ref={ref} />
      </div>
    </div>
  );
};

export default Team;
