import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function SubjectPage() {
  const { matiere } = useParams<{ matiere: string }>();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      if(!matiere) return;
      
      const { data, error } = await supabase
        .from('images')
        .select('subject')
        .eq('matiere', matiere);

      if (error) {
        console.error('Error fetching subjects:', error);
        return;
      }

      const uniqueSubjects = [...new Set(data.map(d => d.subject))];
      setSubjects(uniqueSubjects);
      setLoading(false);
    }

    if (matiere) {
      fetchSubjects();
    }
  }, [matiere]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>← Back</Link>
      <h1>{matiere}</h1>
      <h2>Subjects</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {subjects.map(subject => (
          <li key={subject} style={{ marginBottom: '10px' }}>
            <Link
              to={`/matiere/${encodeURIComponent(matiere!)}/subject/${encodeURIComponent(subject)}`}
              style={{
                display: 'block',
                padding: '15px',
                background: '#f0f0f0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333'
              }}
            >
              {subject}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
