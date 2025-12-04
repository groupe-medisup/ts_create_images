import type { Database } from "../../../supabase/database.types";
import { ImageCard } from "./ImageCard.js";

export type Image = Database["public"]["Tables"]["images"]["Row"];

type ImageListProps = {
  images: Image[];
  deleteImage: (id: string) => void;
};

export function ImageList({ images, deleteImage }: ImageListProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          {...image}
          onDelete={() => deleteImage(image.id)}
        />
      ))}
    </div>
  );
}
