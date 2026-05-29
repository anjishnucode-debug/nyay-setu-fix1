import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { addPrisoner } from '../../data/prisoners';
import { addUndertrial } from '../../data/undertrials';

export default function RegisterPrisoner() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    prisoner_id: '',
    case_number: '',
    arrest_date: new Date().toISOString().split('T')[0],
    prison: 'Central Prison, Parappana Agrahara, Bengaluru',
    district: 'Bengaluru Urban',
    charges: '',
    ipc_sections: '',
    lawyer: '',
    lawyer_phone: '',
    court: 'Sessions Court, Bengaluru',
    judge: '',
    next_hearing: '',
    case_status: 'Under Investigation',
    offense_type: 'non-bailable',
    flight_risk: 'low',
    prior_record: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(field, val) {
    setFormData(prev => ({ ...prev, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter the prisoner\'s full name.');
      return;
    }
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) {
      setError('Please enter a valid age.');
      return;
    }
    if (!formData.arrest_date) {
      setError('Please select the arrest date.');
      return;
    }

    setError('');

    // Generate values if empty
    const uniqueNum = Math.floor(100 + Math.random() * 900);
    const generatedId = formData.prisoner_id.trim() || `KA/BLR/2026/${uniqueNum}`;
    const generatedCaseNum = formData.case_number.trim() || `SC/BLR/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    const newPrisoner = {
      prisoner_id: generatedId,
      prisoner_name: formData.name.trim(),
      age: Number(formData.age),
      arrest_date: formData.arrest_date,
      prison_location: formData.prison,
      district: formData.district,
      charges: formData.charges || 'General Investigation',
      ipc_sections: formData.ipc_sections || 'IPC 379',
      lawyer_assigned: formData.lawyer || 'Not assigned yet',
      lawyer_phone: formData.lawyer_phone || null,
      case_status: formData.case_status,
      court: formData.court,
      judge: formData.judge || 'Hon. Justice K. Ramakrishna',
      next_hearing_date: formData.next_hearing || null,
      family_contact: '9900112233',
      case_number: generatedCaseNum,
      hearings: [],
    };

    const newUndertrial = {
      id: `UT0${Math.floor(50 + Math.random() * 100)}`,
      prisoner_id: generatedId,
      name: formData.name.trim(),
      age: Number(formData.age),
      arrest_date: formData.arrest_date,
      district: formData.district,
      prison: formData.prison,
      charges: formData.charges || 'General Investigation',
      ipc_sections: formData.ipc_sections || 'IPC 379',
      lawyer: formData.lawyer || 'Not assigned yet',
      has_lawyer: !!formData.lawyer,
      case_status: formData.case_status,
      court: formData.court,
      next_hearing: formData.next_hearing || null,
      prior_record: formData.prior_record,
      offense_type: formData.offense_type,
      flight_risk: formData.flight_risk,
    };

    // Save to both databases dynamically (which automatically saves to localStorage)
    addPrisoner(newPrisoner);
    addUndertrial(newUndertrial);

    setSuccess(true);
  }

  return (
    <PageWrapper style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>Case Registration Portal</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Register Prisoner Manually
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            Submit prisoner details to record them in both the Legal Overdue Compliance Dashboard and the Citizen Status search portal.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
            borderRadius: 14, padding: '2rem', boxShadow: 'var(--shadow)' }}>

            {error && (
              <div style={{ padding: '0.8rem 1rem', background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.25)',
                borderRadius: 8, color: '#f09595', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Core Section: Basic Information */}
            <h3 style={{ fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: '1.2rem' }}>
              1. Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1.2fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Full Name of Prisoner *</label>
                <input
                  type="text" placeholder="e.g. Ramesh Kumar Nair" required
                  value={formData.name} onChange={e => handleChange('name', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Age *</label>
                <input
                  type="number" placeholder="e.g. 34" min="1" required
                  value={formData.age} onChange={e => handleChange('age', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Arrest Date *</label>
                <input
                  type="date" required
                  value={formData.arrest_date} onChange={e => handleChange('arrest_date', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
            </div>

            {/* Core Section: Legal Information */}
            <h3 style={{ fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: '1.2rem' }}>
              2. Case & Legal Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Prisoner ID (Optional - Will Auto-generate)</label>
                <input
                  type="text" placeholder="e.g. KA/BLR/2024/001"
                  value={formData.prisoner_id} onChange={e => handleChange('prisoner_id', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Case Reference / CR Number (Optional)</label>
                <input
                  type="text" placeholder="e.g. SC/BLR/2024/1182"
                  value={formData.case_number} onChange={e => handleChange('case_number', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Primary IPC / Act Sections</label>
                <input
                  type="text" placeholder="e.g. IPC 379, IPC 447, IPC 411"
                  value={formData.ipc_sections} onChange={e => handleChange('ipc_sections', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Description of Charges</label>
                <input
                  type="text" placeholder="e.g. Theft and criminal trespass"
                  value={formData.charges} onChange={e => handleChange('charges', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>District</label>
                <input
                  type="text" placeholder="e.g. Bengaluru Urban"
                  value={formData.district} onChange={e => handleChange('district', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Prison Facility Location</label>
                <input
                  type="text" placeholder="e.g. Central Prison, Parappana Agrahara"
                  value={formData.prison} onChange={e => handleChange('prison', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Presiding Court</label>
                <input
                  type="text" placeholder="e.g. Sessions Court, Bengaluru"
                  value={formData.court} onChange={e => handleChange('court', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Presiding Judge</label>
                <input
                  type="text" placeholder="e.g. Hon. Justice K. Ramakrishna"
                  value={formData.judge} onChange={e => handleChange('judge', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
            </div>

            {/* Core Section: Advocate & Custody Params */}
            <h3 style={{ fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6, marginBottom: '1.2rem' }}>
              3. Legal Counsel & Risk Metrics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Assigned Lawyer</label>
                <input
                  type="text" placeholder="e.g. Adv. Suresh Bhat"
                  value={formData.lawyer} onChange={e => handleChange('lawyer', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Lawyer Phone</label>
                <input
                  type="tel" placeholder="e.g. 9845012345"
                  value={formData.lawyer_phone} onChange={e => handleChange('lawyer_phone', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Offense Severity</label>
                <select
                  value={formData.offense_type} onChange={e => handleChange('offense_type', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}
                >
                  <option value="bailable">Bailable (Minor)</option>
                  <option value="non-bailable">Non-Bailable (Moderate)</option>
                  <option value="heinous">Heinous (Major)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Flight Risk Indices</label>
                <select
                  value={formData.flight_risk} onChange={e => handleChange('flight_risk', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Next Scheduled Hearing</label>
                <input
                  type="date"
                  value={formData.next_hearing} onChange={e => handleChange('next_hearing', e.target.value)}
                  style={{ width: '100%', background: 'var(--input-bg-gold)', border: '1px solid var(--border-gold)',
                    borderRadius: 8, padding: '0.6rem 0.8rem', color: 'var(--input-color)', outline: 'none',
                    fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 15 }}>
                <input
                  type="checkbox" id="prior_record"
                  checked={formData.prior_record} onChange={e => handleChange('prior_record', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
                <label htmlFor="prior_record" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Has prior criminal history / record
                </label>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" style={{
              width: '100%', padding: '0.9rem', background: 'var(--gold)', border: 'none',
              borderRadius: 10, color: 'var(--bg-secondary)', fontFamily: "'Outfit', sans-serif",
              fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s',
              boxShadow: '0 4px 15px rgba(212,163,89,0.2)'
            }}>
              Register Undertrial Prisoner
            </button>

          </form>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
            borderRadius: 14, padding: '4rem 2rem', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--gold-faint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem', color: 'var(--gold)' }}>
              👤
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Registration Complete!
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 500, margin: '0 auto 2rem' }}>
              The prisoner <strong>{formData.name}</strong> has been successfully registered. They are now trackable in both the lawyer compliance registry and citizen status lookup engines.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => { setSuccess(false); setFormData(prev => ({ ...prev, name: '', age: '', prisoner_id: '', case_number: '' })); }}
                style={{ padding: '0.7rem 1.5rem', background: 'var(--gold)', border: 'none', borderRadius: 8,
                  color: 'var(--bg-secondary)', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem' }}>
                Register Another Prisoner
              </button>
              <button onClick={() => navigate('/legal')}
                style={{ padding: '0.7rem 1.5rem', border: '1px solid var(--border-gold)', borderRadius: 8,
                  background: 'transparent', color: 'var(--gold)', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: '0.82rem' }}>
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
