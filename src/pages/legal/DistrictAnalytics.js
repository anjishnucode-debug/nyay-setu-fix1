import { useMemo } from 'react';
import Navbar from '../../components/Navbar';
import PageWrapper from '../../components/PageWrapper';
import { undertrials, getDaysInCustody, getAlertStatus } from '../../data/undertrials';

export default function DistrictAnalytics() {
  // Aggregate all live undertrials dynamically by district
  const analyticsData = useMemo(() => {
    const districts = {};

    // Grouping calculations
    undertrials.forEach(u => {
      const distName = u.district || 'Other';
      if (!districts[distName]) {
        districts[distName] = {
          name: distName,
          total: 0,
          red: 0,
          yellow: 0,
          green: 0,
          totalDays: 0,
        };
      }

      const days = getDaysInCustody(u.arrest_date);
      const status = getAlertStatus(days);

      districts[distName].total += 1;
      districts[distName][status] += 1;
      districts[distName].totalDays += days;
    });

    // Formatting output into an array sorted by total number of undertrials
    return Object.values(districts).map(d => ({
      ...d,
      avgDays: Math.round(d.totalDays / d.total),
      complianceRate: Math.round((d.green / d.total) * 100),
    })).sort((a, b) => b.total - a.total);
  }, []);

  // Sum total numbers across the state
  const stateTotals = useMemo(() => {
    let total = 0, red = 0, yellow = 0, green = 0, totalDays = 0;
    analyticsData.forEach(d => {
      total += d.total;
      red += d.red;
      yellow += d.yellow;
      green += d.green;
      totalDays += d.totalDays;
    });
    return {
      total,
      red,
      yellow,
      green,
      avgDays: Math.round(totalDays / total),
      complianceRate: Math.round((green / total) * 100),
    };
  }, [analyticsData]);

  return (
    <PageWrapper style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
            color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>Compliance & Metrics</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem',
            fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            District Analytics Dashboard
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            State compliance analysis for undertrial detentions across all administrative districts of Karnataka.
          </p>
        </div>

        {/* State Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total State Undertrials', value: stateTotals.total, color: 'var(--gold)', sub: '9 districts registered' },
            { label: 'Overdue (Red Alert)', value: stateTotals.red, color: '#e24b4a', sub: 'Exceeding statutory limits' },
            { label: 'Avg Custody Period', value: `${stateTotals.avgDays} days`, color: '#ef9f27', sub: 'Calculated state-wide avg' },
            { label: 'State Compliance Rate', value: `${stateTotals.complianceRate}%`, color: 'var(--green)', sub: 'Undertrials within legal limits' },
          ].map((s, idx) => (
            <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '1.2rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-faint)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 600, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Dynamic State Overview Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Chart 1: State Alert Distribution */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
              Karnataka Detention Status Ratio
            </h3>
            
            {/* Visual Bar Stack representing status ratios */}
            <div style={{ height: 26, width: '100%', borderRadius: 13, overflow: 'hidden', display: 'flex', marginBottom: '1.5rem' }}>
              <div style={{ width: `${(stateTotals.red / stateTotals.total) * 100}%`, background: '#e24b4a', height: '100%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 600 }}>
                {Math.round((stateTotals.red / stateTotals.total) * 100)}% Red
              </div>
              <div style={{ width: `${(stateTotals.yellow / stateTotals.total) * 100}%`, background: '#ef9f27', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 600 }}>
                {Math.round((stateTotals.yellow / stateTotals.total) * 100)}% Yellow
              </div>
              <div style={{ width: `${(stateTotals.green / stateTotals.total) * 100}%`, background: 'var(--green)', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 600 }}>
                {Math.round((stateTotals.green / stateTotals.total) * 100)}% Green
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e24b4a' }} />
                <span>Overdue Limits (Red Alert)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef9f27' }} />
                <span>Approaching Limit (Yellow Alert)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                <span>Within Statutory Limits (Green)</span>
              </div>
            </div>
          </div>

          {/* District Ranking Summary Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '1.5rem', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Backlog Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Highest Backlog District:</span>
                <strong style={{ color: 'var(--gold)' }}>{analyticsData[0]?.name || '—'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Highest Detention Avg (Days):</span>
                <strong style={{ color: '#e24b4a' }}>
                  {analyticsData.reduce((prev, curr) => (curr.avgDays > prev.avgDays) ? curr : prev, { avgDays: 0 }).name} ({analyticsData.reduce((prev, curr) => (curr.avgDays > prev.avgDays) ? curr : prev, { avgDays: 0 }).avgDays} days)
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Highest Legal Compliance Rate:</span>
                <strong style={{ color: 'var(--green)' }}>
                  {analyticsData.reduce((prev, curr) => (curr.complianceRate > prev.complianceRate) ? curr : prev, { complianceRate: 0 }).name} ({analyticsData.reduce((prev, curr) => (curr.complianceRate > prev.complianceRate) ? curr : prev, { complianceRate: 0 }).complianceRate}%)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed District Metrics Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr', padding: '1rem 1.5rem', background: 'var(--gold-faint)', borderBottom: '1px solid var(--border-subtle)' }}>
            {['District Jurisdiction', 'Active Cases', 'Detention Status Ratio', 'Avg Custody Period', 'Compliance Rate'].map((h, i) => (
              <span key={i} style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-faint)', 
                textAlign: i === 0 ? 'left' : i === 2 ? 'left' : 'center' }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {analyticsData.map((d, idx) => (
              <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr', padding: '1rem 1.5rem', 
                borderBottom: idx !== analyticsData.length - 1 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'center' }}>
                
                {/* District Name */}
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{d.name}</strong>

                {/* Active Cases */}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{d.total}</span>

                {/* Status Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ height: 6, width: 100, borderRadius: 3, overflow: 'hidden', display: 'flex', background: 'var(--stat-bar)' }}>
                    <div style={{ width: `${(d.red / d.total) * 100}%`, background: '#e24b4a', height: '100%' }} />
                    <div style={{ width: `${(d.yellow / d.total) * 100}%`, background: '#ef9f27', height: '100%' }} />
                    <div style={{ width: `${(d.green / d.total) * 100}%`, background: 'var(--green)', height: '100%' }} />
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-faint)' }}>
                    🔴 {d.red} · 🟡 {d.yellow} · 🟢 {d.green}
                  </div>
                </div>

                {/* Average Custody Period */}
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: d.avgDays > 300 ? '#e24b4a' : 'var(--text-secondary)', textAlign: 'center' }}>
                  {d.avgDays} <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>days</span>
                </span>

                {/* Compliance Rate */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: d.complianceRate >= 60 ? 'var(--green)' : '#ef9f27' }}>
                    {d.complianceRate}%
                  </span>
                  <div style={{ width: 50, height: 3, background: 'var(--stat-bar)', borderRadius: 1.5, overflow: 'hidden', marginTop: 3 }}>
                    <div style={{ height: '100%', width: `${d.complianceRate}%`, background: d.complianceRate >= 60 ? 'var(--green)' : '#ef9f27' }} />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
