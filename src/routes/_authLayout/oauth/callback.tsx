import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/appwrite/api";
import { useAuthStore } from "@/store/use-auth-store";

export const Route = createFileRoute("/_authLayout/oauth/callback")({
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const getCurrentUser = useAuthStore((s) => s.getCurrentUser);

  const handleOAuthCallback = async () => {
    try {
      const authUser = await api.auth.getCurrentUserAccount();
      const existingUser = await api.users.getUserByAccountId(authUser.$id);

      if (existingUser) {
        await getCurrentUser();
        toast.success("Welcome back!");
        navigate({ to: "/" });
        return;
      }

      let username = "";

      const name = authUser.name;
      let imageUrl = api.avatars.getInitials(name);
      const imageId: string | null = null;

      const identities = await api.auth.getAllIdentities();
      const oauthIdentity = identities.identities.find(
        (id) => id.provider !== "email",
      );

      if (oauthIdentity) {
        if (oauthIdentity.provider === "google") {
          username = authUser.email.split("@")[0];
          const prefs = await api.auth.getPrefs();
          if (prefs.prefs?.avatar_url) {
            imageUrl = prefs.prefs.avatar_url as string;
          }
        } else if (oauthIdentity.provider === "github") {
          username = oauthIdentity.providerUid || authUser.email.split("@")[0];
          const prefs = await api.auth.getPrefs();
          if (prefs.prefs?.avatar_url) {
            imageUrl = prefs.prefs.avatar_url as string;
          }
        }
      }

      if (!username) {
        username = authUser.email.split("@")[0];
      }

      const usernameExists = await api.auth.checkUsernameAvailability(username);
      if (!usernameExists) {
        username = `${username}_${authUser.$id.slice(0, 8)}`;
      }

      const newUser = await api.users.createuser({
        name,
        username,
        email: authUser.email,
        accountId: authUser.$id,
        imageUrl,
        imageId,
      });

      if (newUser) {
        await getCurrentUser();
        toast.success("Account created successfully!");
        navigate({ to: "/" });
      }
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
      navigate({ to: "/login" });
    }
  };

  handleOAuthCallback();

  return (
    <div className="flex h-dvh items-center justify-center">
      <Spinner />
    </div>
  );
}
