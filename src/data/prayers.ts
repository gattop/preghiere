/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PRAYER TREE — assembles all sections into the navigable tree.       ║
 * ║                                                                      ║
 * ║  To add a new section:                                               ║
 * ║    1. Create src/data/prayers/<your-section>.ts  (or add to an       ║
 * ║       existing one — e.g. santi/<new-saint>.ts)                      ║
 * ║    2. Export a Folder from that file                                  ║
 * ║    3. Import it here and add it to prayerTree (or to a subfolders    ║
 * ║       array if it belongs inside an existing folder)                 ║
 * ║                                                                      ║
 * ║  Block helpers (see src/data/prayerBlocks.ts):                       ║
 * ║    p()    paragraph       h()    heading        it()   italic        ║
 * ║    v()    verse stanza    resp() call/response  rep()  repetition    ║
 * ║    lit()  litany table    div()  divider                             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import type { Folder } from '../types'

// ── Section imports ───────────────────────────────────────────────────────────
import { quotidiane }     from './prayers/quotidiane'
import { spiritoSanto }   from './prayers/spirito-santo'
import { sacroCuore }     from './prayers/sacro-cuore'
import { credo }          from './prayers/credo'
import { giubileo }       from './prayers/giubileo'

// Saints — one file per saint; add a new import + entry in subfolders[] below
import { sanMichele }      from './prayers/santi/san-michele'
import { sanTommaso }      from './prayers/santi/san-tommaso'
import { santEmidio }      from './prayers/santi/sant-emidio'
import { sanGiudaTaddeo }  from './prayers/santi/san-giuda-taddeo'
import { sanFrancesco }    from './prayers/santi/san-francesco'
import { cosmaDamiano }    from './prayers/santi/cosma-damiano'
import { eustochioB }      from './prayers/santi/eustochio-bellini'

export const prayerTree: Folder[] = [
  quotidiane,
  spiritoSanto,
  sacroCuore,
  {
    id: 'santi',
    title: 'Santi',
    subfolders: [
      sanMichele,
      sanTommaso,
      santEmidio,
      sanGiudaTaddeo,
      sanFrancesco,
      cosmaDamiano,
      eustochioB,
      // <- add new saints here: import above + one line here
    ],
  },
  credo,
  giubileo,
]

// --- Utility helpers ---------------------------------------------------------

/** Flat map of all prayers keyed by id for O(1) lookup */
export const prayerMap = new Map<string, import('../types').Prayer>()

function _index(folders: Folder[]) {
  for (const folder of folders) {
    for (const prayer of folder.prayers ?? []) prayerMap.set(prayer.id, prayer)
    _index(folder.subfolders ?? [])
  }
}
_index(prayerTree)

/** Find a folder by id (recursive) */
export function findFolder(id: string, folders: Folder[] = prayerTree): Folder | null {
  for (const folder of folders) {
    if (folder.id === id) return folder
    const found = findFolder(id, folder.subfolders ?? [])
    if (found) return found
  }
  return null
}