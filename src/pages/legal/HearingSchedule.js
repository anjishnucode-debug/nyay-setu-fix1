import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { prisoners } from '../../data/prisoners';

export default function HearingSchedule() {
  const [schedule, setSchedule] = useState(() => {
    // Sort all prisoners with a valid next hearing date chronologically
    return [...prisoners]
      .filter(p => p.next_hearing_date)
      .sort((a, b) => new Date(a.next_hearing_date) - new Date(b.next_hearing_date));
  });

  const [selectedCase, setSelectedCase] = useState(null);
  const [adjournMatter, setAdjournMatter] = useState({
    outcome: '',
    delayReason: 'Court Backlog',
    newDate: '',
  });
  const [success, setSuccess] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const daysRemaining = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  function handleLogAdjournment(e) {
    e.preventDefault();
    if (!selectedCase || !adjournMatter.outcome || !adjournMatter.newDate) return;

    // Mutate the prisoner's record
    const target = prisoners.find(p => p.prisoner_id === selectedCase.prisoner_id);
    if (target) {
      const newHearing = {
        date: target.next_hearing_date,
        outcome: adjournMatter.outcome,
        delay_reason: adjournMatter.delayReason,
        next_date: adjournMatter.newDate,
      };
      
      target.hearings = [...(target.hearings || []), newHearing];
      target.next_hearing_date = adjournMatter.newDate;

      // Persist in localStorage
      const customs = JSON.parse(localStorage.getItem('custom_prisoners') || '[]');
      const existIdx = customs.findIndex(c => c.prisoner_id === target.prisoner_id);
      if (existIdx >= 0) {
        customs[existIdx] = target;
      } else {
        // If it was a default prisoner, we can add them to custom to override
        customs.push(target);
      }
      localStorage.setItem('custom_prisoners', JSON.stringify(customs));

      // Refresh state list
      const refreshed = [...prisoners]
        .filter(p => p.next_hearing_date)
        .sort((a, b) => new Date(a.next_hearing_date) - new Date(b.next_hearing_date));
      setSchedule(refreshed);

      setSuccess(`Hearing for ${target.prisoner_name} successfully adjourned to ${formatDate(adjournMatter.newDate)}.`);
      setTimeout(() => setSuccess(''), 4000);
      setSelectedCase(null);
      setAdjournMatter({ outcome: '', delayReason: 'Court Backlog', newDate: '' });
    }
  }

  return (
    <PageWrapper style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
              color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>Court Calendaring</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
              Hearing Schedule
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
              Chronological schedule of upcoming trial sessions, judge allocations, and delay tracking.
            </p>
          </div>
        </div>

        {success && (
          <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)',
            borderRadius: 8, color: '#1d9e75', fontSize: '0.8rem', marginBottom: '1.2rem' }}>
            ✅ {success}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selectedCase ? '1.2fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Timeline List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schedule.map((item, idx) => {
              const days = daysRemaining(item.next_hearing_date);
              const isOverdue = days < 0;
              const isToday = days === 0;

              return (
                <div
                  key={item.prisoner_id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 12,
                    padding: '1.2rem 1.5rem',
                    boxShadow: 'var(--shadow)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Overdue highlight strip */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, 
                    background: isOverdue ? '#e24b4a' : isToday ? 'var(--gold)' : 'var(--green)' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div>
                      <span style={{ fontSize: '0.62rem', letterSpacing: 1.5, textTransform: 'uppercase',
                        color: isOverdue ? '#e24b4a' : 'var(--text-faint)' }}>
                        {isOverdue ? '⚠️ Overdue Hearing' : isToday ? '⚡ Scheduled Today' : `🗓️ Hearing in ${days} Days`}
                      </span>
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                        {item.prisoner_name}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ID: {item.prisoner_id} · Case: {item.case_number}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold)' }}>
                        {new Date(item.next_hearing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>
                        {item.court.split(',')[0]}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', fontSize: '0.78rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-faint)', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 2 }}>Presiding Judge</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{item.judge}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-faint)', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 2 }}>Charges Listed</div>
                      <div style={{ color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.charges}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '0.8rem', borderTop: '1px solid rgba(212,163,89,0.08)', paddingTop: '0.6rem' }}>
                    <button
                      onClick={() => setSelectedCase(item)}
                      style={{
                        padding: '5px 12px',
                        background: 'var(--gold-faint)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: 6,
                        color: 'var(--gold)',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--gold-faint)'}
                    >
                      Log Adjournment / Delay 📝
                    </button>
                  </div>
                </div>
              );
            })}

            {schedule.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', border: '1px solid var(--border-gold)', borderRadius: 12, background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <div style={{ color: 'var(--text-primary)' }}>No hearings scheduled currently</div>
              </div>
            )}
          </div>

          {/* Adjournment Form Drawer */}
          {selectedCase && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
              borderRadius: 12, padding: '1.4rem', boxShadow: 'var(--shadow)', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8, marginBottom: '1.2rem' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>
                  Log Adjournment
                </h3>
                <button
                  onClick={() => setSelectedCase(null)}
                  style={{ background: 'transparent', border: 'none', color: '#f09595', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>

              <div style={{ marginBottom: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Logging trial outcome on <strong>{formatDate(selectedCase.next_hearing_date)}</strong> for <strong>{selectedCase.prisoner_name}</strong>.
              </div>

              <form onSubmit={handleLogAdjournment}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: 4 }}>Trial Outcome / Activity</label>
                  <input
                    type="text" required placeholder="e.g. Cross examination postponed, bail denied again"
                    value={adjournMatter.outcome} onChange={e => setAdjournMatter(prev => ({ ...prev, outcome: e.target.value }))}
                    style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                      borderRadius: 8, padding: '0.5rem 0.7rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.78rem', fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: 4 }}>Reason for Adjournment/Delay</label>
                  <select
                    value={adjournMatter.delayReason} onChange={e => setAdjournMatter(prev => ({ ...prev, delayReason: e.target.value }))}
                    style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                      borderRadius: 8, padding: '0.5rem 0.7rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.78rem', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}
                  >
                    <option value="Court Backlog">Court Backlog / Congestion</option>
                    <option value="Judge on leave">Judge on leave</option>
                    <option value="Lawyer on leave">Lawyer on leave / Unavailable</option>
                    <option value="Witness non-appearance">Witness non-appearance</option>
                    <option value="Chargesheet pending">Investigation reports/chargesheet pending</option>
                    <option value="None">None (Proceeding normally)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.67rem', color: 'var(--text-muted)', marginBottom: 4 }}>Next Scheduled Hearing Date</label>
                  <input
                    type="date" required
                    value={adjournMatter.newDate} onChange={e => setAdjournMatter(prev => ({ ...prev, newDate: e.target.value }))}
                    style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                      borderRadius: 8, padding: '0.5rem 0.7rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.78rem', fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>

                <button type="submit" style={{
                  width: '100%', padding: '0.7rem', background: 'var(--gold)', border: 'none',
                  borderRadius: 8, color: 'var(--bg-secondary)', fontWeight: 600, fontSize: '0.8rem',
                  fontFamily: "'Outfit', sans-serif", cursor: 'pointer', transition: 'all 0.25s'
                }}>
                  Submit Outcomes & Update Calendar
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
