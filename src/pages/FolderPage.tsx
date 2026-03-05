import { Link, useParams } from 'react-router-dom'
import { findFolder } from '../data/prayers'
import { BackButton } from '../components/BackButton'
import type { Folder, Prayer } from '../types'

function PrayerItem({ prayer }: { prayer: Prayer }) {
  return (
    <Link to={`/preghiera/${prayer.id}`} style={{ textDecoration: 'none' }}>
      <div className="list-item">
        <span className="list-item-title">{prayer.title}</span>
        <span className="list-item-icon">›</span>
      </div>
    </Link>
  )
}

function SubfolderItem({ folder, parentPath }: { folder: Folder; parentPath: string }) {
  const path = `${parentPath}/${folder.id}`
  const count = (folder.prayers?.length ?? 0) + (folder.subfolders?.length ?? 0)
  return (
    <Link to={path} style={{ textDecoration: 'none' }}>
      <div className="list-item">
        <span className="list-item-title">📁 {folder.title}</span>
        <span className="list-item-icon">
          <span className="folder-badge">{count}</span> ›
        </span>
      </div>
    </Link>
  )
}

export function FolderPage() {
  const params = useParams()

  // The route captures everything after /cartella/ as nested segments
  const folderId = params['*']?.split('/').at(-1) ?? params.id ?? ''
  const folder = findFolder(folderId)

  if (!folder) {
    return (
      <div>
        <BackButton />
        <p className="empty">Cartella non trovata.</p>
      </div>
    )
  }

  // Build parent path for sub-folder links
  const currentPath = `/cartella/${params['*'] ?? folderId}`

  return (
    <>
      <BackButton />
      <h2>{folder.title}</h2>
      {folder.description && <p className="prayer-description">{folder.description}</p>}

      {(folder.subfolders ?? []).map(sub => (
        <SubfolderItem key={sub.id} folder={sub} parentPath={currentPath} />
      ))}

      {(folder.prayers ?? []).map(prayer => (
        <PrayerItem key={prayer.id} prayer={prayer} />
      ))}

      {!(folder.subfolders?.length) && !(folder.prayers?.length) && (
        <p className="empty">Nessuna preghiera in questa cartella.</p>
      )}
    </>
  )
}
