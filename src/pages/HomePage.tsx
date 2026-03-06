import { Link } from 'react-router-dom'
import { prayerTree } from '../data/prayers'
import type { Folder } from '../types'

function FolderItem({ folder, prefix = '' }: { folder: Folder; prefix?: string }) {
  const path = `${prefix}/${folder.id}`
  const count = (folder.prayers?.length ?? 0) + (folder.subfolders?.length ?? 0)
  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <div className="list-item">
        <span className="list-item-title">{folder.title}</span>
        <span className="list-item-icon">
          <span className="folder-badge">{count}</span> ›
        </span>
      </div>
    </Link>
  )
}

export function HomePage() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-hero)', letterSpacing: '.04em', fontWeight: 700 }}>Spada dello Spirito</h1>
      <p className="lead">Raccolta personale di preghiere cattoliche</p>

      {/* Featured quick links */}
      <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
        <Link to="/rosario" className="btn btn-primary">📿 Santo Rosario</Link>
        <Link to="/vangelo" className="btn btn-ghost">📖 Vangelo del giorno</Link>
      </div>

      {prayerTree.map(folder => (
        <FolderItem key={folder.id} folder={folder} prefix="/cartella" />
      ))}

      <div className="list-item" style={{ opacity: .7 }}>
        <a
          href="https://www.vaticannews.va/it/santo-del-giorno.html"
          target="_blank"
          rel="noopener noreferrer"
          className="list-item-title"
        >
          Santo del giorno
        </a>
        <span className="list-item-icon">↗</span>
      </div>

      {/* Citazione biblica */}
      <blockquote style={{
        margin: '2.5rem 0 0',
        padding: '1.1rem 1.3rem',
        background: 'var(--accent-dim)',
        borderLeft: '2px solid var(--border-strong)',
        borderRadius: 'var(--radius)',
        fontStyle: 'italic',
        lineHeight: 1.8,
        fontSize: '.88em',
        color: 'var(--text)',
      }}>
        <sup style={{ fontStyle: 'normal', fontSize: '.7em', color: 'var(--accent)', fontFamily: 'var(--font-ui)', verticalAlign: 'super', marginRight: '.15em' }}>14</sup>State dunque saldi: prendete la verità per cintura dei vostri fianchi; rivestitevi della corazza della giustizia;{' '}
        <sup style={{ fontStyle: 'normal', fontSize: '.7em', color: 'var(--accent)', fontFamily: 'var(--font-ui)', verticalAlign: 'super', marginRight: '.15em' }}>15</sup>mettete come calzature ai vostri piedi lo zelo dato dal vangelo della pace;{' '}
        <sup style={{ fontStyle: 'normal', fontSize: '.7em', color: 'var(--accent)', fontFamily: 'var(--font-ui)', verticalAlign: 'super', marginRight: '.15em' }}>16</sup>prendete oltre a tutto ciò lo scudo della fede, con il quale potrete spegnere tutti i dardi infuocati del maligno.{' '}
        <sup style={{ fontStyle: 'normal', fontSize: '.7em', color: 'var(--accent)', fontFamily: 'var(--font-ui)', verticalAlign: 'super', marginRight: '.15em' }}>17</sup>Prendete anche l'elmo della salvezza e <em>la spada dello Spirito, che è la parola di Dio</em>;{' '}
        <sup style={{ fontStyle: 'normal', fontSize: '.7em', color: 'var(--accent)', fontFamily: 'var(--font-ui)', verticalAlign: 'super', marginRight: '.15em' }}>18</sup>pregate in ogni tempo, per mezzo dello Spirito, con ogni preghiera e supplica; vegliate a questo scopo con ogni perseveranza.
        <footer style={{ marginTop: '.6rem', fontStyle: 'normal', fontSize: '.82em', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
          — Efesini 6,14–18
        </footer>
      </blockquote>
    </>
  )
}
