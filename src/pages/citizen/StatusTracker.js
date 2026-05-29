import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { citizenAPI } from '../../services/api';
import { searchPrisoners, getDaysInCustody, getAlertStatus } from '../../data/prisoners';

export default function StatusTracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      citizenAPI.searchPrisoner(query)
        .then(data => {
          let found = data.results || [];
          if (found.length === 0) {
            // Fall back to local search if API returned no results
            found = searchPrisoners(query);
          }
          setResults(found); setSearched(true);
          if (found.length === 1) setSelected(found[0]);
        })
        .catch(() => {
          const found = searchPrisoners(query);
          setResults(found); setSearched(true);
          if (found.length === 1) setSelected(found[0]);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  function handleSearch() {
    if (!inputVal.trim()) return;
    navigate(`/citizen/status?q=${encodeURIComponent(inputVal.trim())}`);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-green)', color: 'var(--text-green)' }}>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-green)' }}>
            Prisoner Status Search
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300, marginBottom: '1.2rem' }}>
            Enter Prisoner ID, Case Number, or full name to find case details.
          </p>
          <div style={{ display: 'flex', background: 'var(--input-bg-green)',
            border: '1px solid var(--border-green)', borderRadius: 10, overflow: 'hidden',
            boxShadow: 'var(--shadow)' }}>
            <input value={inputVal} onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. KA/BLR/2024/001 or Ramesh Kumar"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: 'var(--input-color)',
                fontFamily: "'Outfit',sans-serif" }}
            />
            <button onClick={handleSearch}
              style={{ padding: '0.9rem 2rem', background: 'var(--green)', border: 'none',
                color: 'white', fontFamily: "'Outfit',sans-serif", fontSize: '0.85rem',
                fontWeight: 500, cursor: 'pointer' }}>Search</button>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
            Try: KA/BLR/2024/001 · KA/MYS/2024/047 · KA/TUK/2023/112
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '3rem', gap: 12 }}>
            <div style={{ width: 24, height: 24, border: '2px solid var(--border-green)',
              borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Searching records...</span>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem',
            border: '1px solid var(--border-green)', borderRadius: 12, background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-green)', marginBottom: '0.5rem', fontWeight: 500 }}>
              No record found
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              We could not find a prisoner matching "{query}".<br />
              Contact your nearest DLSA helpline:{' '}
              <strong style={{ color: 'var(--green)' }}>15100</strong>
            </div>
          </div>
        )}

        {!loading && results.length > 1 && !selected && (
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Found {results.length} results — select one to view details:
            </div>
            {results.map((p, i) => (
              <div key={i} onClick={() => setSelected(p)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.2rem', background: 'var(--bg-card)',
                  border: '1px solid var(--border-green)', borderRadius: 10,
                  marginBottom: '0.7rem', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: 'var(--shadow)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-green)' }}>
                    {p.name || p.prisoner_name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {p.prisoner_id} · {p.district}
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--green)' }}>View details →</div>
              </div>
            ))}
          </div>
        )}

        {!loading && selected && (
          <PrisonerCard prisoner={selected} onBack={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

function PrisonerCard({ prisoner: p }) {
  const rawDays = p.days_in_custody || getDaysInCustody(p.arrest_date);
  const rawStatus = p.alert_status || getAlertStatus(rawDays, p.ipc_sections || '');

  const alertColors = {
    red: { bg: 'rgba(226,75,74,0.08)', border: 'rgba(226,75,74,0.25)',
      text: '#f09595', label: 'OVERDUE — Exceeds Legal Detention Limit' },
    orange: { bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.25)',
      text: '#fac775', label: 'APPROACHING LIMIT — Review Bail Status' },
    yellow: { bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.25)',
      text: '#fac775', label: 'APPROACHING LIMIT — Review Bail Status' },
    green: { bg: 'var(--green-faint)', border: 'var(--border-green)',
      text: 'var(--green)', label: 'Within Legal Detention Period' },
  };
  const ac = alertColors[rawStatus] || alertColors.green;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' });

  const daysUntilHearing = () => {
    const nextDate = p.next_hearing_date || p.next_hearing;
    if (!nextDate) return '—';
    return Math.ceil((new Date(nextDate) - new Date()) / (1000 * 60 * 60 * 24));
  };

  const name = p.name || p.prisoner_name || 'Unknown';
  const lawyerName = p.lawyer || p.lawyer_assigned || 'Not assigned';
  const lawyerPhone = p.lawyer_phone || null;
  const nextHearing = p.next_hearing_date || p.next_hearing || null;
  const hearings = p.hearings || [];

  return (
    <div>
      <div style={{ padding: '0.8rem 1.2rem', background: ac.bg,
        border: `1px solid ${ac.border}`, borderRadius: 8,
        marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ac.text, flexShrink: 0 }} />
        <span style={{ fontSize: '0.78rem', color: ac.text, fontWeight: 500, letterSpacing: '0.5px' }}>
          {ac.label}
        </span>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
        borderRadius: 14, overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>

        <div style={{ padding: '1.5rem 1.8rem', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12,
              background: 'var(--green-faint)', border: '1px solid var(--border-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem',
                fontWeight: 700, color: 'var(--text-green)', lineHeight: 1 }}>{name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Age {p.age || '—'} · {p.prisoner_id}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
              color: 'var(--text-faint)', marginBottom: 4 }}>Days in Custody</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif",
              fontSize: '2.2rem', fontWeight: 700, color: ac.text, lineHeight: 1 }}>
              {rawDays}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 2 }}>
              since {formatDate(p.arrest_date)}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {[
            { label: 'Prison Location', value: p.prison || p.prison_location },
            { label: 'District Court', value: p.court },
            { label: 'Charges', value: p.charges },
            { label: 'IPC Sections', value: p.ipc_sections },
            { label: 'Lawyer Assigned', value: lawyerName,
              sub: lawyerPhone ? `📞 ${lawyerPhone}` : null,
              highlight: lawyerName === 'Not assigned yet' || lawyerName === 'Not assigned' },
            { label: 'Presiding Judge', value: p.judge || '—' },
            { label: 'Case Number', value: p.case_number || p.prisoner_id },
            { label: 'Case Status', value: p.case_status },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem 1.8rem',
              borderBottom: '1px solid var(--border-subtle)',
              borderRight: i % 2 === 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'var(--text-faint)', marginBottom: '0.3rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.85rem',
                color: item.highlight ? '#f09595' : 'var(--text-green)',
                fontWeight: item.highlight ? 500 : 400 }}>{item.value || '—'}</div>
              {item.sub && (
                <div style={{ fontSize: '0.75rem', color: 'var(--green)', marginTop: 2 }}>{item.sub}</div>
              )}
            </div>
          ))}
        </div>

        {nextHearing && (
          <div style={{ padding: '1.2rem 1.8rem', background: 'var(--green-faint)',
            borderTop: '1px solid var(--border-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'var(--text-faint)', marginBottom: '0.3rem' }}>Next Hearing Date</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-green)' }}>
                {formatDate(nextHearing)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'var(--text-faint)', marginBottom: '0.3rem' }}>Days Until Hearing</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1.8rem', fontWeight: 600, color: 'var(--gold)' }}>
                {daysUntilHearing()}
              </div>
            </div>
          </div>
        )}
      </div>

      {hearings.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 14, padding: '1.5rem 1.8rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem',
            fontWeight: 600, color: 'var(--text-green)', marginBottom: '1.5rem' }}>Hearing History</div>
          <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
            <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0,
              width: 1, background: 'var(--border-green)' }} />
            {hearings.map((h, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '1.2rem' }}>
                <div style={{ position: 'absolute', left: '-1.5rem', top: 4,
                  width: 13, height: 13, borderRadius: '50%',
                  background: i === hearings.length - 1 ? 'var(--green)' : 'var(--green-faint)',
                  border: '2px solid var(--bg-green)', zIndex: 1 }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)',
                  marginBottom: '0.2rem', letterSpacing: '0.5px' }}>
                  {new Date(h.hearing_date || h.date).toLocaleDateString('en-IN',
                    { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-green)', marginBottom: '0.2rem' }}>{h.outcome}</div>
                {h.delay_reason && h.delay_reason !== 'None' && (
                  <div style={{ fontSize: '0.73rem', color: 'rgba(239,159,39,0.8)',
                    display: 'flex', alignItems: 'center', gap: 4 }}>
                    ⚠ Delayed — {h.delay_reason}
                  </div>
                )}
              </div>
            ))}
            {nextHearing && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <div style={{ position: 'absolute', left: '-1.5rem', top: 4,
                  width: 13, height: 13, borderRadius: '50%',
                  border: '2px solid var(--green)', background: 'transparent', zIndex: 1 }} />
                <div style={{ fontSize: '0.7rem', color: 'var(--green-dim)',
                  marginBottom: '0.2rem', letterSpacing: '0.5px' }}>
                  UPCOMING — {new Date(nextHearing).toLocaleDateString('en-IN',
                    { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Next scheduled hearing
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '1rem 1.4rem', background: 'var(--green-faint)',
        border: '1px solid var(--border-green)', borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Need a lawyer? Call NALSA Legal Aid Helpline free
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)' }}>15100</div>
      </div>
    </div>
  );
}