import { Check, Edit2, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import ImageUploader from "@/components/shared/default/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useDeleteAvatarMutation,
  useUpdateAvatarMutation,
  useUpdateBioMutation,
  useUpdateNameMutation,
  useUpdateUsernameMutation,
} from "@/hooks/mutations/use-auth";
import { useAuthStore } from "@/store/use-auth-store";

const EditableField = ({
  label,
  value,
  onSave,
  isLoading,
}: {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = async () => {
    if (tempValue === value) {
      setIsEditing(false);
      return;
    }
    try {
      await onSave(tempValue);
      setIsEditing(false);
    } catch {
      // Error handling is usually done in the mutation's onError or here
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <tr>
      <td className="text-muted-foreground align-text-top py-2">{label}</td>
      <td className="text-xs ml-2 py-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="h-8 text-xs"
              autoFocus
              disabled={isLoading}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center group">
            <span className="font-light">{value || "None"}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};

const UserProfile = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [isUpdateAvatarOpen, setIsUpdateAvatarOpen] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  const { mutateAsync: updateName, isPending: isUpdatingName } =
    useUpdateNameMutation();
  const { mutateAsync: updateUsername, isPending: isUpdatingUsername } =
    useUpdateUsernameMutation();
  const { mutateAsync: updateBio, isPending: isUpdatingBio } =
    useUpdateBioMutation();
  const { mutateAsync: updateAvatar, isPending: isUpdatingAvatar } =
    useUpdateAvatarMutation();
  const { mutateAsync: deleteAvatar, isPending: isDeletingAvatar } =
    useDeleteAvatarMutation();

  if (!currentUser) return null;

  const handleUpdateName = async (newName: string) => {
    try {
      await updateName({ name: newName });
      toast.success("Name updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update name");
      }
    }
  };

  const handleUpdateUsername = async (newUsername: string) => {
    try {
      await updateUsername({ username: newUsername });
      toast.success("Username updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update username");
      }
    }
  };

  const handleUpdateBio = async (newBio: string) => {
    try {
      await updateBio({ bio: newBio });
      toast.success("Bio updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update bio");
      }
    }
  };

  const handleUpdateAvatar = async () => {
    if (!newAvatarFile) return;
    try {
      await updateAvatar({ avatar: newAvatarFile });
      toast.success("Avatar updated successfully");
      setIsUpdateAvatarOpen(false);
      setNewAvatarFile(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update avatar");
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      toast.success("Avatar deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete avatar");
      }
    }
  };

  return (
    <div className="flex lg:flex-row flex-col lg:items-center items-start lg:gap-8 gap-4 w-full py-4 px-2">
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <img
            src={currentUser.imageUrl}
            alt={currentUser.name}
            className="size-24 lg:size-32 rounded-full object-cover border-2 border-border shadow-sm"
          />
          {(isUpdatingAvatar || isDeletingAvatar) && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-full backdrop-blur-xs">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog
            open={isUpdateAvatarOpen}
            onOpenChange={setIsUpdateAvatarOpen}
          >
            <DialogTrigger
              render={(props) => (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5"
                  {...props}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              )}
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Avatar</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(100vh-200px)]">
                <div className="py-4">
                  <ImageUploader
                    onFileChange={setNewAvatarFile}
                    dropzoneClassName="min-h-48 h-auto"
                    imageStyles="rounded-full overflow-hidden size-32 sm:size-40 mx-auto"
                    cropAspectRatio={1}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsUpdateAvatarOpen(false);
                      setNewAvatarFile(null);
                    }}
                    disabled={isUpdatingAvatar}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpdateAvatar}
                    disabled={!newAvatarFile || isUpdatingAvatar}
                  >
                    {isUpdatingAvatar ? "Saving..." : "Save Avatar"}
                  </Button>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          {currentUser.imageId && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
              onClick={handleDeleteAvatar}
              disabled={isDeletingAvatar}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <table className="flex-1 w-full mt-2 lg:mt-0">
        <colgroup>
          <col style={{ width: "25%" }} />
          <col style={{ width: "75%" }} />
        </colgroup>
        <tbody>
          <EditableField
            label="Name"
            value={currentUser.name}
            onSave={handleUpdateName}
            isLoading={isUpdatingName}
          />
          <EditableField
            label="Username"
            value={currentUser.username}
            onSave={handleUpdateUsername}
            isLoading={isUpdatingUsername}
          />
          <EditableField
            label="Bio"
            value={currentUser.bio || ""}
            onSave={handleUpdateBio}
            isLoading={isUpdatingBio}
          />
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;
