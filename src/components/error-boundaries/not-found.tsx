// import React from "react";
import Button from "../ui/Button";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex-center flex-col gap-6">
      <div className="flex-center gap-5">
        <img
          src="/assets/images/nanogram_logo-bg-primary.svg"
          alt="Logo"
          className="w-1/6 rounded-full"
        />
        <h1 className="text-4xl font-bold text-primary nanogram mb-3">
          NANOGRAM
        </h1>
      </div>
      <div className="flex-center flex-col gap-5 px-6 text-center">
        <h2 className="text-3xl font-bold text-neutral-black">
          404 - Page Not Found
        </h2>
        <p className="text-lg font-normal text-neutral-black/70">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
      </div>
      <Button onClick={() => navigate("/")}>Go Back Home</Button>
    </div>
  );
};

export default NotFound;
