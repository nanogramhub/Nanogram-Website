import OAuthButtons from "@/components/auth/oauth-button";
import SignupForm from "@/components/forms/signup-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signUpUser } from "@/lib/auth";
import type { SignupFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const loginRedirectSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/_authLayout/signup")({
  component: RouteComponent,
  validateSearch: loginRedirectSchema,
});

function RouteComponent() {
  const { redirectTo } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      await signUpUser(data);
      await login({ identifier: data.email, password: data.password });
      navigate({ to: "/" });
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(`${error.message} (${error.type})`);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <CardTitle className="text-2xl font-bold">
            Sign in to Nanogram
          </CardTitle>
          <CardDescription>
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons loading={loading} redirect={redirectTo} />

          <Separator />

          <SignupForm onSubmit={handleSubmit} />

          <Button
            size="lg"
            type="submit"
            form="signup-form"
            className="w-full"
            disabled={loading}
          >
            Sign Up
          </Button>

          <div className="flex flex-wrap justify-center md:justify-between mt-4">
            <Button
              nativeButton={false}
              disabled={loading}
              variant="link"
              className="text-info p-0 text-xs mx-1"
              render={(props) => (
                <Link
                  to="/login"
                  search={{ redirectTo: redirectTo }}
                  {...props}
                >
                  Already have an account? Login
                </Link>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
