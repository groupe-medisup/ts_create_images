import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ImageList, type Image } from "../components/ImageList";

export function ModelImagesPage() {
  const { model } = useParams<{ model: string }>();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const fetchImages = async () => {
    if (!model) return;

    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("generated_by_model", model)
      .is("refused_at", null);

    if (error) {
      console.error("Error fetching images:", error);
      return;
    }

    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    if (model) {
      fetchImages();
    }
  }, [model]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Link
        to="/models"
        style={{ marginBottom: "20px", display: "inline-block" }}
      >
        ← Back
      </Link>
      <h1>{model}</h1>
      <ImageList images={images} deleteImage={deleteImage} />
    </div>
  );
}
