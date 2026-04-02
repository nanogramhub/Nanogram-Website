import GridTeamList from "@/components/shared/default/grid-team-list";
import { useGetAluminiMembers } from "@/hooks/queries/use-nanogram";
import { usePersistentInfiniteQuery } from "@/hooks/use-persistent-infinite-query";
import type { Nanogram } from "@/types/schema";
import { useInView } from "react-intersection-observer";

const Alumini = () => {
  const { ref: containerRef, inView } = useInView({ triggerOnce: true });
  const infiniteQueryResult = useGetAluminiMembers({ enabled: inView });
  const { items: aluminiMembers, ref } =
    usePersistentInfiniteQuery<Nanogram>(infiniteQueryResult);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-4xl font-extrabold text-neutral-black">
            Core Collective
          </h2>
          <p className="mt-6 text-base font-normal text-neutral-black/70">
            A tribute to the alumini who took Nanogram to greater heights.
          </p>
        </div>
        <GridTeamList teamMembers={aluminiMembers} />
        <div ref={ref} />
      </div>
    </div>
  );
};

export default Alumini;
