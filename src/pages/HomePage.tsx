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
      <h1>Preghiamo.eu</h1>
      <p className="lead">Raccolta personale di preghiere cattoliche</p>

      {/* Featured quick links */}
      <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
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
    </>
  )
}
