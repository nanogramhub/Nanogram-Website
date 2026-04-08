import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import OAuthButtons from "@/components/auth/oauth-button";
import LoginForm from "@/components/forms/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SigninFormValues } from "@/lib/validation";
import { useAuthStore } from "@/store/use-auth-store";

const loginRedirectSchema = z.object({
  redirectTo: z.string().optional(),
  error: z
    .object({
      message: z.string(),
      type: z.string(),
      code: z.number(),
    })
    .optional(),
});

export const Route = createFileRoute("/_authLayout/login")({
  component: RouteComponent,
  validateSearch: loginRedirectSchema,
});

function RouteComponent() {
  const { redirectTo, error } = Route.useSearch();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);

  async function onSubmit(data: SigninFormValues) {
    setLoading(true);
    try {
      const user = await login(data);
      if (user) {
        toast.success("Login successful");
        navigate({
          to: redirectTo || "/",
        });
      }
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
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
          <CardTitle className="text-2xl font-bold">
            Sign in to Nanogram
          </CardTitle>
          <CardDescription>
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons loading={loading} />

          {error && (
            <div className="flex text-destructive text-left gap-2">
              <span>{error.message}</span>
            </div>
          )}

          <Separator />

          <LoginForm onSubmit={onSubmit} />

          <Button
            size="lg"
            type="submit"
            form="login-form"
            className="w-full"
            disabled={loading}
          >
            Login
          </Button>

          {/* Forgot Password Button */}
          <div className="flex flex-wrap justify-center md:justify-between mt-4">
            <Button
              nativeButton={false}
              disabled={loading}
              variant="link"
              className="text-info p-0 text-xs mx-1"
              render={(props) => (
                <Link
                  to="/signup"
                  search={{ redirectTo: redirectTo }}
                  {...props}
                >
                  Don&apos;t have an account? Sign Up
                </Link>
              )}
            />
            <Button
              variant="link"
              className="text-info p-0 text-xs mx-1"
              disabled={loading}
              nativeButton={false}
              render={(props) => (
                <Link to="/forgot-password" {...props}>
                  Forgot Password?
                </Link>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
