import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function MatierePage() {
  const [matieres, setMatieres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatieres() {
      const { data, error } = await supabase
        .from('images')
        .select('matiere');

      if (error) {
        console.error('Error fetching matieres:', error);
        return;
      }

      const uniqueMatieres = [...new Set(data.map(d => d.matiere))];
      setMatieres(uniqueMatieres);
      setLoading(false);
    }

    fetchMatieres();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Link to="/all" style={{ padding: '10px 20px', background: '#28a745', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          All Images
        </Link>
        <Link to="/models" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          View by Models
        </Link>
      </div>
      <h1>Matières</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matieres.map(matiere => (
          <li key={matiere} style={{ marginBottom: '10px' }}>
            <Link
              to={`/matiere/${encodeURIComponent(matiere)}`}
              style={{
                display: 'block',
                padding: '15px',
                background: '#f0f0f0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333'
              }}
            >
              {matiere}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
