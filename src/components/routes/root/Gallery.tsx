import { Link } from "@tanstack/react-router";
import ShuffleGallery from "@/components/motion/ShuffleGallery";
import { Button } from "@/components/ui/button";
import { images } from "@/constants";

const Gallery = () => {
  return (
    <div className="w-full flex md:flex-row flex-col gap-5 md:px-20 px-4">
      <div className="w-full h-full">
        <ShuffleGallery images={images} />
      </div>
      <div className="w-full flex flex-col justify-center">
        <div className="flex flex-col gap-5 py-6">
          <h2 className="text-5xl mb-4">Glimpse of Nanogram</h2>
          <p className="px-4 text-muted-foreground">
            A collection of photos from past activities at Nanogram
          </p>
          <Button
            variant="outline"
            className={"w-fit ml-3"}
            render={(props) => (
              <Link to="/gallery" {...props}>
                Vist the Gallery
              </Link>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
