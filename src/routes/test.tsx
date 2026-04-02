// import { cloudinary } from "@/lib/cloudinary";
// import { AdvancedImage } from "@cloudinary/react";
import { api } from "@/lib/appwrite/api";
import { createFileRoute } from "@tanstack/react-router";
// import { quality, format } from "@cloudinary/url-gen/actions/delivery";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  // const images = cloudinary.image("");
  async function run() {
    const posts = await api.auth.sendResetPasswordEmail(
      "nanogramhub@gmail.com",
    );
    console.log(posts);
  }
  return (
    <div>
      {/* <AdvancedImage cldImg={cloudinary.image("nano51224_bcqwae")} /> */}
      <button onClick={run}>Run</button>
    </div>
  );
}
