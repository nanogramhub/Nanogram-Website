import MemberForm from "@/components/forms/member-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateMember } from "@/hooks/mutations/use-nanogram";
import type { MemberFormValues } from "@/lib/validation";
import type { Nanogram } from "@/types/schema";
import { toast } from "sonner";

const EditMemberDialog = ({
  member,
  open,
  setOpen,
}: {
  member: Nanogram | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const updateMember = useUpdateMember();

  function handleSubmit(values: MemberFormValues) {
    if (!member) return;
    updateMember.mutate(
      {
        ...values,
        $id: member.$id,
        avatarId: member.avatarId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Member updated successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Member Actions</DialogTitle>
          <DialogDescription>
            Manage this {member.name}'s information.
          </DialogDescription>
          <ScrollArea className="max-h-[calc(100vh-120px)]">
            <MemberForm member={member} onSubmit={handleSubmit} />
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button
                type="submit"
                form="member-form"
                disabled={updateMember.isPending}
              >
                {updateMember.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
