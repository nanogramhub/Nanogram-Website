import { cloudinary } from "@/lib/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { createFileRoute } from "@tanstack/react-router";
// import { quality, format } from "@cloudinary/url-gen/actions/delivery";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  // const images = cloudinary.image("");
  return (
    <div>
      <AdvancedImage cldImg={cloudinary.image("nano51224_bcqwae")} />
    </div>
  );
}
