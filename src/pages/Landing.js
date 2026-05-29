import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';

const stats = [
  { num: '5.02Cr', label: 'Pending Cases' },
  { num: '75%', label: 'Are Undertrials' },
  { num: '1L+', label: 'Missing Yearly' },
  { num: '1.6Cr', label: 'Without Legal Aid' },
];

const citizenFeatures = [
  'Search by prisoner ID or name',
  'Know your legal rights in Hindi',
  'Find free legal aid near you',
  'SMS alerts for hearing dates',
];

const legalFeatures = [
  'Nyay Mitra — AI case summarizer',
  'Undertrial overdue alert dashboard',
  'One-click bail application generator',
  'Indian Kanoon precedent finder',
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Navbar />

      {/* Stats bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', padding: '1rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem',
                fontWeight: 600, color: 'var(--gold)' }}>{s.num}</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '1.5px',
                textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
            {i < stats.length - 1 && (
              <div style={{ width: 1, height: 30, background: 'var(--border-subtle)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>

        <div style={{ fontSize: '0.72rem', letterSpacing: 3, textTransform: 'uppercase',
          color: 'var(--gold-dim)', marginBottom: '1.2rem',
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-block', width: 40, height: 1,
            background: 'var(--border-gold)' }} />
          AI-Powered Justice Platform · India
          <span style={{ display: 'inline-block', width: 40, height: 1,
            background: 'var(--border-gold)' }} />
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.8rem',
          fontWeight: 700, textAlign: 'center', lineHeight: 1.1, marginBottom: '0.8rem',
          color: 'var(--text-primary)' }}>
          Where <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Justice</span> meets
          <br />Intelligence
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', textAlign: 'center',
          maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem', fontWeight: 300 }}>
          A unified platform connecting citizens, lawyers and judges — powered by AI
          to make the Indian judicial system transparent, fast, and accessible.
        </p>

        {/* Portal Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem', width: '100%', maxWidth: 820, marginBottom: '2rem' }}>

          <PortalCard
            onClick={() => navigate('/citizen')}
            accentColor="var(--green)"
            accentFaint="var(--green-faint)"
            accentBorder="var(--border-green)"
            accentBorderHover="var(--border-green-hover)"
            icon="🏛️"
            badge="Citizen Portal"
            tag="No login needed"
            title="For Common People"
            desc="Find case status, track your family member in custody, know your rights — in plain language."
            features={citizenFeatures}
            cta="Enter Citizen Portal →"
          />

          <PortalCard
            onClick={() => navigate('/legal')}
            accentColor="var(--gold)"
            accentFaint="var(--gold-faint)"
            accentBorder="var(--border-gold)"
            accentBorderHover="var(--border-gold-hover)"
            icon="⚖️"
            badge="Legal Professional Portal"
            tag="Professional login"
            title="For Lawyers & Judges"
            desc="AI-powered tools to summarize cases, find precedents, track overdue undertrials and generate bail documents."
            features={legalFeatures}
            cta="Enter Legal Portal →"
          />
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)',
          display: 'flex', alignItems: 'center', gap: 6 }}>
          {['Built for India', 'Free to use', 'Powered by Groq AI', 'Data from NCRB · NJDG']
            .map((t, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ width: 3, height: 3, borderRadius: '50%',
                background: 'var(--text-faint)', display: 'inline-block' }} />}
              {t}
            </span>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function PortalCard({ onClick, accentColor, accentFaint, accentBorder, accentBorderHover,
  icon, badge, tag, title, desc, features, cta }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? accentBorderHover : accentBorder}`,
        borderRadius: 16, padding: '2.2rem 2rem', cursor: 'pointer',
        transition: 'all 0.3s ease', position: 'relative',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow)' : 'none',
      }}>
      <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem',
        fontSize: '0.65rem', padding: '3px 8px', borderRadius: 20,
        background: accentFaint, color: accentColor,
        border: `1px solid ${accentBorder}` }}>{tag}</div>
      <div style={{ width: 52, height: 52, borderRadius: 12, background: accentFaint,
        border: `1px solid ${accentBorder}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.2rem' }}>{icon}</div>
      <div style={{ fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase',
        color: accentColor, marginBottom: '0.6rem', fontWeight: 500 }}>{badge}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.7rem',
        fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)',
        lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 300 }}>{desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%',
              background: accentColor, flexShrink: 0 }} />
            {f}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem',
        fontWeight: 500, padding: '0.7rem 1.2rem', borderRadius: 8,
        background: accentFaint, color: accentColor,
        border: `1px solid ${accentBorder}`, width: 'fit-content' }}>{cta}</div>
    </div>
  );
}