import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePasswordMutation } from "@/hooks/mutations/use-auth";
import { updatePasswordSchema } from "@/lib/validation";

const UserPassword = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: updatePassword, isPending } =
    useUpdatePasswordMutation();

  const handleSave = async () => {
    // Basic validation
    const result = updatePasswordSchema.safeParse({
      oldPassword,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await updatePassword({ password, oldPassword });
      toast.success("Password updated successfully");
      setIsEditing(false);
      resetForm();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    }
  };

  const resetForm = () => {
    setOldPassword("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  return (
    <div className="py-2 w-full">
      {!isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 p-3 rounded-md border bg-background/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <ShieldCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Security</span>
                <span className="text-xs text-muted-foreground">
                  Keep your account secure by using a strong password
                </span>
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} className="w-fit">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4 rounded-md border bg-background animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-semibold">Change Password</h3>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              Current Password
            </label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className={errors.oldPassword ? "border-red-500" : ""}
              disabled={isPending}
            />
            {errors.oldPassword && (
              <p className="text-[10px] text-red-500 ml-1">
                {errors.oldPassword}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              New Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters, 1 letter, 1 number, 1 special"
              className={errors.password ? "border-red-500" : ""}
              disabled={isPending}
            />
            {errors.password && (
              <p className="text-[10px] text-red-500 ml-1">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className={errors.confirmPassword ? "border-red-500" : ""}
              disabled={isPending}
            />
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 ml-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPassword;
