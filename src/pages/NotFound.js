import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center' }}>

      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '8rem',
        fontWeight: 700, color: 'var(--gold-faint)', lineHeight: 1,
        marginBottom: '1rem', userSelect: 'none' }}>404</div>

      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
        fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Page Not Found</h1>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 360,
        lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
        The page you are looking for does not exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <button onClick={() => navigate('/')}
          style={{ padding: '0.7rem 1.8rem', background: 'var(--gold)', border: 'none',
            borderRadius: 8, color: 'var(--bg-secondary)', fontFamily: "'Outfit',sans-serif",
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          Go Home
        </button>
        <button onClick={() => navigate(-1)}
          style={{ padding: '0.7rem 1.8rem', background: 'transparent',
            border: '1px solid var(--border-gold)', borderRadius: 8,
            color: 'var(--gold-dim)', fontFamily: "'Outfit',sans-serif",
            fontSize: '0.85rem', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    </div>
  );
}