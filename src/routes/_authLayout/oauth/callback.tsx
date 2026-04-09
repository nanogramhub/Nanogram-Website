import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";
import { useEffect } from "react";
import { toast } from "sonner";
import z from "zod";

import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/appwrite/api";
import { useAuthStore } from "@/store/use-auth-store";

const oauthCallbackSearchSchema = z.object({
  userId: z.string().optional(),
  secret: z.string().optional(),
});

export const Route = createFileRoute("/_authLayout/oauth/callback")({
  component: OAuthCallback,
  validateSearch: oauthCallbackSearchSchema,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const getCurrentUser = useAuthStore((s) => s.getCurrentUser);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const secret = params.get("secret");

        if (userId && secret) {
          try {
            await api.auth.createSessionFromOAuthToken(userId, secret);
          } catch {
            // Second StrictMode invocation or reused callback URL: session may already exist.
            await api.auth.getCurrentUserAccount();
          }
          window.history.replaceState({}, "", window.location.pathname);
        }

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
        let imageId: string | null = null;

        const identities = await api.auth.getAllIdentities();
        const oauthIdentity = identities.identities.find(
          (id) => id.provider !== "email",
        );

        if (oauthIdentity) {
          if (oauthIdentity.provider === "google") {
            username = authUser.email.split("@")[0];
          } else if (oauthIdentity.provider === "github") {
            username = oauthIdentity.providerUid || authUser.email.split("@")[0];
          }
        }

        if (!username) {
          username = authUser.email.split("@")[0];
        }

        const usernameExists = await api.auth.checkUsernameAvailability(username);
        if (!usernameExists) {
          username = `${username}_${authUser.$id.slice(0, 8)}`;
        }

        if (oauthIdentity) {
          const avatarUrl =
            await api.auth.fetchOAuthProviderAvatarUrl(oauthIdentity);
          if (avatarUrl) {
            try {
              const file = await api.storage.uploadFileFromUrl(avatarUrl);
              imageId = file.$id;
              imageUrl = api.storage.getFileUrl(file.$id);
            } catch {
              // Keep generated initials URL
            }
          }
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

    void handleOAuthCallback();
  }, [getCurrentUser, navigate]);

  return (
    <div className="flex h-dvh items-center justify-center">
      <Spinner />
    </div>
  );
}
