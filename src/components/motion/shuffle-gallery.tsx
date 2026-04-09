import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function shufflePermutation(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const ShuffleGallery = ({ images }: { images: string[] }) => {
  const imageKey = images.join("|");
  const items = useMemo(
    () => images.map((src, index) => ({ id: index, src })),
    [imageKey],
  );

  const [order, setOrder] = useState<number[]>(() =>
    items.map((_, i) => i),
  );

  useEffect(() => {
    setOrder(items.map((_, i) => i));
  }, [imageKey]);

  useEffect(() => {
    if (items.length === 0) return;

    const id = window.setInterval(() => {
      setOrder(shufflePermutation(items.length));
    }, 3000);

    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <LayoutGroup id="shuffle-gallery">
      <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-1 sm:grid-cols-4 [contain:layout]">
        {order.map((itemIndex) => {
          const item = items[itemIndex];
          return (
            <motion.div
              key={item.id}
              layout="position"
              transition={{
                layout: {
                  duration: 0.55,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }}
              className="aspect-square w-full min-h-0 min-w-0 overflow-hidden rounded-sm"
              style={{
                backgroundImage: `url(${item.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          );
        })}
      </div>
    </LayoutGroup>
  );
};

export default ShuffleGallery;
