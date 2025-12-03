import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function ModelListPage() {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      const { data, error } = await supabase
        .from('images')
        .select('generated_by_model');

      if (error) {
        console.error('Error fetching models:', error);
        return;
      }

      const uniqueModels = [...new Set(data.map(d => d.generated_by_model))];
      setModels(uniqueModels);
      setLoading(false);
    }

    fetchModels();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>← Back to Matières</Link>
      <h1>Models</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {models.map(model => (
          <li key={model} style={{ marginBottom: '10px' }}>
            <Link
              to={`/model/${encodeURIComponent(model)}`}
              style={{
                display: 'block',
                padding: '15px',
                background: '#f0f0f0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333'
              }}
            >
              {model}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
