import { Edit2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GitHub, Google } from "@/components/icons/brands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateEmailMutation } from "@/hooks/mutations/use-auth";
import { useGetIdentities } from "@/hooks/queries/use-auth";
import { api } from "@/lib/appwrite/api";
import { useAuthStore } from "@/store/use-auth-store";

const providers = ["google", "github"] as const;
type Provider = (typeof providers)[number];

const EditableEmailField = ({ email }: { email: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState("");
  const { mutateAsync: updateEmail, isPending } = useUpdateEmailMutation();

  const handleSave = async () => {
    if (newEmail === email) {
      setIsEditing(false);
      return;
    }
    if (!password) {
      toast.error("Please enter your current password");
      return;
    }
    try {
      await updateEmail({ email: newEmail, password });
      toast.success("Email update link sent to your new email");
      setIsEditing(false);
      setPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update email");
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-md border p-3 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Email
            </span>
            {!isEditing && <span className="font-medium">{email}</span>}
          </div>
        </div>
        {!isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8"
          >
            <Edit2 className="h-3.5 w-3.5 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              New Email Address
            </label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new-email@example.com"
              className="h-9"
              disabled={isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              Current Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to confirm"
              className="h-9"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setNewEmail(email);
                setPassword("");
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {isPending ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Identity = ({
  provider,
  email,
}: {
  provider: Provider;
  email: string;
}) => {
  switch (provider) {
    case "google":
      return (
        <div className="flex w-full items-center gap-3 rounded-md text-sm p-3 bg-background border">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            <Google className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Connected with Google
            </span>
            <span className="font-medium">{email}</span>
          </div>
        </div>
      );
    case "github":
      return (
        <div className="flex w-full items-center gap-3 rounded-md text-sm p-3 bg-background border">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            <GitHub className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Connected with GitHub
            </span>
            <span className="font-medium">{email}</span>
          </div>
        </div>
      );
    default:
      return provider satisfies never;
  }
};

const ConnectButton = ({ provider }: { provider: Provider }) => {
  const handleConnect = async () => {
    if (provider === "google") {
      await api.auth.loginWithGoogle();
    } else if (provider === "github") {
      await api.auth.loginWithGithub();
    }
  };

  switch (provider) {
    case "google":
      return (
        <button
          onClick={handleConnect}
          className="flex w-full items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 text-sm font-medium text-black transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900"
        >
          <Google className="h-5 w-5" />
          Connect Google Account
        </button>
      );
    case "github":
      return (
        <button
          onClick={handleConnect}
          className="flex w-full items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <GitHub className="h-5 w-5" />
          Connect GitHub Account
        </button>
      );
    default:
      return provider satisfies never;
  }
};

const UserIdentities = ({ open }: { open: boolean }) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { data: authn, isLoading } = useGetIdentities({ enabled: open });

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const identities = authn?.identities || [];

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      <div className="flex flex-col gap-3">
        <EditableEmailField email={currentUser.email} />
        {providers.map((p) => {
          const identity = identities.find((id) => id.provider === p);
          if (identity) {
            return (
              <Identity key={p} provider={p} email={identity.providerEmail} />
            );
          }
          return <ConnectButton key={p} provider={p} />;
        })}
      </div>
    </div>
  );
};

export default UserIdentities;
