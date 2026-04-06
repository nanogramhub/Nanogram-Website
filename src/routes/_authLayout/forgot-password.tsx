import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import ForgotPasswordForm from "@/components/forms/forgot-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSendResetLinkMutation } from "@/hooks/mutations/use-auth";
import type { ForgotPasswordFormValues } from "@/lib/validation";

export const Route = createFileRoute("/_authLayout/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const [success, setSuccess] = useState(false);
  const sendResetLinkMutation = useSendResetLinkMutation();

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    await sendResetLinkMutation.mutateAsync(values, {
      onSuccess: () => {
        toast.success("Reset link sent successfully");
        setSuccess(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
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
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription className="flex flex-col">
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <>
              <ForgotPasswordForm onSubmit={handleSubmit} />
              <Button
                size="lg"
                type="submit"
                form="forgot-password-form"
                className="w-full"
                disabled={sendResetLinkMutation.isPending}
              >
                Send Reset Link
              </Button>
            </>
          ) : (
            <>
              <p>Reset link sent successfully. Please check your email.</p>
              <div className="mt-4">
                <p className="text-muted-foreground">
                  Didn't receive the email? Please try reseting the password
                  after a while.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
