import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { undertrials, getDaysInCustody, getBailScore } from '../../data/undertrials';

export default function BailRiskReport() {
  const navigate = useNavigate();
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  // Compute scoring breakdown and tier for all active undertrials
  const scoredData = useMemo(() => {
    return undertrials.map(u => {
      const days = getDaysInCustody(u.arrest_date);
      const score = getBailScore(u);
      
      let tier = 'low'; // low risk means highly recommended for bail
      if (score < 40) tier = 'high';
      else if (score < 60) tier = 'medium';

      return {
        ...u,
        days_in_custody: days,
        score,
        tier
      };
    }).sort((a, b) => b.score - a.score); // Highest scores first
  }, []);

  const counts = useMemo(() => {
    return {
      total: scoredData.length,
      high: scoredData.filter(u => u.tier === 'high').length,
      medium: scoredData.filter(u => u.tier === 'medium').length,
      low: scoredData.filter(u => u.tier === 'low').length, // Low risk = High Bail Recommended
    };
  }, [scoredData]);

  const filtered = useMemo(() => {
    if (riskFilter === 'all') return scoredData;
    return scoredData.filter(u => u.tier === riskFilter);
  }, [scoredData, riskFilter]);



  return (
    <PageWrapper style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 950, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>AI Decision Support</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Bail Risk Evaluation Report
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            Risk assessment scoring for undertrial releases using legal indicators, Article 21 precedents, and flight risk indices.
          </p>
        </div>

        {/* Scoring Tiers Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Evaluated Prisoners', value: counts.total, color: 'var(--gold)', tier: 'all' },
            { label: 'Bail Recommended (Score 60+)', value: counts.low, color: 'var(--green)', tier: 'low' },
            { label: 'Conditional Release (Score 40-59)', value: counts.medium, color: '#ef9f27', tier: 'medium' },
            { label: 'High Release Risk (Score <40)', value: counts.high, color: '#e24b4a', tier: 'high' },
          ].map((c, i) => (
            <div
              key={i} onClick={() => setRiskFilter(c.tier)}
              style={{
                background: riskFilter === c.tier ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${riskFilter === c.tier ? c.color : 'var(--border-gold)'}`,
                borderRadius: 12, padding: '1rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: 'var(--shadow)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = riskFilter === c.tier ? 'var(--bg-card-hover)' : 'var(--bg-card)'}
            >
              <div style={{ fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-faint)', marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, color: c.color, lineHeight: 1 }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.2rem', alignItems: 'center' }}>
          {['all', 'low', 'medium', 'high'].map(t => {
            const labels = { all: 'All Risk Tiers', low: '🟢 Highly Recommended', medium: '🟡 Conditional Release', high: '🔴 High Risk Tier' };
            const active = riskFilter === t;
            return (
              <button
                key={t} onClick={() => setRiskFilter(t)}
                style={{
                  padding: '0.45rem 1rem', fontSize: '0.75rem', fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer', borderRadius: 8,
                  background: active ? 'var(--gold-faint)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-gold-hover)' : 'var(--border-gold)'}`,
                  color: active ? 'var(--gold)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {labels[t]}
              </button>
            );
          })}
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginLeft: 'auto' }}>
            Showing {filtered.length} of {scoredData.length} records
          </span>
        </div>

        {/* Detailed Evaluation Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr', padding: '0.9rem 1.5rem', background: 'var(--gold-faint)', borderBottom: '1px solid var(--border-subtle)' }}>
            {['Prisoner Details', 'Flight Risk Index', 'Custody Period', 'Offense Severity', 'Bail Risk Score'].map((h, i) => (
              <span key={i} style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-faint)',
                textAlign: i === 0 ? 'left' : 'center' }}>{h}</span>
            ))}
          </div>

          {/* Table Body */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((u, idx) => {
              const scoreColor = u.score >= 60 ? 'var(--green)' : u.score >= 40 ? '#ef9f27' : '#e24b4a';
              const expanded = expandedId === u.id;
              
              // Custom scoring breakdown calculation for display purposes
              const base = 50;
              const chargeFactor = u.offense_type === 'minor' ? 20 : u.offense_type === 'bailable' ? 10 : u.offense_type === 'non-bailable' ? -15 : -30;
              const custodyFactor = u.days_in_custody > 300 ? 20 : u.days_in_custody > 180 ? 15 : u.days_in_custody > 90 ? 10 : u.days_in_custody > 60 ? 5 : 0;
              const historyFactor = u.prior_record ? -20 : 0;
              const lawyerFactor = !u.has_lawyer ? 8 : 0;
              const flightFactor = u.flight_risk === 'low' ? 10 : u.flight_risk === 'high' ? -20 : 0;

              return (
                <div key={u.id} style={{ borderBottom: idx !== filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: expanded ? 'rgba(212, 163, 89, 0.02)' : 'transparent' }}>
                  
                  <div
                    onClick={() => setExpandedId(expanded ? null : u.id)}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr', padding: '1rem 1.5rem',
                      alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => !expanded && (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                    onMouseLeave={e => !expanded && (e.currentTarget.style.background = 'transparent')}
                  >
                    
                    {/* Column 1: Core Info */}
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{u.name}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: 2 }}>{u.prisoner_id} · {u.district}</div>
                    </div>

                    {/* Column 2: Flight Risk */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px', borderRadius: 12,
                        background: u.flight_risk === 'low' ? 'rgba(29,158,117,0.08)' : u.flight_risk === 'medium' ? 'rgba(239,159,39,0.08)' : 'rgba(226,75,74,0.08)',
                        color: u.flight_risk === 'low' ? 'var(--green)' : u.flight_risk === 'medium' ? '#ef9f27' : '#e24b4a',
                        border: `1px solid ${u.flight_risk === 'low' ? 'rgba(29,158,117,0.2)' : u.flight_risk === 'medium' ? 'rgba(239,159,39,0.2)' : 'rgba(226,75,74,0.2)'}`
                      }}>
                        {u.flight_risk.toUpperCase()}
                      </span>
                    </div>

                    {/* Column 3: Custody */}
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      {u.days_in_custody} days
                    </span>

                    {/* Column 4: Severity */}
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', textTransform: 'capitalize' }}>
                      {u.offense_type}
                    </span>

                    {/* Column 5: Risk Score */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 700, color: scoreColor }}>
                        {u.score}
                      </span>
                      <div style={{ width: 60, height: 4, background: 'var(--stat-bar)', borderRadius: 2, overflow: 'hidden', marginTop: 3 }}>
                        <div style={{ height: '100%', width: `${u.score}%`, background: scoreColor }} />
                      </div>
                    </div>

                  </div>

                  {/* Expand Breakdown */}
                  {expanded && (
                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid rgba(212,163,89,0.08)', fontSize: '0.8rem' }}>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', paddingTop: '1.2rem' }}>
                        
                        {/* Scoring Parameter Breakdown */}
                        <div>
                          <h4 style={{ fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                            ⚖️ Metric Scoring Breakdown
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Base Risk Value:</span>
                              <strong>+{base} pts</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Charge Type Modifier ({u.offense_type}):</span>
                              <strong style={{ color: chargeFactor >= 0 ? 'var(--green)' : '#e24b4a' }}>
                                {chargeFactor >= 0 ? `+${chargeFactor}` : chargeFactor} pts
                              </strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Custody Term Bonus ({u.days_in_custody} days):</span>
                              <strong style={{ color: 'var(--green)' }}>+{custodyFactor} pts</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Prior Offense Penalty:</span>
                              <strong style={{ color: '#e24b4a' }}>{historyFactor} pts</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Lack of Legal Counsel Incentive:</span>
                              <strong style={{ color: 'var(--green)' }}>+{lawyerFactor} pts</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Flight Risk Indices ({u.flight_risk}):</span>
                              <strong style={{ color: flightFactor >= 0 ? 'var(--green)' : '#e24b4a' }}>
                                {flightFactor >= 0 ? `+${flightFactor}` : flightFactor} pts
                              </strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, fontWeight: 600 }}>
                              <span style={{ color: 'var(--text-primary)' }}>Total Evaluated Score:</span>
                              <span style={{ color: scoreColor }}>{u.score} / 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Recommendation details */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ fontSize: '0.72rem', letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
                            📋 AI Legal Recommendation
                          </h4>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                            {u.score >= 60 ? (
                              <span>This undertrial has served a significant portion of their potential term with minor charge severity. <strong>Highly recommended for immediate bail under CrPC 436A / Article 21 personal liberty mandates.</strong></span>
                            ) : u.score >= 40 ? (
                              <span>Trial in progress. Moderate flight risk index. Recommended to present a petition requesting bail with conditional local sureties.</span>
                            ) : (
                              <span>Heinous offense metrics and/or high flight risk indicators. Case is not currently recommended for priority bail release.</span>
                            )}
                          </p>
                          
                          <button
                            onClick={() => navigate(`/legal/bail?id=${u.id}`)}
                            style={{
                              alignSelf: 'flex-start', padding: '6px 14px', background: 'var(--gold)', border: 'none',
                              borderRadius: 6, color: 'var(--bg-secondary)', fontWeight: 600, fontSize: '0.72rem',
                              fontFamily: "'Outfit', sans-serif", cursor: 'pointer'
                            }}
                          >
                            Open Bail Generator →
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
