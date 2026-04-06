import { Github } from "@/components/icons/github";
import { Google } from "@/components/icons/google";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetIdentities } from "@/hooks/queries/use-auth";
import { api } from "@/lib/appwrite/api";
import { useAuthStore } from "@/store/use-auth-store";

const providers = ["google", "github"] as const;
type Provider = (typeof providers)[number];

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
        <div className="flex w-full items-center gap-3 rounded-md text-sm p-2 bg-background border">
          <Google className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Connected with Google
            </span>
            <span className="font-light">{email}</span>
          </div>
        </div>
      );
    case "github":
      return (
        <div className="flex w-full items-center gap-3 rounded-md text-sm p-2 bg-background border">
          <Github className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">Connected with GitHub</span>
            <span className="font-light">{email}</span>
          </div>
        </div>
      );
    default:
      return provider satisfies never;
  }
};

const ConnectButton = ({ provider }: { provider: Provider }) => {
  const handleConnect = async () => {
    const currentPath = window.location.pathname;
    if (provider === "google") {
      await api.auth.loginWithGoogle(currentPath);
    } else if (provider === "github") {
      await api.auth.loginWithGithub(currentPath);
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
          <Github className="h-5 w-5" />
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
        <Skeleton className="h-13 w-full" />
        <Skeleton className="h-13 w-full" />
      </div>
    );
  }

  const identities = authn?.identities || [];

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      <div className="flex flex-col gap-2">
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
