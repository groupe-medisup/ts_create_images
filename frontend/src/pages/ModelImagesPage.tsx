import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Image = {
  id: string;
  file_path: string;
  created_at: string;
  type: string;
  matiere: string;
  subject: string;
};

export function ModelImagesPage() {
  const { model } = useParams<{ model: string }>();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      if(!model) return;

      const { data, error } = await supabase
        .from('images')
        .select('id, file_path, created_at, type, matiere, subject')
        .eq('generated_by_model', model);

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      setImages(data);
      setLoading(false);
    }

    if (model) {
      fetchImages();
    }
  }, [model]);

  const getImageUrl = (filePath: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/models" style={{ marginBottom: '20px', display: 'inline-block' }}>← Back</Link>
      <h1>{model}</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {images.map(image => (
          <div key={image.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            background: '#fff'
          }}>
            <img
              src={getImageUrl(image.file_path)}
              alt={`${image.matiere} - ${image.subject}`}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '4px'
              }}
            />
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <div>Matière: {image.matiere}</div>
              <div>Subject: {image.subject}</div>
              <div>Type: {image.type}</div>
              <div>Date: {new Date(image.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
