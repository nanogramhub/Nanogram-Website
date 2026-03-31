import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <div className="flex items-center justify-center gap-5">
        <img
          src="/assets/images/nanogram_logo-bg-primary.svg"
          alt="Logo"
          className="w-1/6 rounded-full"
        />
        <h1 className="text-4xl font-bold text-primary font-blanka mb-3 tracking-wider">
          NANOGRAM
        </h1>
      </div>
      <div className="flex items-center justify-center flex-col gap-5 px-6 text-center">
        <h2 className="text-3xl font-bold">404 - Page Not Found</h2>
        <p className="font-normal text-muted-foreground">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
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

export default NotFound;
