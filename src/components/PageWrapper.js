import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function PageWrapper({ children, style = {}, green = false }) {
  const ref = useRef();
  useTheme();

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        ref.current.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'translateY(0)';
      });
    }
  }, []);

  const bg = green ? 'var(--bg-green)' : 'var(--bg-primary)';

  return (
    <div ref={ref} style={{
      minHeight: '100vh',
      background: bg,
      color: green ? 'var(--text-green)' : 'var(--text-primary)',
      ...style
    }}>
      {children}
    </div>
  );
}