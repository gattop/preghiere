// src/data/folders.ts
// Metadata for every folder in the prayer tree.
// Key = folder id (must match the `folder:` frontmatter in .md files).
// To add a new folder: add an entry here, then create .md prayer files with that folder id.

export interface FolderMeta {
  title: string
  icon?: string
  description?: string
  order?: number
}

export const FOLDERS: Record<string, FolderMeta> = {
  // ─── Top-level ────────────────────────────────────────────────
  'preghiere-quotidiane':   { title: 'Preghiere quotidiane',   icon: '🌅', order: 1 },
  'spirito-santo':          { title: 'Spirito Santo',           icon: '🕊️', order: 2 },
  'sacro-cuore':            { title: 'Sacro Cuore di Gesù',    icon: '❤️',  order: 3 },
  'santi':                  { title: 'Santi',                   icon: '✨', order: 4 },
  'credo':                  { title: 'Credo',                   icon: '🙏', order: 5 },
  'giubileo-2025':          { title: 'Giubileo 2025',           icon: '⛪', order: 6 },

  // ─── Santi subfolders ─────────────────────────────────────────
  'santi/san-michele-arcangelo': { title: 'San Michele Arcangelo',  order: 1 },
  'santi/san-tommaso-apostolo':  { title: 'San Tommaso Apostolo',   order: 2 },
  'santi/sant-emidio':           { title: "Sant'Emidio",            order: 3,
    description: 'Vescovo e martire, protettore contro il terremoto. Festa il 5 agosto.' },
  'santi/sant-emidio/triduo-sant-emidio': { title: "Triduo a Sant'Emidio",
    description: 'di Fratel Cosimo. In preparazione alla festa del 5 agosto.', order: 1 },
  'santi/san-giuda-taddeo':      { title: 'San Giuda Taddeo',       order: 4 },
  'santi/san-francesco-assisi':  { title: "San Francesco d'Assisi", order: 5 },
  'santi/ss-cosma-damiano':      { title: 'Santi Cosma e Damiano',  order: 6 },
  'santi/beata-eustochio-bellini': { title: 'Beata Eustochio Bellini', order: 7 },
}

/** Top-level folder ids shown on the home page, in order */
export const TOP_LEVEL_FOLDERS = [
  'preghiere-quotidiane',
  'spirito-santo',
  'sacro-cuore',
  'santi',
  'credo',
  'giubileo-2025',
]
