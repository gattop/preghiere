import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { findFolder } from '../data/prayers'
import { BackButton } from '../components/BackButton'
import { useSeo } from '../hooks/useSeo'
import type { Folder, Prayer } from '../types'

const BASE_URL = 'https://spadadellospirito.org'

function PrayerItem({ prayer }: { prayer: Prayer }) {
  return (
    <Link to={`/preghiera/${prayer.id}`} style={{ textDecoration: 'none' }}>
      <div className="list-item">
        <span className="list-item-title">{prayer.title}</span>
        <span className="list-item-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </span>
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
        <span className="list-item-title">{folder.title}</span>
        <span className="list-item-icon">
          <span className="folder-badge">{count}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
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

  // Build parent path for sub-folder links
  const currentPath = `/cartella/${params['*'] ?? folderId}`

  const description = useMemo(
    () => folder?.description ?? `Preghiere nella categoria "${folder?.title ?? 'cartella'}" su Spada dello Spirito.`,
    [folder],
  )

  const jsonLd = useMemo(() => folder ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: folder.title,
        description,
        url: `${BASE_URL}${currentPath}`,
        inLanguage: 'it',
        isPartOf: { '@type': 'WebSite', '@id': `${BASE_URL}/#website`, name: 'Spada dello Spirito', url: BASE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: folder.title, item: `${BASE_URL}${currentPath}` },
        ],
      },
    ],
  } : null, [folder, description, currentPath])

  useSeo({
    title: folder ? `${folder.title} — Preghiere` : 'Cartella',
    description,
    canonical: folder ? `${BASE_URL}${currentPath}` : undefined,
    jsonLd,
  })

  if (!folder) {
    return (
      <div>
        <BackButton />
        <p className="empty">Cartella non trovata.</p>
      </div>
    )
  }

  // Build parent path for sub-folder links
  const currentPathForLinks = `/cartella/${params['*'] ?? folderId}`

  return (
    <>
      <BackButton />
      <h1>{folder.title}</h1>
      {folder.description && <p className="prayer-description">{folder.description}</p>}

      {(folder.subfolders ?? []).map(sub => (
        <SubfolderItem key={sub.id} folder={sub} parentPath={currentPathForLinks} />
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
