// import React from "react";

const LoginForm = () => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full mx-auto text-justify mb-2.5"
    >
      <div className="mb-2.5">
        <label className="input validator w-full">
          <User />
          <input
            type="text"
            required
            placeholder="Email or Username"
            {...register("identifier")}
          />
        </label>
        {errors.identifier && (
          <p className="text-sm mt-1 text-warning">
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div className="mb-2.5">
        <label className="input validator w-full relative">
          <Lock />
          <input
            type={loading ? "password" : showPassword ? "text" : "password"}
            required
            placeholder="Password"
            {...register("password")}
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="bg-none" size={20} />
            ) : (
              <Eye className="bg-none" size={20} />
            )}
          </button>
        </label>
        {errors.password && (
          <p className="text-sm mt-1 text-warning">{errors.password.message}</p>
        )}
      </div>

      <div id="clerk-captcha" className="hidden" />

      <button
        className="btn btn-primary btn-block"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Sign In"
        )}
      </button>

      {error && <p className="text-error text-center mt-2.5">{error}</p>}
    </form>
  );
};

export default LoginForm;
