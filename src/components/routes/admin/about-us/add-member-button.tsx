import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateMember } from "@/hooks/mutations/use-nanogram";
import type { MemberFormValues } from "@/lib/validation";

const AddMemberButton = () => {
  const [open, setOpen] = useState(false);
  const createMember = useCreateMember();

  function handleSubmit(values: MemberFormValues) {
    createMember.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Member added successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) => (
          <Button {...props}>
            <Plus />
            Add Member
          </Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add a new member to the team.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-120px)]">
          <MemberForm onSubmit={handleSubmit} />
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button
              type="submit"
              form="member-form"
              disabled={createMember.isPending}
            >
              {createMember.isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberButton;
