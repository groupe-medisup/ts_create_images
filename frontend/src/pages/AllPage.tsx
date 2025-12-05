import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ImageList, type Image } from "../components/ImageList";

export function AllPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allImages, setAllImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  const [matieres, setMatieres] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [selectedMatiere, setSelectedMatiere] = useState<string>(
    searchParams.get("matiere") ?? ""
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(
    searchParams.get("subject") ?? ""
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get("type") ?? ""
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    searchParams.get("model") ?? ""
  );

  const deleteImage = (id: string) => {
    setAllImages((prev) => prev.filter((img) => img.id !== id));
    setFilteredImages((prev) => prev.filter((img) => img.id !== id));
  };

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from("images")
        .select("*")
        .is("refused_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
        return;
      }

      setAllImages(data);
      setFilteredImages(data);

      const uniqueMatieres = [
        ...new Set(data.map((d) => d.matiere).filter(Boolean)),
      ].sort();
      const uniqueSubjects = [
        ...new Set(data.map((d) => d.subject).filter(Boolean)),
      ].sort();
      const uniqueTypes = [
        ...new Set(data.map((d) => d.type).filter(Boolean)),
      ].sort();
      const uniqueModels = [
        ...new Set(data.map((d) => d.generated_by_model).filter(Boolean)),
      ].sort();

      setMatieres(uniqueMatieres);
      setSubjects(uniqueSubjects);
      setTypes(uniqueTypes);
      setModels(uniqueModels);
      setLoading(false);
    }

    fetchImages();
  }, []);

  useEffect(() => {
    let filtered = allImages;

    if (selectedMatiere) {
      filtered = filtered.filter((img) => img.matiere === selectedMatiere);
    }
    if (selectedSubject) {
      filtered = filtered.filter((img) => img.subject === selectedSubject);
    }
    if (selectedType) {
      filtered = filtered.filter((img) => img.type === selectedType);
    }
    if (selectedModel) {
      filtered = filtered.filter(
        (img) => img.generated_by_model === selectedModel
      );
    }

    setFilteredImages(filtered);
  }, [
    selectedMatiere,
    selectedSubject,
    selectedType,
    selectedModel,
    allImages,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedMatiere) params.set("matiere", selectedMatiere);
    if (selectedSubject) params.set("subject", selectedSubject);
    if (selectedType) params.set("type", selectedType);
    if (selectedModel) params.set("model", selectedModel);
    setSearchParams(params, { replace: true });
  }, [
    selectedMatiere,
    selectedSubject,
    selectedType,
    selectedModel,
    setSearchParams,
  ]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/" style={{ marginBottom: "20px", display: "inline-block" }}>
        ← Back
      </Link>
      <h1>All Images</h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "30px",
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div>
          <label
            htmlFor="matiere-filter"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Matière
          </label>
          <select
            id="matiere-filter"
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            <option value="">All</option>
            {matieres.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="subject-filter"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Subject
          </label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            <option value="">All</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="type-filter"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            <option value="">All</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="model-filter"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Model
          </label>
          <select
            id="model-filter"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            <option value="">All</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {(selectedMatiere ||
          selectedSubject ||
          selectedType ||
          selectedModel) && (
          <button
            onClick={() => {
              setSelectedMatiere("");
              setSelectedSubject("");
              setSelectedType("");
              setSelectedModel("");
            }}
            style={{
              alignSelf: "flex-end",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        Showing {filteredImages.length} of {allImages.length} images
      </p>

      <ImageList images={filteredImages} deleteImage={deleteImage} />
    </div>
  );
}
