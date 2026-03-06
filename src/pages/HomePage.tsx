import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { prayerTree } from '../data/prayers'
import type { Folder } from '../types'
import { useSeo } from '../hooks/useSeo'

const PALETTES = [
  { icon: '🙏' },
  { icon: '🕊️' },
  { icon: '❤️‍🔥' },
  { icon: '🛐' },
  { icon: '✝️' },
  { icon: '☩'  },
  { icon: '♥'  },
  { icon: '🌟' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return '☀️ Buongiorno'
  if (h >= 12 && h < 18) return '☀️ Buon pomeriggio'
  if (h >= 18 && h < 22) return '🌆 Buonasera'
  return '🌙 Buona notte'
}

function HomeCard({ folder, index }: { folder: Folder; index: number }) {
  const p = PALETTES[index % PALETTES.length]
  const count = (folder.prayers?.length ?? 0) + (folder.subfolders?.length ?? 0)
  return (
    <Link
      to={`/cartella/${folder.id}`}
      className="home-card"
      style={{ animationDelay: `${.1 + index * .05}s` }}
    >
      <span className="home-card-icon">{p.icon}</span>
      <span className="home-card-title">{folder.title}</span>
      <span className="home-card-count">{count} {count === 1 ? 'elemento' : 'elementi'}</span>
    </Link>
  )
}

export function HomePage() {
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Categorie di preghiere cattoliche',
    description: 'Raccolta di preghiere cattoliche organizzate per categoria su Spada dello Spirito.',
    url: 'https://spadadellospirito.org/',
    itemListElement: prayerTree.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.title,
      url: `https://spadadellospirito.org/cartella/${f.id}`,
    })),
  }), [])

  useSeo({
    title: 'Preghiere Cattoliche',
    description: 'Raccolta di preghiere cattoliche: rosario giornaliero, vangelo del giorno, preghiere tradizionali e ai santi. Prega con la Tradizione della Chiesa.',
    canonical: 'https://spadadellospirito.org/',
    jsonLd,
  })

  return (
    <>
      {/* ── Hero banner ── */}
      <div className="hero">
        <span className="hero-eyebrow">{getGreeting()}</span>
        <h1 className="hero-heading">
          La fede è fondamento<br />
          di ciò che si spera,<br />
          <span className="accent-word">prova di ciò che non si vede.</span>
        </h1>
        <p className="hero-sub"></p>
        <div className="hero-btns">
          <Link to="/rosario" className="btn btn-primary">📿 Inizia a pregare →</Link>
          <Link to="/vangelo" className="btn btn-light">📖 Vangelo del giorno</Link>
          <Link to="/bibbia" className="btn btn-light">✠ Cerca nella Bibbia</Link>
        </div>
      </div>

      {/* ── Categoria preghiere ── */}
      <p className="section-label">Preghiere</p>
      <div className="home-grid">
        {prayerTree.map((folder, i) => (
          <HomeCard key={folder.id} folder={folder} index={i} />
        ))}
        <Link
          to="https://www.vaticannews.va/it/santo-del-giorno.html"
          target="_blank"
          rel="noopener noreferrer"
          className="home-card"
          style={{ animationDelay: `${.1 + prayerTree.length * .05}s` }}
        >
          <span className="home-card-icon">☀️</span>
          <span className="home-card-title">Santo del giorno</span>
          <span className="home-card-count">Vatican News ↗</span>
        </Link>
      </div>

      {/* ── Scrittura ── */}
      <blockquote style={{
        marginTop: '1rem',
        padding: '1.3rem 1.6rem',
        background: 'rgba(255,255,255,.6)',
        borderRadius: '0 18px 18px 0',
        fontStyle: 'italic',
        lineHeight: 1.92,
        fontSize: '.9em',
        border: '1.5px solid rgba(255,255,255,.82)',
        borderLeft: '4px solid var(--accent)',
        boxShadow: '0 4px 20px rgba(123,108,246,.09)',
        backdropFilter: 'blur(10px)',
      }}>
        <sup style={{ fontStyle:'normal', fontSize:'.65em', color:'var(--purple)', fontFamily:'var(--font-body)', fontWeight:800, verticalAlign:'super', marginRight:'.1em' }}>14</sup>State dunque saldi: prendete la verità per cintura dei vostri fianchi; rivestitevi della corazza della giustizia;{' '}
        <sup style={{ fontStyle:'normal', fontSize:'.65em', color:'var(--purple)', fontFamily:'var(--font-body)', fontWeight:800, verticalAlign:'super', marginRight:'.1em' }}>15</sup>mettete come calzature ai vostri piedi lo zelo dato dal vangelo della pace;{' '}
        <sup style={{ fontStyle:'normal', fontSize:'.65em', color:'var(--purple)', fontFamily:'var(--font-body)', fontWeight:800, verticalAlign:'super', marginRight:'.1em' }}>16</sup>prendete oltre a tutto ciò lo scudo della fede, con il quale potrete spegnere tutti i dardi infuocati del maligno.{' '}
        <sup style={{ fontStyle:'normal', fontSize:'.65em', color:'var(--purple)', fontFamily:'var(--font-body)', fontWeight:800, verticalAlign:'super', marginRight:'.1em' }}>17</sup>Prendete anche l'elmo della salvezza e <em>la spada dello Spirito, che è la parola di Dio</em>;{' '}
        <sup style={{ fontStyle:'normal', fontSize:'.65em', color:'var(--purple)', fontFamily:'var(--font-body)', fontWeight:800, verticalAlign:'super', marginRight:'.1em' }}>18</sup>pregate in ogni tempo, per mezzo dello Spirito, con ogni preghiera e supplica; vegliate a questo scopo con ogni perseveranza.
        <footer style={{ marginTop:'.7rem', fontStyle:'normal', fontSize:'.8em', color:'var(--purple)', letterSpacing:'.03em', fontWeight: 700 }}>
          — Efesini 6,14–18
        </footer>
      </blockquote>
    </>
  )
}
