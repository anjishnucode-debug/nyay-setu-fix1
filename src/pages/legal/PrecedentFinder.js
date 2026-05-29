import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { searchPrecedents } from '../../data/precedents';

const IPC_OPTIONS = [
  '', 'IPC 302', 'IPC 304A', 'IPC 323', 'IPC 325', 'IPC 379', 'IPC 392',
  'IPC 406', 'IPC 420', 'IPC 447', 'IPC 465', 'IPC 498A', 'IPC 120B',
  'CrPC 437', 'CrPC 439', 'CrPC 167', 'NDPS Act', 'PMLA', 'Article 21',
];

export default function PrecedentFinder() {
  const [query, setQuery] = useState('');
  const [ipcSection, setIpcSection] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState(null);

  function handleSearch() {
    if (!query.trim() && !ipcSection) return;
    setResults(searchPrecedents(query, ipcSection));
    setSearched(true); setExpanded(null);
  }

  const popularSearches = [
    { label: 'Bail — bail is the rule', query: 'bail rule jail exception', ipc: '' },
    { label: 'Undertrial rights', query: 'undertrial speedy trial', ipc: 'CrPC 167' },
    { label: 'Section 498A arrest', query: 'arrest Section 498A', ipc: 'IPC 498A' },
    { label: 'PMLA bail conditions', query: 'PMLA bail', ipc: 'PMLA' },
    { label: 'Cheating & fraud', query: 'cheating criminal intention', ipc: 'IPC 420' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>Indian Kanoon Database</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Precedent Finder</h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            Search landmark Supreme Court and High Court judgments by keyword or IPC section
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '0.8rem' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. bail conditions, undertrial rights, cheating intention..."
            style={{ flex: 1, background: 'var(--input-bg-gold)',
              border: '1px solid var(--border-gold)', borderRadius: 10,
              padding: '0.85rem 1.2rem', color: 'var(--input-color)', outline: 'none',
              fontSize: '0.9rem', fontFamily: "'Outfit',sans-serif", boxShadow: 'var(--shadow)' }}
          />
          <select value={ipcSection} onChange={e => setIpcSection(e.target.value)}
            style={{ padding: '0.85rem 1rem', background: 'var(--input-bg-gold)',
              border: '1px solid var(--border-gold)', borderRadius: 10,
              color: ipcSection ? 'var(--input-color)' : 'var(--input-placeholder)',
              fontSize: '0.85rem', fontFamily: "'Outfit',sans-serif",
              outline: 'none', cursor: 'pointer', minWidth: 140 }}>
            <option value="">All Sections</option>
            {IPC_OPTIONS.filter(o => o).map((o, i) => <option key={i} value={o}>{o}</option>)}
          </select>
          <button onClick={handleSearch}
            style={{ padding: '0.85rem 1.8rem', background: 'var(--gold)', border: 'none',
              borderRadius: 10, color: 'var(--bg-secondary)', fontFamily: "'Outfit',sans-serif",
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Search</button>
        </div>

        {!searched && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase',
              color: 'var(--text-faint)', marginBottom: '0.6rem' }}>Popular Searches</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {popularSearches.map((s, i) => (
                <button key={i}
                  onClick={() => {
                    setQuery(s.query); setIpcSection(s.ipc);
                    setResults(searchPrecedents(s.query, s.ipc));
                    setSearched(true);
                  }}
                  style={{ padding: '5px 14px', background: 'var(--gold-faint)',
                    border: '1px solid var(--border-gold)', borderRadius: 20,
                    color: 'var(--text-muted)', fontSize: '0.78rem',
                    cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}
                  onMouseEnter={e => { e.target.style.background = 'var(--bg-card-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.target.style.background = 'var(--gold-faint)'; e.target.style.color = 'var(--text-muted)'; }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {searched && (
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginBottom: '1rem' }}>
              {results.length > 0
                ? `Found ${results.length} relevant judgment${results.length > 1 ? 's' : ''}`
                : 'No matching judgments found — try different keywords'}
            </div>

            {results.map((p, i) => (
              <div key={p.id}
                style={{ background: 'var(--bg-card)',
                  border: `1px solid ${expanded === i ? 'var(--border-gold-hover)' : 'var(--border-gold)'}`,
                  borderRadius: 12, marginBottom: '0.8rem', overflow: 'hidden',
                  transition: 'border-color 0.2s', boxShadow: 'var(--shadow)' }}>

                <div onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{ padding: '1.2rem 1.5rem', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-faint)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif",
                        fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {p.title}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold-dim)' }}>{p.citation}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                        {p.court} · {p.year}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                      {p.ipc_sections.map((s, si) => (
                        <span key={si} style={{ fontSize: '0.65rem', padding: '2px 8px',
                          background: 'var(--gold-faint)', border: '1px solid var(--border-gold)',
                          borderRadius: 4, color: 'var(--gold)' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column',
                    alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
                    <div style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 500,
                      background: p.outcome.includes('Granted') || p.outcome.includes('Relaxed') || p.outcome.includes('Struck')
                        ? 'rgba(29,158,117,0.12)' : 'rgba(226,75,74,0.1)',
                      color: p.outcome.includes('Granted') || p.outcome.includes('Relaxed') || p.outcome.includes('Struck')
                        ? '#1d9e75' : '#f09595',
                      border: `1px solid ${p.outcome.includes('Granted') || p.outcome.includes('Relaxed') || p.outcome.includes('Struck')
                        ? 'rgba(29,158,117,0.2)' : 'rgba(226,75,74,0.2)'}` }}>
                      {p.outcome}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-dim)' }}>
                      {expanded === i ? '▲ Less' : '▼ More'}
                    </span>
                  </div>
                </div>

                {expanded === i && (
                  <div style={{ padding: '0 1.5rem 1.4rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ paddingTop: '1rem' }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: 1.5, textTransform: 'uppercase',
                        color: 'var(--gold-dim)', marginBottom: '0.5rem' }}>Summary</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)',
                        lineHeight: 1.7, marginBottom: '1rem' }}>{p.summary}</p>

                      <div style={{ padding: '0.9rem 1.2rem', background: 'var(--gold-faint)',
                        border: '1px solid var(--border-gold)', borderRadius: 8, marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.65rem', letterSpacing: 1.5, textTransform: 'uppercase',
                          color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>Key Legal Principle</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)',
                          lineHeight: 1.6, fontStyle: 'italic' }}>"{p.key_principle}"</p>
                      </div>

                      <a href={`https://indiankanoon.org/search/?formInput=${encodeURIComponent(p.title)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '0.78rem', color: 'var(--gold)', textDecoration: 'none',
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '0.5rem 1rem', background: 'var(--gold-faint)',
                          border: '1px solid var(--border-gold)', borderRadius: 6 }}>
                        View on Indian Kanoon ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {results.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)', borderRadius: 12 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📚</div>
                <div style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No results found</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Try different keywords or select a specific IPC section
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}