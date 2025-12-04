import { Link } from 'react-router-dom';

type ImageCardProps = {
  id: string;
  file_path: string;
  created_at: string;
  type: string;
  matiere: string;
  subject: string;
  generated_by_model: string;
};

export function ImageCard({ file_path, created_at, type, matiere, subject, generated_by_model }: ImageCardProps) {
  const getImageUrl = (filePath: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      background: '#fff'
    }}>
      <img
        src={getImageUrl(file_path)}
        alt={`${matiere} - ${subject}`}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '4px'
        }}
      />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <div>
          Matière: <Link to={`/matiere/${encodeURIComponent(matiere)}`} style={{ color: '#007bff', textDecoration: 'underline' }}>{matiere}</Link>
        </div>
        <div>
          Subject: <Link to={`/matiere/${encodeURIComponent(matiere)}/subject/${encodeURIComponent(subject)}`} style={{ color: '#007bff', textDecoration: 'underline' }}>{subject}</Link>
        </div>
        <div>Type: {type}</div>
        <div>Date: {new Date(created_at).toLocaleDateString()}</div>
        <div>
          Model: <Link to={`/model/${encodeURIComponent(generated_by_model)}`} style={{ color: '#007bff', textDecoration: 'underline' }}>{generated_by_model}</Link>
        </div>
      </div>
    </div>
  );
}
