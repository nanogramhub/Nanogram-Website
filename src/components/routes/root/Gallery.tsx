import { Link } from "@tanstack/react-router";
import ShuffleGallery from "@/components/motion/ShuffleGallery";
import { Button } from "@/components/ui/button";
import { images } from "@/constants";
import { usePerformance } from "@/hooks/usePerformance";

const Gallery = () => {
  const { performance } = usePerformance();
  return (
    <div className="w-full flex md:flex-row flex-col gap-5 md:px-20 px-4 py-10 pt-20 max-w-2xl lg:max-w-7xl mx-auto">
      <div className="w-full h-full">
        {performance ? (
          <div className="grid grid-cols-4 gap-1 w-3/4 mx-auto">
            {images.map((image) => (
              <div
                key={image}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                }}
                className="w-full aspect-square"
              />
            ))}
          </div>
        ) : (
          <ShuffleGallery images={images} />
        )}
      </div>
      <div className="w-full flex flex-col justify-center">
        <div className="flex flex-col gap-5 py-6">
          <h2 className="text-5xl mb-4">Glimpse of Nanogram</h2>
          <p className="px-4 text-muted-foreground">
            A collection of photos from past activities at Nanogram
          </p>
          <Button
            nativeButton={false}
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
