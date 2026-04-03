import ResetPasswordForm from "@/components/forms/reset-passwrod-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserNotFoundException } from "@/exceptions";
import { useResetPasswordMutation } from "@/hooks/mutations/use-auth";
import { usersQueries } from "@/lib/query/query-options";
import type { ResetPasswordFormValues } from "@/lib/validation";
import { queryClient } from "@/router";
import {
  createFileRoute,
  Link,
  SearchParamError,
  useNavigate,
} from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

const resetPasswordSearchParamsSchema = z.object({
  userId: z.string(),
  secret: z.string(),
});

export const Route = createFileRoute("/_authLayout/reset-password")({
  component: RouteComponent,
  validateSearch: resetPasswordSearchParamsSchema,
  loaderDeps: ({ search }) => ({
    userId: search.userId,
  }),
  loader: async ({ deps }) => {
    const user = await queryClient.ensureQueryData(
      usersQueries.getUserByAccountId(deps.userId),
    );
    if (!user)
      throw new UserNotFoundException(
        `No user found in database for account id: ${deps.userId}`,
      );
    return { user };
  },
  errorComponent: ({ error }) => (
    <div className="flex flex-col h-dvh justify-center">
      <Card className="min-w-80 max-w-120 mx-auto text-center bg-base-200 p-10 rounded-lg">
        <CardHeader>
          <div className="flex justify-center">
            <img
              src="/assets/images/nanogram_logo-bg-primary.svg"
              alt="logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset</CardTitle>
          <CardDescription className="flex flex-col">
            {(() => {
              console.log(error);
              return <p></p>;
            })()}
            {error instanceof SearchParamError ? (
              <span>
                Looks like the reset link is invalid. Please make sure you
                followed the full link from the email.
              </span>
            ) : error instanceof UserNotFoundException ? (
              <span>{error.message}. The link is invalid.</span>
            ) : (
              <span>Something went wrong</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            variant="link"
            render={(props) => (
              <Link to="/login" {...props}>
                Go to Login
              </Link>
            )}
          />
        </CardContent>
      </Card>
    </div>
  ),
});

function RouteComponent() {
  const { userId, secret } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = Route.useLoaderData();
  const resetPasswordMutation = useResetPasswordMutation();

  function handleSubmit(values: ResetPasswordFormValues) {
    resetPasswordMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Password reset successfully");
        navigate({
          to: "/login",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <div className="flex flex-col h-dvh justify-center">
      <Card className="min-w-80 max-w-120 mx-auto text-center bg-base-200 p-10 rounded-lg">
        <CardHeader>
          <div className="flex justify-center">
            <img
              src="/assets/images/nanogram_logo-bg-primary.svg"
              alt="logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset</CardTitle>
          <CardDescription className="flex flex-col">
            <span>
              Hey {user.name}! Enter the new password for the account @
              {user.username}.
            </span>
            <span>
              Please try to remember it this time we do not have the budget for
              password reset emails T_T.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm
            userId={userId}
            secret={secret}
            onSubmit={handleSubmit}
          />
          <Button
            size="lg"
            type="submit"
            form="reset-password-form"
            className="w-full"
            disabled={resetPasswordMutation.isPending}
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
