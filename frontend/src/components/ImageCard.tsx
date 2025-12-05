import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

type ImageCardProps = {
  id: string;
  file_path: string;
  created_at: string;
  type: string;
  matiere: string;
  subject: string;
  generated_by_model: string;
  onDelete: () => void;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const getImageUrl = (filePath: string) => {
  return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
};

export function ImageCard({
  id,
  file_path,
  type,
  matiere,
  subject,
  generated_by_model,
  onDelete,
}: ImageCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const reason = prompt(
      "Pourquoi cette image ne convient-elle pas ?\n(facultatif mais ça nous aide à améliorer ce service)"
    );
    if (reason === null) return;

    setDeleting(true);

    const { error: dbError } = await supabase.rpc("refuse_image", {
      image_id: id,
      reason: reason,
    });

    if (dbError) {
      console.error("Error deleting from database:", dbError);
      alert("Failed to delete image from database");
      setDeleting(false);
      return;
    }

    onDelete();
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        background: "#fff",
        opacity: deleting ? 0.5 : 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <img
        src={getImageUrl(file_path)}
        alt={`${matiere} - ${subject}`}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "4px",
        }}
      />
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        <div>
          Matière:
          <Link
            to={`/matiere/${encodeURIComponent(matiere)}`}
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            {matiere}
          </Link>
        </div>
        <div>
          Subject:
          <Link
            to={`/matiere/${encodeURIComponent(
              matiere
            )}/subject/${encodeURIComponent(subject)}`}
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            {subject}
          </Link>
        </div>
        <div>Type: {type}</div>
        <div>
          Model:
          <Link
            to={`/model/${encodeURIComponent(generated_by_model)}`}
            style={{ color: "#007bff", textDecoration: "underline" }}
          >
            {generated_by_model}
          </Link>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "8px",
          background: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: deleting ? "not-allowed" : "pointer",
        }}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
