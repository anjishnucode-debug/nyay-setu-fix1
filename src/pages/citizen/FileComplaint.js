import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';

export default function FileComplaint() {
  const [activeTab, setActiveTab] = useState('types');
  const [isCognizable, setIsCognizable] = useState(null);
  const [draftData, setDraftData] = useState({
    spName: '',
    district: '',
    policeStation: '',
    complainantName: '',
    dateOfIncident: '',
    description: '',
  });

  const categories = [
    { id: 'types', icon: '🔍', label: '1. Know the Type' },
    { id: 'fir', icon: '📝', label: '2. Filing the FIR' },
    { id: 'refused', icon: '🛡️', label: '3. If Police Refuses' },
    { id: 'draft', icon: '✍️', label: '4. SP Complaint Draft' },
  ];

  function handleDraftChange(field, val) {
    setDraftData(prev => ({ ...prev, [field]: val }));
  }

  return (
    <PageWrapper green>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--green-dim)', marginBottom: '0.3rem' }}>Citizen Legal Guide</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
          fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.4rem' }}>File a Complaint</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300, marginBottom: '2rem' }}>
          An interactive, step-by-step citizen guide to reporting offenses and securing your legal rights in India.
        </p>

        {/* Navigation Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '2rem' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '0.8rem 0.5rem',
                background: activeTab === cat.id ? 'var(--green)' : 'var(--bg-card)',
                border: activeTab === cat.id ? '1px solid var(--green)' : '1px solid var(--border-green)',
                borderRadius: 10,
                color: activeTab === cat.id ? 'white' : 'var(--text-green)',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.25s',
                boxShadow: activeTab === cat.id ? '0 4px 15px rgba(26,140,111,0.2)' : 'var(--shadow)',
              }}
              onMouseEnter={e => {
                if (activeTab !== cat.id) {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-green-hover)';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== cat.id) {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border-green)';
                }
              }}
            >
              <span>{cat.icon}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
          borderRadius: 14, padding: '2rem', boxShadow: 'var(--shadow)', minHeight: 400 }}>

          {/* TAB 1: TYPES */}
          {activeTab === 'types' && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: 'var(--text-green)', marginBottom: '1rem' }}>
                Step 1: Identify the Nature of the Offense
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Indian criminal law categorizes offenses into two main classes. Knowing the difference determines how you report the matter:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Cognizable card */}
                <div style={{ border: '1px solid rgba(26,140,111,0.2)', padding: '1.2rem', borderRadius: 10, background: 'rgba(26,140,111,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>🚨</span>
                    <strong style={{ color: 'var(--text-green)', fontSize: '0.9rem' }}>Cognizable Offense</strong>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <li><strong>Definition:</strong> Serious crimes where police can arrest without a warrant and start an investigation immediately.</li>
                    <li><strong>Key Examples:</strong> Theft, robbery, assault, murder, kidnapping.</li>
                    <li><strong>Primary Action:</strong> File a First Information Report (FIR) directly at the police station.</li>
                  </ul>
                </div>

                {/* Non-Cognizable card */}
                <div style={{ border: '1px solid rgba(212,163,89,0.2)', padding: '1.2rem', borderRadius: 10, background: 'rgba(212,163,89,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>⚖️</span>
                    <strong style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>Non-Cognizable Offense</strong>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <li><strong>Definition:</strong> Less serious offenses where police cannot arrest without a warrant or investigate without Magistrate approval.</li>
                    <li><strong>Key Examples:</strong> Simple defamation, cheating, minor public nuisance, abuse.</li>
                    <li><strong>Primary Action:</strong> Recorded in the Non-Cognizable Register (NCR). You must approach the Magistrate.</li>
                  </ul>
                </div>
              </div>

              {/* Interactive Classifier */}
              <div style={{ border: '1px solid var(--border-green)', borderRadius: 10, padding: '1.2rem', background: 'var(--green-faint)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-green)', marginBottom: '0.5rem' }}>
                  🔍 Quick Checker: Is your situation a Cognizable offense?
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Select the description that closest matches your concern to determine the correct pathway:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button onClick={() => setIsCognizable(true)} style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-green)',
                    background: isCognizable === true ? 'var(--green)' : 'transparent',
                    color: isCognizable === true ? 'white' : 'var(--text-muted)',
                    fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', cursor: 'pointer'
                  }}>Physical Violence, Theft, or Fraud over ₹10k</button>

                  <button onClick={() => setIsCognizable(false)} style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-green)',
                    background: isCognizable === false ? 'var(--green)' : 'transparent',
                    color: isCognizable === false ? 'white' : 'var(--text-muted)',
                    fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', cursor: 'pointer'
                  }}>Oral insults, simple boundary disputes, or defamation</button>
                </div>

                {isCognizable !== null && (
                  <div style={{ marginTop: '1rem', padding: '0.8rem 1rem', borderRadius: 8,
                    background: isCognizable ? 'rgba(26,140,111,0.1)' : 'rgba(212,163,89,0.1)',
                    border: isCognizable ? '1px solid var(--green)' : '1px solid var(--gold)',
                    fontSize: '0.8rem', color: 'var(--text-green)', lineHeight: 1.5 }}>
                    {isCognizable ? (
                      <div>
                        <strong>👉 Correct Pathway: File an FIR.</strong> Police are legally bound to record an FIR immediately. Under <strong>Section 154 CrPC</strong> (now <strong>Section 173 BNSS</strong>), you are entitled to a completely free copy of the signed FIR. Proceed to the next tab to learn how.
                      </div>
                    ) : (
                      <div>
                        <strong>👉 Correct Pathway: Non-Cognizable Report (NCR).</strong> The police will register your complaint in the NCR register and hand you a copy. You can then submit this to the local Judicial Magistrate (under <strong>Section 155 CrPC / Section 174 BNSS</strong>) to direct a formal investigation.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FIR PROCESS */}
          {activeTab === 'fir' && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: 'var(--text-green)', marginBottom: '1rem' }}>
                Step 2: How to File a First Information Report (FIR)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Filing an FIR is the formal start of the criminal justice process in India. Follow these steps meticulously at the local police station:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { step: '1', title: 'Visit the Police Station', desc: 'Go to the nearest police station relative to the incident location. Any police station is legally required to accept your complaint (referred to as a "Zero FIR" if it lies outside their jurisdiction, which they must transfer later).' },
                  { step: '2', title: 'Provide Verbal or Written Statement', desc: 'You can dictate the details verbally or present a written complaint. Ensure details are precise: date, exact time, location, suspect details (if known), witnesses present, and chronological facts.' },
                  { step: '3', title: 'Verify and Sign the Written Copy', desc: 'The police officer MUST read the written record back to you before you sign. Confirm that everything corresponds exactly to your verbal testimony. Never sign a blank document or a draft containing factual deviations.' },
                  { step: '4', title: 'Demand a Free Signed Copy', desc: 'Under Section 154 of the CrPC / Section 173 BNSS, obtaining a copy of the registered FIR is a statutory right. Police must hand over a signed duplicate to the informant absolutely free of charge.' },
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 15, alignItems: 'flex-start',
                    borderBottom: idx !== 3 ? '1px solid var(--border-green)' : 'none',
                    paddingBottom: idx !== 3 ? '1rem' : '0', marginBottom: idx !== 3 ? '0.3rem' : '0' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: 'var(--green)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', fontWeight: 600, flexShrink: 0
                    }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-green)', marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IF REFUSED */}
          {activeTab === 'refused' && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: 'var(--text-green)', marginBottom: '1rem' }}>
                Step 3: Remedies if the Police Refuse to File an FIR
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                It is a common struggle for citizens when local officers refuse to lodge an FIR. The law provides clear, solid alternate pathways to compel action:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: '1px solid var(--border-green)', borderRadius: 10, padding: '1rem', background: 'var(--bg-card-hover)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📮</span>
                    <strong style={{ color: 'var(--text-green)', fontSize: '0.85rem' }}>Option A: Lodge Complaint to the Superintendent of Police (SP)</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Under <strong>Section 154(3) CrPC / Section 173(4) BNSS</strong>, you can send the substance of your complaint in writing via registered post to the regional Superintendent of Police (SP). If satisfied, the SP will either investigate the case directly or order an officer to lodge the FIR.
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-green)', borderRadius: 10, padding: '1rem', background: 'var(--bg-card-hover)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>🏛️</span>
                    <strong style={{ color: 'var(--text-green)', fontSize: '0.85rem' }}>Option B: Approach the Judicial Magistrate</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    If the SP fails to act, you can file a direct private complaint to the Magistrate Court under <strong>Section 200 CrPC / Section 223 BNSS</strong>. The Magistrate has the power under <strong>Section 156(3) CrPC / Section 175 BNSS</strong> to order the police to file a mandatory FIR and start investigating.
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-green)', borderRadius: 10, padding: '1rem', background: 'var(--bg-card-hover)' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📞</span>
                    <strong style={{ color: 'var(--text-green)', fontSize: '0.85rem' }}>Option C: Call Emergency Helplines</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    If you face hostility inside a police station, dial <strong>112</strong> immediately. Additionally, call the **National Legal Services Authority (NALSA) toll-free legal helpline at 15100** to receive direct advice from an on-duty legal counselor.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SP DRAFT HELPER */}
          {activeTab === 'draft' && (
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: 'var(--text-green)', marginBottom: '0.5rem' }}>
                Interactive SP Complaint Letter Builder
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Fill out the simple fields below, and our system will instantly draft a legally compliant complaint letter to send to the Superintendent of Police under Section 154(3) CrPC:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Superintendent of Police (District Name)</label>
                  <input
                    type="text" placeholder="e.g. Bangalore South"
                    value={draftData.spName} onChange={e => handleDraftChange('spName', e.target.value)}
                    style={{ width: '100%', background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                      borderRadius: 8, padding: '0.6rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Your Name (Complainant)</label>
                  <input
                    type="text" placeholder="e.g. Ramesh Kumar"
                    value={draftData.complainantName} onChange={e => handleDraftChange('complainantName', e.target.value)}
                    style={{ width: '100%', background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                      borderRadius: 8, padding: '0.6rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Name of Local Police Station</label>
                  <input
                    type="text" placeholder="e.g. Jayanagar PS"
                    value={draftData.policeStation} onChange={e => handleDraftChange('policeStation', e.target.value)}
                    style={{ width: '100%', background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                      borderRadius: 8, padding: '0.6rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Date of Incident</label>
                  <input
                    type="date"
                    value={draftData.dateOfIncident} onChange={e => handleDraftChange('dateOfIncident', e.target.value)}
                    style={{ width: '100%', background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                      borderRadius: 8, padding: '0.6rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Brief Summary of the Offense</label>
                  <textarea
                    placeholder="Provide a clear, brief 2-3 sentence description of the crime..." rows={3}
                    value={draftData.description} onChange={e => handleDraftChange('description', e.target.value)}
                    style={{ width: '100%', background: 'var(--input-bg-green)', border: '1px solid var(--border-green)',
                      borderRadius: 8, padding: '0.6rem', color: 'var(--input-color)', outline: 'none',
                      fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif", resize: 'none' }}
                  />
                </div>
              </div>

              {/* Dynamic Draft Output */}
              <div style={{ background: '#0e1b17', border: '1px solid var(--border-green)', borderRadius: 10, padding: '1.2rem',
                fontFamily: 'monospace', fontSize: '0.72rem', color: '#c4e0d7', lineHeight: 1.5, position: 'relative' }}>
                <div style={{ position: 'absolute', right: 10, top: 10, fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--green)' }}>
                  📄 Legal Draft Preview
                </div>
                <div><strong>To,</strong></div>
                <div>The Superintendent of Police,</div>
                <div>Office of SP, District: {draftData.spName || '[District Name]'}</div>
                <br />
                <div><strong>Subject:</strong> Complaint under Section 154(3) CrPC / Section 173(4) BNSS against refusal to register FIR by {draftData.policeStation || '[Local PS Name]'}</div>
                <br />
                <div>Respected Sir/Madam,</div>
                <br />
                <div>I, {draftData.complainantName || '[Your Name]'}, state that on {draftData.dateOfIncident || '[Date]'}, a serious, cognizable offense took place involving the following:</div>
                <div style={{ paddingLeft: '1rem', fontStyle: 'italic', margin: '0.5rem 0', color: 'var(--gold)' }}>
                  "{draftData.description || '[Your summary statement will render here]'}"
                </div>
                <div>I approached the officer in charge of {draftData.policeStation || '[Local PS Name]'} on the date of the incident to lodge an FIR. However, they refused to record my information in gross violation of standard statutory mandates.</div>
                <br />
                <div>I request your offices to kindly intervene, register the FIR, and direct an investigation to ensure the safety of the citizens.</div>
                <br />
                <div>Sincerely,</div>
                <div><strong>{draftData.complainantName || '[Your Name]'}</strong></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}
