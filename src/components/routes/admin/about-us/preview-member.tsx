import TeamMember from "@/components/shared/default/team-member";
import TestimonialDiv from "@/components/shared/default/testimonial-div";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Nanogram } from "@/types/schema";

const ViewMemberDialog = ({
  open,
  setOpen,
  member,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  member: Nanogram | null;
}) => {
  if (!member) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:min-w-3xl">
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
          <DialogDescription>
            Manage this {member.name}'s information.
          </DialogDescription>
          <ScrollArea className="max-h-[calc(100vh-120px)]">
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-6 xl:flex-row">
                <TeamMember member={member} />
              </div>
              {member.content && (
                <>
                  <Separator />
                  <TestimonialDiv
                    member={{ ...member, content: member.content }}
                  />
                </>
              )}
            </div>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMemberDialog;
