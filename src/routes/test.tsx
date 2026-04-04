// import { cloudinary } from "@/lib/cloudinary";
// import { AdvancedImage } from "@cloudinary/react";
import { api } from "@/lib/appwrite/api";
import type { CurrentUser } from "@/types/api";
import { createFileRoute } from "@tanstack/react-router";
// import { quality, format } from "@cloudinary/url-gen/actions/delivery";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  // const images = cloudinary.image("");
  // function isFollowing(currentUser: CurrentUser, userId: string) {
  //   return currentUser.following.some((f) => f.followed === userId);
  // }
  async function run() {
    const data = await api.newsletters.getNewsletters({});
    if (!data) {
      console.log("No data returned");
      return;
    }
    console.log(data);
    // console.log(isFollowing(data, "69cd10b3000e43fde8bb"));
  }
  return (
    <div>
      {/* <AdvancedImage cldImg={cloudinary.image("nano51224_bcqwae")} /> */}
      <button onClick={run}>Run</button>
    </div>
  );
}
