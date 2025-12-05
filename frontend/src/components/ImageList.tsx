import type { Database } from "../../../supabase/database.types";
import { ImageCard } from "./ImageCard.js";

export type Image = Database["public"]["Tables"]["images"]["Row"];

type ImageListProps = {
  images: Image[];
  deleteImage: (id: string) => void;
};

function ImageSubList({ images, deleteImage }: ImageListProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
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

export function ImageList({ images, deleteImage }: ImageListProps) {
  return (
    <div>
      {images.filter((image) => image.type === "cours").length > 0 && (
        <>
          <h2>Cours</h2>
          <ImageSubList
            images={images.filter((image) => image.type === "cours")}
            deleteImage={deleteImage}
          />
        </>
      )}

      {images.filter((image) => image.type === "colle").length > 0 && (
        <>
          <h2>Colles</h2>
          <ImageSubList
            images={images.filter((image) => image.type === "colle")}
            deleteImage={deleteImage}
          />
        </>
      )}

      {images.filter((image) => image.type === "EBC").length > 0 && (
        <>
          <h2>EBC</h2>
          <ImageSubList
            images={images.filter((image) => image.type === "EBC")}
            deleteImage={deleteImage}
          />
        </>
      )}
    </div>
  );
}
