import type { Nanogram } from "@/types/schema";

import TeamMember from "./team-member";

const GridTeamList = ({ teamMembers }: { teamMembers: Nanogram[] }) => {
  return (
    <ul className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-10">
      {teamMembers.map((member, index) => (
        <li key={index} className="flex flex-col gap-6 xl:flex-row">
          <TeamMember member={member} />
        </li>
      ))}
    </ul>
  );
};

export default GridTeamList;
