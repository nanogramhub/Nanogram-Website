import { api } from "@/lib/appwrite/api";

import { Button } from "../ui/button";
import {GitHub, Google} from "@/components/icons/brands"

interface OAuthButtonProps {
  loading: boolean;
  redirect?: string;
}

const OAuthButtons = ({ loading, redirect = "/" }: OAuthButtonProps) => {
  return (
    <div className="pb-5 max-w-100 text-center flex flex-wrap justify-around gap-2">
      {/* Google */}
      <Button
        size="lg"
        className="bg-white text-black border-[#e5e5e5] hover:bg-gray-50"
        disabled={loading}
        onClick={() => api.auth.loginWithGoogle(redirect)}
      >
        <Google />
        Continue with Google
      </Button>
      {/* GitHub */}
      <Button
        size="lg"
        className="bg-black text-white border-black hover:bg-gray-900"
        disabled={loading}
        onClick={() => api.auth.loginWithGithub(redirect)}
      >
        <GitHub className="fill-white" />
        Continue with GitHub
      </Button>
    </div>
  );
};

export default OAuthButtons;
