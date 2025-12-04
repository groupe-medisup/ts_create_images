import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ImageList, type Image } from "../components/ImageList";

export function ImageGalleryPage() {
  const { matiere, subject } = useParams<{
    matiere: string;
    subject: string;
  }>();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  const deleteImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const fetchImages = async () => {
    if (!matiere || !subject) return;

    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("matiere", matiere)
      .eq("subject", subject)
      .is("refused_at", null);

    if (error) {
      console.error("Error fetching images:", error);
      return;
    }

    setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    if (matiere && subject) {
      fetchImages();
    }
  }, [matiere, subject]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Link
        to={`/matiere/${encodeURIComponent(matiere!)}`}
        style={{ marginBottom: "20px", display: "inline-block" }}
      >
        ← Back
      </Link>
      <h1>{matiere}</h1>
      <h2>{subject}</h2>
      <ImageList images={images} deleteImage={deleteImage} />
    </div>
  );
}
