import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ImageCard } from '../components/ImageCard';

type Image = {
  id: string;
  file_path: string;
  created_at: string;
  type: string;
  matiere: string;
  subject: string;
  generated_by_model: string;
};

export function ImageGalleryPage() {
  const { matiere, subject } = useParams<{ matiere: string; subject: string }>();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      if(!matiere || !subject) return;

      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('matiere', matiere)
        .eq('subject', subject);

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }

      setImages(data);
      setLoading(false);
    }

    if (matiere && subject) {
      fetchImages();
    }
  }, [matiere, subject]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to={`/matiere/${encodeURIComponent(matiere!)}`} style={{ marginBottom: '20px', display: 'inline-block' }}>← Back</Link>
      <h1>{matiere}</h1>
      <h2>{subject}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {images.map(image => (
          <ImageCard key={image.id} {...image} />
        ))}
      </div>
    </div>
  );
}
