import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';



const sidebarSections = [
  { section: 'Overview', items: [{ icon: '📊', label: 'Dashboard', route: '/legal', active: true }] },
  { section: 'AI Tools', items: [
    { icon: '🤖', label: 'Nyay Mitra', route: '/legal/nyay-mitra' },
    { icon: '🔍', label: 'Precedent Finder', route: '/legal/precedents' },
    { icon: '📄', label: 'Bail Generator', route: '/legal/bail' },
  ]},
  { section: 'Case Management', items: [
    { icon: '📝', label: 'Register Prisoner', route: '/legal/register-prisoner' },
    { icon: '⚠️', label: 'Overdue Alerts', route: '/legal/alerts', badge: '8' },
    { icon: '📅', label: 'Hearing Schedule', route: '/legal/schedule' },
  ]},
  { section: 'Reports', items: [
    { icon: '📈', label: 'District Analytics', route: '/legal/analytics' },
    { icon: '⚖️', label: 'Bail Risk Report', route: '/legal/bail-risk' },
  ]},
];

const statsData = [
  { num: '2,847', label: 'Active Undertrials', change: '↑ 23 this week', changeColor: '#e24b4a', numColor: 'var(--gold)' },
  { num: '312', label: 'Overdue (Red Alert)', change: 'Exceeding legal limit', changeColor: '#e24b4a', numColor: '#e24b4a' },
  { num: '48', label: 'Cases This Week', change: '↓ 3 resolved', changeColor: '#1d9e75', numColor: '#1d9e75' },
  { num: '1.2s', label: 'Avg AI Response', change: 'Nyay Mitra 99% uptime', changeColor: '#1d9e75', numColor: 'var(--gold)' },
];

const tools = [
  { icon: '🤖', title: 'Nyay Mitra — Case AI', alert: false, route: '/legal/nyay-mitra',
    desc: 'Upload any case PDF. AI summarizes key facts, charges, IPC sections, and case history in under 60 seconds.',
    cta: 'Open AI Summarizer →' },
  { icon: '⚠️', title: 'Undertrial Overdue Alerts', alert: true, route: '/legal/alerts',
    desc: '312 prisoners have exceeded their legal detention limit in Karnataka. View the red-flagged list.',
    cta: 'View 312 Alerts →' },
  { icon: '📚', title: 'Precedent Finder', alert: false, route: '/legal/precedents',
    desc: 'Search landmark Supreme Court judgments by IPC section or keywords. Get citations instantly.',
    cta: 'Search Precedents →' },
  { icon: '📄', title: 'Bail Application Generator', alert: false, route: '/legal/bail',
    desc: 'Select any undertrial prisoner. AI generates a complete, court-ready bail application in 30 seconds.',
    cta: 'Generate Application →' },
];

export default function LegalHome() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Navbar theme="legal" showBack={true} />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          padding: '1.5rem 1rem', display: 'flex',
          flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
          {sidebarSections.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: '0.6rem', letterSpacing: 2, textTransform: 'uppercase',
                color: 'var(--text-faint)', padding: '0.8rem 0.6rem 0.3rem',
                marginTop: si > 0 ? '0.5rem' : 0 }}>{section.section}</div>
              {section.items.map((item, ii) => (
                <div key={ii} onClick={() => navigate(item.route)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.6rem 0.8rem', borderRadius: 8, cursor: 'pointer',
                    fontSize: '0.82rem', transition: 'all 0.2s',
                    color: item.active ? 'var(--gold)' : 'var(--text-muted)',
                    background: item.active ? 'var(--gold-faint)' : 'transparent',
                    borderLeft: item.active ? '2px solid var(--gold)' : '2px solid transparent' }}
                  onMouseEnter={e => !item.active && (e.currentTarget.style.background = 'var(--gold-faint)')}
                  onMouseLeave={e => !item.active && (e.currentTarget.style.background = 'transparent')}>
                  <span>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '0.6rem', padding: '2px 6px',
                      background: 'rgba(226,75,74,0.15)', color: '#f09595',
                      borderRadius: 10, border: '1px solid rgba(226,75,74,0.2)' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: 2, textTransform: 'uppercase',
              color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>Good morning, Advocate</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem',
              fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Legal Dashboard</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 300 }}>
              Karnataka District Courts · Updated just now
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '1rem', marginBottom: '1.5rem' }}>
            {statsData.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-card)',
                border: '1px solid var(--border-gold)', borderRadius: 10, padding: '1rem',
                boxShadow: 'var(--shadow)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: '1.8rem', fontWeight: 600, color: s.numColor, marginBottom: '0.2rem' }}>{s.num}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                <div style={{ fontSize: '0.7rem', color: s.changeColor, marginTop: '0.3rem' }}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Tool Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {tools.map((t, i) => (
              <div key={i} onClick={() => navigate(t.route)}
                style={{ background: 'var(--bg-card)',
                  border: `1px solid ${t.alert ? 'rgba(226,75,74,0.2)' : 'var(--border-gold)'}`,
                  borderRadius: 12, padding: '1.4rem', cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: 'var(--shadow)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = t.alert ? 'rgba(226,75,74,0.4)' : 'var(--border-gold-hover)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = t.alert ? 'rgba(226,75,74,0.2)' : 'var(--border-gold)';
                  e.currentTarget.style.transform = 'none';
                }}>
                <div style={{ width: 40, height: 40, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', marginBottom: '0.9rem',
                  background: t.alert ? 'rgba(226,75,74,0.08)' : 'var(--gold-faint)',
                  border: `1px solid ${t.alert ? 'rgba(226,75,74,0.2)' : 'var(--border-gold)'}` }}>
                  {t.icon}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 500,
                  color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{t.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)',
                  lineHeight: 1.5, marginBottom: '0.9rem' }}>{t.desc}</div>
                <div style={{ fontSize: '0.75rem',
                  color: t.alert ? 'rgba(226,75,74,0.7)' : 'var(--gold-dim)' }}>{t.cta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}