import ParticleRing from "@/components/motion/ParticleRing";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { Suspense } from "react";
import { useGetTeamMembers } from "@/hooks/queries/use-nanogram";
import { Skeleton } from "@/components/ui/skeleton";
import { range } from "@/lib/utils";
import { toast } from "sonner";
import { usePerformance } from "@/hooks/use-performance";

const Hero = () => {
  const { data: teamMembers, isPending, isError } = useGetTeamMembers();
  const { performance } = usePerformance();

  if (isError) {
    toast.error("Failed to fetch team members");
  }

  return (
    <section className="mx-auto w-full h-dvh flex flex-col">
      <div className="w-full h-5/6 relative">
        {performance ? (
          <div className="w-full h-full bg-primary" />
        ) : (
          <Suspense fallback={<div className="w-full h-full bg-primary" />}>
            <ParticleRing />
          </Suspense>
        )}
        <div className="absolute top-0 left-0 max-w-full w-full h-full flex flex-col justify-end pointer-events-none md:p-20 p-4">
          <div className="pointer-events-auto">
            <h1 className="font-extrabold uppercase md:text-7xl text-4xl text-white mb-4">
              Nanogram | the tech hub
            </h1>
            <p className="text-white font-bold text-xl max-w-2xl mb-10">
              Join us in exploring the fascinating world of electronics and
              technology. Discover our activities, events, and resources
              designed for tech enthusiasts.
            </p>
            <div className="w-full flex md:flex-row flex-col gap-5 pointer-events-auto">
              <Button
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-fit text-primary-foreground"
                render={(props) => (
                  <Link to="/community" {...props}>
                    Join the Community for Free!
                  </Link>
                )}
              />
              <Button
                nativeButton={false}
                variant="link"
                size="lg"
                className={
                  "w-fit no-underline backdrop-blur-lg group flex items-center gap-1 font-semibold leading-6"
                }
                render={(props) => (
                  <Link {...props} to="/about-us" hash="team">
                    <p className="text-primary-foreground">Meet the Team</p>
                    <span className="ml-2 pt-1 flex items-center h-4 w-4 transition-transform duration-200 transform group-hover:translate-x-1">
                      <ArrowRight className="text-primary-foreground" />
                    </span>
                  </Link>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex md:flex-row flex-col gap-5 md:justify-start justify-center items-center overflow-hidden py-6 md:px-20 px-0">
        <div className="flex -space-x-6">
          {isPending
            ? range(5).map((index: number) => (
                <Skeleton
                  key={index}
                  className="size-16 rounded-full bg-muted-foreground z-2"
                />
              ))
            : teamMembers && (
                <>
                  {teamMembers.rows?.map((member, index: number) => (
                    <div
                      key={index}
                      className="size-16 shadow-lg rounded-full bg-secondary"
                      style={{
                        zIndex: 10 - index,
                      }}
                    >
                      <img
                        src={
                          member.avatarUrl || "/assets/images/placeholder.png"
                        }
                        alt="img"
                        className="size-16 rounded-full border border-neutral-black/10 object-cover mx-auto"
                      />
                    </div>
                  ))}
                  <div className="flex justify-center items-center size-16 shadow-lg rounded-full bg-muted-foreground text-muted -z-1">
                    <Plus />
                  </div>
                </>
              )}
        </div>
        <div className="flex px-10">
          <p className="font-semibold text-muted-foreground text-justify">
            Meet passionate tech enthusiasts like you. Join us in exploring the
            fascinating world of electronics and technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
