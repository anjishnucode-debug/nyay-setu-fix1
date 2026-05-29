import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { legalAidData } from '../../data/legalAid';

export default function LegalAidFinder() {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const result = legalAidData.find(d => d.district === selectedDistrict);

  return (
    <PageWrapper green>
      <Navbar theme="green" showBack={true} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--green-dim)', marginBottom: '0.3rem' }}>Karnataka DLSA</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
          fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.4rem' }}>Find Free Legal Aid</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300,
          marginBottom: '2rem', lineHeight: 1.6 }}>
          Every Indian citizen has the right to free legal aid under Article 39A.
          Select your district to find your nearest District Legal Services Authority.
        </p>

        <div style={{ padding: '1rem 1.4rem', background: 'var(--green-faint)',
          border: '1px solid var(--border-green)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: 1, textTransform: 'uppercase',
              color: 'var(--green-dim)', marginBottom: 3 }}>National Legal Aid Helpline</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Call from anywhere in India — free legal advice in your language
            </div>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
            fontWeight: 700, color: 'var(--green)' }}>15100</div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'var(--green-dim)', marginBottom: '0.6rem' }}>Select Your District</div>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1.2rem',
              background: 'var(--input-bg-green)',
              border: '1px solid var(--border-green)', borderRadius: 10,
              color: selectedDistrict ? 'var(--input-color)' : 'var(--input-placeholder)',
              fontSize: '0.9rem', fontFamily: "'Outfit',sans-serif",
              outline: 'none', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
            <option value="">— Choose a district —</option>
            {legalAidData.map((d, i) => (
              <option key={i} value={d.district}>{d.district}</option>
            ))}
          </select>
        </div>

        {result && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-green)',
            borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <div style={{ padding: '1.4rem 1.8rem', borderBottom: '1px solid var(--border-green)',
              background: 'var(--green-faint)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem',
                fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.2rem' }}>{result.dlsa_name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Secretary: {result.secretary}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0 }}>
              {[
                { icon: '📍', label: 'Address', value: result.address },
                { icon: '🕐', label: 'Office Hours', value: result.timings },
                { icon: '📞', label: 'Direct Phone', value: result.phone },
                { icon: '📧', label: 'Email', value: result.email },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1rem 1.8rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  borderRight: i % 2 === 0 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '0.3rem' }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-green)', lineHeight: 1.5 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.2rem 1.8rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.67rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'var(--text-faint)', marginBottom: '0.8rem' }}>Services Available</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.services.map((s, i) => (
                  <span key={i} style={{ fontSize: '0.78rem', padding: '4px 12px',
                    background: 'var(--green-faint)', border: '1px solid var(--border-green)',
                    borderRadius: 20, color: 'var(--text-secondary)' }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: '1rem 1.8rem', background: 'var(--green-faint)',
              borderTop: '1px solid var(--border-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                National Toll-Free Legal Aid Helpline
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: '1.5rem', fontWeight: 700, color: 'var(--green)' }}>15100</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', padding: '1.2rem 1.8rem',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-green)',
            marginBottom: '0.8rem' }}>Who is eligible for free legal aid?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              'Annual income below ₹1 lakh (₹2 lakh in some states)',
              'SC/ST community members',
              'Women and children in any case',
              'Victims of trafficking or natural disaster',
              'Persons with disabilities',
              'Industrial workmen',
              'Persons in custody (undertrials)',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
                fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--green)', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}