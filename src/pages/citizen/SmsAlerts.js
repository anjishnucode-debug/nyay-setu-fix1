import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { prisoners } from '../../data/prisoners';

export default function SmsAlerts() {
  const [phone, setPhone] = useState('');
  const [caseNum, setCaseNum] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({
    hearings: true,
    bail: true,
    release: false,
    transfers: true,
  });

  // Handle case number suggestions based on typed input
  function handleCaseChange(val) {
    setCaseNum(val);
    if (val.trim().length > 3) {
      const found = prisoners.find(p =>
        p.case_number?.toLowerCase().includes(val.toLowerCase().trim()) ||
        p.prisoner_id?.toLowerCase().includes(val.toLowerCase().trim()) ||
        p.prisoner_name?.toLowerCase().includes(val.toLowerCase().trim())
      );
      setSelectedCase(found || null);
    } else {
      setSelectedCase(null);
    }
  }

  function selectSuggestion(p) {
    setCaseNum(p.case_number);
    setSelectedCase(p);
  }

  function handleSubscribe(e) {
    e.preventDefault();
    if (!phone || phone.trim().length !== 10 || isNaN(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!selectedCase) {
      setError('Please enter a valid case number, prisoner ID, or name.');
      return;
    }
    setError('');
    setSuccess(true);
  }

  function togglePreference(pref) {
    setPreferences(prev => ({ ...prev, [pref]: !prev[pref] }));
  }

  return (
    <PageWrapper green>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 650, margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--green-dim)', marginBottom: '0.3rem' }}>Real-time Notifications</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
          fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.4rem' }}>SMS Alert Service</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300, marginBottom: '2.5rem' }}>
          Subscribe to automatic SMS notifications to track hearing updates, bail status, and case progression.
        </p>

        {!success ? (
          <form onSubmit={handleSubscribe} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
            borderRadius: 14, padding: '2rem', boxShadow: 'var(--shadow)' }}>
            
            {error && (
              <div style={{ padding: '0.8rem 1rem', background: 'rgba(226, 75, 74, 0.1)', border: '1px solid rgba(226, 75, 74, 0.3)',
                borderRadius: 8, color: '#f09595', fontSize: '0.8rem', marginBottom: '1.2rem', display: 'flex', gap: 6, alignItems: 'center' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Mobile Number */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-green)', marginBottom: '0.5rem' }}>
                📞 Mobile Number
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', background: 'var(--green-faint)', border: '1px solid var(--border-green)',
                  borderRadius: 8, padding: '0.6rem 0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>+91</span>
                <input
                  type="tel" placeholder="Enter your 10-digit mobile number"
                  value={phone} onChange={e => setPhone(e.target.value.slice(0, 10))}
                  style={{ flex: 1, background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                    borderRadius: 8, padding: '0.6rem 1rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
            </div>

            {/* Case Reference & Autocomplete */}
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-green)', marginBottom: '0.5rem' }}>
                ⚖️ Case Number / Prisoner ID / Name
              </label>
              <input
                type="text" placeholder="e.g. SC/BLR/2024/1182 or Ramesh Kumar"
                value={caseNum} onChange={e => handleCaseChange(e.target.value)}
                style={{ width: '100%', background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                  borderRadius: 8, padding: '0.6rem 1rem', color: 'var(--input-color)', outline: 'none',
                  fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }}
              />

              {/* Suggestions dropdown based on partial typing */}
              {!selectedCase && caseNum.trim().length > 2 && (
                <div style={{ background: '#0e1b17', border: '1px solid var(--border-green)', borderRadius: 8,
                  marginTop: 4, overflow: 'hidden', zIndex: 10, position: 'absolute', width: '100%' }}>
                  {prisoners.filter(p => 
                    p.case_number?.toLowerCase().includes(caseNum.toLowerCase()) ||
                    p.prisoner_name?.toLowerCase().includes(caseNum.toLowerCase())
                  ).slice(0, 3).map(p => (
                    <div
                      key={p.prisoner_id} onClick={() => selectSuggestion(p)}
                      style={{ padding: '0.6rem 1rem', fontSize: '0.78rem', color: '#c4e0d7', cursor: 'pointer',
                        borderBottom: '1px solid rgba(26,140,111,0.1)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,140,111,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      🔍 <strong>{p.prisoner_name}</strong> · {p.case_number} ({p.court})
                    </div>
                  ))}
                </div>
              )}

              {/* Successful case matching card */}
              {selectedCase && (
                <div style={{ marginTop: '0.8rem', padding: '0.8rem 1rem', borderRadius: 8,
                  background: 'rgba(26, 140, 111, 0.08)', border: '1px solid var(--green)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-green)' }}>
                      ✅ Case Found: {selectedCase.prisoner_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {selectedCase.case_number} · {selectedCase.court}
                    </div>
                  </div>
                  <button type="button" onClick={() => { setSelectedCase(null); setCaseNum(''); }}
                    style={{ background: 'transparent', border: 'none', color: '#f09595', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-green)', marginBottom: '0.8rem' }}>
                ⚙️ Select Alert Preferences
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'hearings', label: 'Hearing Date & Schedule Updates', desc: 'Get notified immediately if a hearing date shifts or is rescheduled.' },
                  { key: 'bail', label: 'Bail Application Progression', desc: 'Updates regarding bail applications, submissions, and approvals.' },
                  { key: 'transfers', label: 'Prisoner Transit / Transfer alerts', desc: 'Alerts if a family member is moved to a new facility or transit ward.' },
                  { key: 'release', label: 'Under-trial Release Eligibility Notification', desc: 'Critical alert if case fulfills Section 436A / early discharge parameters.' },
                ].map(p => (
                  <div
                    key={p.key} onClick={() => togglePreference(p.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '0.8rem',
                      borderRadius: 10, border: '1px solid var(--border-green)', cursor: 'pointer',
                      background: preferences[p.key] ? 'rgba(26,140,111,0.03)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-green-hover)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-green)'}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--green)',
                      background: preferences[p.key] ? 'var(--green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {preferences[p.key] && <span style={{ color: 'white', fontSize: '0.7rem' }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-green)' }}>{p.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%', padding: '0.9rem', background: 'var(--green)', border: 'none',
                borderRadius: 10, color: 'white', fontFamily: "'Outfit', sans-serif",
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 15px rgba(26,140,111,0.2)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              Subscribe to SMS Alerts
            </button>

          </form>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
            borderRadius: 14, padding: '3rem 2rem', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(26, 140, 111, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>
              🔔
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.6rem', color: 'var(--text-green)', marginBottom: '0.6rem' }}>
              Subscription Confirmed!
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 450, margin: '0 auto 1.5rem' }}>
              We have successfully linked the mobile number <strong style={{ color: 'var(--text-green)' }}>+91 {phone}</strong> to the case of <strong>{selectedCase.prisoner_name}</strong> ({selectedCase.case_number}).
            </p>

            <div style={{ border: '1px solid var(--border-green)', borderRadius: 10, padding: '1rem',
              maxWidth: 400, margin: '0 auto 2rem', background: 'var(--green-faint)', textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-green)', marginBottom: 6 }}>
                Active Alerts Registered:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {preferences.hearings && <li>Rescheduling and hearing delays</li>}
                {preferences.bail && <li>Bail application filings and responses</li>}
                {preferences.transfers && <li>Transit or facility transfer notifications</li>}
                {preferences.release && <li>Under-trial release eligibility indices</li>}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => { setSuccess(false); setPhone(''); setCaseNum(''); setSelectedCase(null); }}
                style={{ padding: '0.7rem 1.4rem', border: '1px solid var(--border-green)', borderRadius: 8,
                  background: 'transparent', color: 'var(--text-green)', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem' }}>
                Subscribe Another Number
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
