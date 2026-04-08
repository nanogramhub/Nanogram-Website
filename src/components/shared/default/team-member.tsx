import { GitHub, Instagram, LinkedIn } from "@/components/icons/brands";
import type { Nanogram } from "@/types/schema";

const TeamMember = ({ member }: { member: Nanogram }) => {
  return (
    <>
      <div className="w-40 h-50 aspect-4/5 flex-none rounded-2xl object-cover">
        <img
          alt={member.name}
          loading="lazy"
          className="w-40 h-50 aspect-4/5 flex-none rounded-2xl object-cover"
          src={member.avatarUrl}
        />
      </div>
      <div className="flex-auto">
        <h3 className="text-lg font-semibold leading-8 tracking-tight text-base-content">
          {member.name}
        </h3>
        <p className="text-base leading-7 text-base-content/70">
          {member.role}
        </p>

        {/* Social Links */}
        <div className="mt-6 flex space-x-4">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary"
            >
              <LinkedIn className="size-8" />
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary"
            >
              <Instagram className="size-8" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content hover:text-primary"
            >
              <GitHub className="size-8 dark:fill-white" />
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamMember;
