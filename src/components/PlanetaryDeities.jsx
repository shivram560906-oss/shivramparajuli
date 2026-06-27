import React, { useState } from 'react';

const PLANETS = [
  {
    name: 'सूर्य',
    nameEn: 'Sun',
    symbol: '☉',
    deity: 'शिव / सूर्य नारायण',
    gemstone: 'माणिक (Ruby)',
    color: 'रातो',
    colorHex: '#e84118',
    day: 'आइतबार',
    metal: 'सुन',
    grain: 'गहुँ',
    direction: 'पूर्व',
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
  },
  {
    name: 'चन्द्र',
    nameEn: 'Moon',
    symbol: '☽',
    deity: 'पार्वती / दुर्गा',
    gemstone: 'मोती (Pearl)',
    color: 'सेतो',
    colorHex: '#f5f6fa',
    day: 'सोमबार',
    metal: 'चाँदी',
    grain: 'चामल',
    direction: 'वायव्य',
    mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः',
  },
  {
    name: 'मङ्गल',
    nameEn: 'Mars',
    symbol: '♂',
    deity: 'हनुमान / कार्तिकेय',
    gemstone: 'मूंगा (Coral)',
    color: 'रातो',
    colorHex: '#c0392b',
    day: 'मङ्गलबार',
    metal: 'ताम्र',
    grain: 'मसुरो',
    direction: 'दक्षिण',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
  },
  {
    name: 'बुध',
    nameEn: 'Mercury',
    symbol: '☿',
    deity: 'विष्णु',
    gemstone: 'पन्ना (Emerald)',
    color: 'हरियो',
    colorHex: '#27ae60',
    day: 'बुधबार',
    metal: 'पित्तल',
    grain: 'मुङ्ग',
    direction: 'उत्तर',
    mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
  },
  {
    name: 'गुरु',
    nameEn: 'Jupiter',
    symbol: '♃',
    deity: 'बृहस्पति / दक्षिणामूर्ति',
    gemstone: 'पुखराज (Yellow Sapphire)',
    color: 'पहेँलो',
    colorHex: '#f1c40f',
    day: 'बिहीबार',
    metal: 'सुन',
    grain: 'चना',
    direction: 'ईशान',
    mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
  },
  {
    name: 'शुक्र',
    nameEn: 'Venus',
    symbol: '♀',
    deity: 'लक्ष्मी / इन्द्राणी',
    gemstone: 'हीरा (Diamond)',
    color: 'सेतो',
    colorHex: '#dcdde1',
    day: 'शुक्रबार',
    metal: 'चाँदी',
    grain: 'सिमी',
    direction: 'आग्नेय',
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
  },
  {
    name: 'शनि',
    nameEn: 'Saturn',
    symbol: '♄',
    deity: 'यम / ब्रह्मा',
    gemstone: 'नीलम (Blue Sapphire)',
    color: 'कालो / नीलो',
    colorHex: '#2c3e50',
    day: 'शनिबार',
    metal: 'फलाम',
    grain: 'तिल',
    direction: 'पश्चिम',
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
  },
  {
    name: 'राहु',
    nameEn: 'Rahu',
    symbol: '☊',
    deity: 'दुर्गा / सर्पदेव',
    gemstone: 'गोमेद (Hessonite)',
    color: 'नीलो / धुम्रो',
    colorHex: '#6c5ce7',
    day: 'शनिबार',
    metal: 'सीसा',
    grain: 'माष',
    direction: 'नैऋत्य',
    mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
  },
  {
    name: 'केतु',
    nameEn: 'Ketu',
    symbol: '☋',
    deity: 'गणेश / चित्रगुप्त',
    gemstone: 'लहसुनिया (Cat\'s Eye)',
    color: 'धुम्रो / खैरो',
    colorHex: '#7f8c8d',
    day: 'मङ्गलबार',
    metal: 'पञ्चधातु',
    grain: 'कुल्थी',
    direction: 'नैऋत्य',
    mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
  },
];

const styles = {
  wrapper: {
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: '1.85rem',
    color: '#d4af37',
    marginBottom: '0.5rem',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.95rem',
    color: '#a1a1aa',
    fontWeight: 400,
  },
  divider: {
    width: '80px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
    margin: '1rem auto 0',
    border: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  card: {
    background: 'rgba(25, 22, 50, 0.45)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    borderRadius: '16px',
    padding: '1.5rem',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  cardHover: {
    border: '1px solid rgba(212, 175, 55, 0.4)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(212, 175, 55, 0.1)',
  },
  cardTopBar: (colorHex) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, transparent, ${colorHex}, transparent)`,
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '1.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
  },
  symbolCircle: (colorHex) => ({
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colorHex}22, ${colorHex}44)`,
    border: `2px solid ${colorHex}66`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    color: colorHex,
    flexShrink: 0,
    fontWeight: 700,
  }),
  planetName: {
    fontFamily: "'Cinzel', serif",
    fontSize: '1.2rem',
    color: '#f3f4f6',
    margin: 0,
    lineHeight: 1.2,
  },
  planetNameEn: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.75rem',
    color: '#71717a',
    marginTop: '2px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem 1rem',
    marginBottom: '1rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  detailLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.68rem',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  detailValue: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.88rem',
    color: '#f3f4f6',
    fontWeight: 500,
  },
  mantraBox: {
    background: 'rgba(212, 175, 55, 0.06)',
    border: '1px solid rgba(212, 175, 55, 0.12)',
    borderRadius: '10px',
    padding: '0.75rem 0.85rem',
    marginTop: '0.5rem',
  },
  mantraLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.65rem',
    color: '#d4af37',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  mantraText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.82rem',
    color: '#d4af37',
    lineHeight: 1.5,
    fontWeight: 500,
    wordBreak: 'break-word',
  },
  colorDot: (colorHex) => ({
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: colorHex,
    marginRight: '6px',
    verticalAlign: 'middle',
    border: '1px solid rgba(255,255,255,0.2)',
  }),
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.8rem',
    color: '#71717a',
  },
};

function PlanetCard({ planet }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardTopBar(planet.colorHex)} />

      <div style={styles.cardHeader}>
        <div style={styles.symbolCircle(planet.colorHex)}>
          {planet.symbol}
        </div>
        <div>
          <h3 style={styles.planetName}>{planet.name}</h3>
          <div style={styles.planetNameEn}>{planet.nameEn}</div>
        </div>
      </div>

      <div style={styles.detailsGrid}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>देवता</span>
          <span style={styles.detailValue}>{planet.deity}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>रत्न</span>
          <span style={styles.detailValue}>{planet.gemstone}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>रङ्ग</span>
          <span style={styles.detailValue}>
            <span style={styles.colorDot(planet.colorHex)} />
            {planet.color}
          </span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>वार</span>
          <span style={styles.detailValue}>{planet.day}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>धातु</span>
          <span style={styles.detailValue}>{planet.metal}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>अन्न</span>
          <span style={styles.detailValue}>{planet.grain}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>दिशा</span>
          <span style={styles.detailValue}>{planet.direction}</span>
        </div>
      </div>

      <div style={styles.mantraBox}>
        <div style={styles.mantraLabel}>मन्त्र</div>
        <div style={styles.mantraText}>{planet.mantra}</div>
      </div>
    </div>
  );
}

export default function PlanetaryDeities({ language }) {
  return (
    <div className="glass-panel" style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>ग्रह देवता र उपाय विवरण</h2>
        <p style={styles.subtitle}>
          नवग्रहका देवता, रत्न, मन्त्र तथा उपाय सम्बन्धी सम्पूर्ण जानकारी
        </p>
        <hr style={styles.divider} />
      </div>

      <div style={styles.grid}>
        {PLANETS.map((planet) => (
          <PlanetCard key={planet.nameEn} planet={planet} />
        ))}
      </div>

      <div style={styles.footer}>
        नवग्रह शान्ति र उपायका लागि योग्य ज्योतिषीसँग परामर्श गर्नुहोस्
      </div>
    </div>
  );
}
