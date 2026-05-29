import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { prisoners } from '../../data/prisoners';

export default function CourtCalendar() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [phone, setPhone] = useState('');

  function handleSearch() {
    const q = query.toLowerCase().trim();
    const found = prisoners.find(p =>
      p.case_number?.toLowerCase().includes(q) ||
      p.prisoner_id?.toLowerCase().includes(q) ||
      p.prisoner_name?.toLowerCase().includes(q)
    );
    if (found) { setResult(found); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const daysUntil = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
  };

  const allDates = result ? [
    ...result.hearings.map(h => ({ date: h.date, type: 'past', label: h.outcome, delay: h.delay_reason })),
    { date: result.next_hearing_date, type: 'upcoming', label: 'Next Scheduled Hearing', delay: null }
  ] : [];

  return (
    <PageWrapper green>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--green-dim)', marginBottom: '0.3rem' }}>Hearing Schedule</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
          fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.4rem' }}>Court Calendar</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300, marginBottom: '2rem' }}>
          Enter a case number or prisoner ID to view the full hearing history and next date.
        </p>

        <div style={{ display: 'flex', background: 'var(--input-bg-green)',
          border: '1px solid var(--border-green)', borderRadius: 10,
          overflow: 'hidden', marginBottom: '0.6rem', boxShadow: 'var(--shadow)' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Case number e.g. SC/BLR/2024/1182 or Prisoner ID"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '0.9rem 1.2rem', fontSize: '0.9rem', color: 'var(--input-color)',
              fontFamily: "'Outfit',sans-serif" }}
          />
          <button onClick={handleSearch}
            style={{ padding: '0.9rem 2rem', background: 'var(--green)', border: 'none',
              color: 'white', fontFamily: "'Outfit',sans-serif",
              fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Search</button>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginBottom: '1.5rem' }}>
          Try: SC/BLR/2024/1182 · JMFC/MYS/2023/887 · SC/TUK/2023/445
        </div>

        {notFound && (
          <div style={{ padding: '2rem', textAlign: 'center',
            border: '1px solid var(--border-green)', borderRadius: 12,
            background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            <div style={{ color: 'var(--text-green)', marginBottom: '0.4rem' }}>No case found</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Check the case number and try again, or contact your nearest court registry.
            </div>
          </div>
        )}

        {result && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
              borderRadius: 12, padding: '1.4rem 1.8rem', marginBottom: '1.5rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              boxShadow: 'var(--shadow)' }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem',
                  fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.3rem' }}>
                  {result.prisoner_name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {result.case_number} · {result.court}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: 4 }}>
                  {result.charges}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: 1, textTransform: 'uppercase',
                  color: 'var(--green-dim)', marginBottom: 4 }}>Next hearing in</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '2rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                  {daysUntil(result.next_hearing_date)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>days</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
              borderRadius: 12, padding: '1.5rem 1.8rem', marginBottom: '1.5rem',
              boxShadow: 'var(--shadow)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem',
                fontWeight: 600, color: 'var(--text-green)', marginBottom: '1.5rem' }}>Full Hearing Timeline</div>
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0,
                  width: 1, background: 'var(--border-green)' }} />
                {allDates.map((item, i) => {
                  const isUpcoming = item.type === 'upcoming';
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: '1.3rem' }}>
                      <div style={{ position: 'absolute', left: '-1.5rem', top: 5,
                        width: 13, height: 13, borderRadius: '50%', zIndex: 1,
                        background: isUpcoming ? 'transparent' : 'var(--green)',
                        border: isUpcoming ? '2px solid var(--gold)' : '2px solid var(--bg-green)' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.72rem',
                          color: isUpcoming ? 'var(--gold)' : 'var(--text-muted)',
                          letterSpacing: '0.5px' }}>
                          {isUpcoming ? '⬡ UPCOMING — ' : ''}{formatDate(item.date)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem',
                        color: isUpcoming ? 'var(--text-secondary)' : 'var(--text-green)',
                        fontStyle: isUpcoming ? 'italic' : 'normal',
                        marginBottom: '0.2rem' }}>{item.label}</div>
                      {item.delay && item.delay !== 'None' && (
                        <div style={{ fontSize: '0.72rem', color: 'rgba(239,159,39,0.8)',
                          display: 'flex', alignItems: 'center', gap: 4 }}>
                          ⚠ Delayed — {item.delay}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {!subscribed ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
                borderRadius: 12, padding: '1.2rem 1.8rem', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500,
                  color: 'var(--text-green)', marginBottom: '0.3rem' }}>🔔 Get SMS Alerts</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                  We'll text you when the hearing date changes or a new date is set.
                </div>
                <div style={{ display: 'flex', gap: '0.7rem' }}>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Enter your mobile number"
                    style={{ flex: 1, background: 'var(--input-bg-green)',
                      border: '1px solid var(--border-green)', borderRadius: 8,
                      padding: '0.7rem 1rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.85rem', fontFamily: "'Outfit',sans-serif" }}
                  />
                  <button onClick={() => setSubscribed(true)}
                    style={{ padding: '0.7rem 1.5rem', background: 'var(--green)', border: 'none',
                      borderRadius: 8, color: 'white', fontFamily: "'Outfit',sans-serif",
                      fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                    Subscribe
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem 1.4rem', background: 'var(--green-faint)',
                border: '1px solid var(--border-green)', borderRadius: 10,
                display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  You'll receive SMS alerts on <strong style={{ color: 'var(--text-green)' }}>{phone}</strong> when this case has an update.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}