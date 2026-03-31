import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";

const GenericError = () => {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-6">
      <div className="flex items-center justify-center gap-5">
        <img
          src="/assets/images/nanogram_logo-bg-primary.svg"
          alt="Logo"
          className="w-1/6 rounded-full"
        />
        <h1 className="text-4xl font-bold text-primary font-blanka mb-3">
          NANOGRAM
        </h1>
      </div>
      <div className="flex items-center justify-center flex-col gap-5">
        <h2 className="text-3xl font-bold">
          We're sorry, something went wrong.
        </h2>
        <p className="font-normal text-muted-foreground">
          Please try again later.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => router.history.back()}>Back</Button>
        <Button
          nativeButton={false}
          render={(props) => {
            return (
              <Link {...props} to="/">
                Go back home
              </Link>
            );
          }}
        />
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );
};

export default GenericError;
