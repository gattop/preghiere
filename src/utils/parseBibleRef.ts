/**
 * Parser per riferimenti biblici in italiano.
 * Supporta:
 *   Lc 2,14        → libro, capitolo, versetto singolo
 *   Lc 2,14-16     → libro, capitolo, range versetti
 *   Lc 2           → libro, capitolo intero
 *   Lc 15,1-3.11-32 → range multipli separati da punto
 *   1Cor 13,4-7    → libri con numero prefisso
 *   giovanni 3,16  → nome per esteso (case-insensitive)
 */

export interface VerseRange {
  from: number;
  to: number;
}

export interface BibleRef {
  bookKey: string;       // chiave nel JSON (es. "Lc", "1Cor")
  chapter: number;
  ranges: VerseRange[];  // vuoto = capitolo intero
}

export interface ParseError {
  message: string;
}

export type ParseResult = BibleRef | ParseError;

export function isError(r: ParseResult): r is ParseError {
  return 'message' in r;
}

// Aliases: stringa normalizzata → chiave libro nel JSON
// Questo oggetto viene iniettato dal JSON stesso (data.aliases)
let _aliases: Record<string, string> = {};

export function setAliases(aliases: Record<string, string>) {
  _aliases = aliases;
}

function normalizeBookName(raw: string): string | null {
  const key = raw.toLowerCase().trim().replace(/\s+/g, ' ');
  return _aliases[key] ?? null;
}

/**
 * Parsa un riferimento biblico testuale.
 * Esempi validi:
 *   "Lc 2,14"   "Lc 2,14-16"   "Lc 2"
 *   "Lc 15,1-3.11-32"   → range multipli
 *   "luca 2,14"   "1 Cor 13"   "1Cor 13,4-7"
 *   "Sal 23"   "salmo 23,1"
 */
export function parseBibleRef(input: string): ParseResult {
  const raw = input.trim();
  if (!raw) return { message: 'Inserisci un riferimento biblico (es. Lc 2,14-16)' };

  // Estrai libro+capitolo, poi la parte versetti opzionale
  const pattern =
    /^(\d?\s*[a-zA-ZÀ-ÿ]+(?:\s+[a-zA-ZÀ-ÿ]+)*)\s+(\d+)(?:[,.](.+))?$/;

  const match = raw.match(pattern);
  if (!match) {
    return {
      message: `Formato non riconosciuto. Usa: "Lc 2,14" oppure "Lc 2,14-16" oppure "Lc 15,1-3.11-32"`,
    };
  }

  const [, bookRaw, chapterStr, versePart] = match;

  const bookKey = normalizeBookName(bookRaw);
  if (!bookKey) {
    return { message: `Libro non riconosciuto: "${bookRaw}"` };
  }

  const chapter = parseInt(chapterStr, 10);
  const ranges: VerseRange[] = [];

  if (versePart) {
    // Ogni range: \d+(-\d+)?, separati da punto
    const rangeRe = /(\d+)(?:\s*[-\u2013]\s*(\d+))?/g;
    let m;
    while ((m = rangeRe.exec(versePart)) !== null) {
      const from = parseInt(m[1], 10);
      const to   = m[2] ? parseInt(m[2], 10) : from;
      if (to < from) {
        return { message: `Versetto finale (${to}) minore di quello iniziale (${from})` };
      }
      ranges.push({ from, to });
    }
    if (ranges.length === 0) {
      return { message: `Versetti non riconosciuti: "${versePart}"` };
    }
  }

  return { bookKey, chapter, ranges };
}

/** Formatta un BibleRef in testo leggibile (es. "Lc 2,14-16") */
export function formatRef(ref: BibleRef, bookName: string): string {
  let s = `${bookName} ${ref.chapter}`;
  if (ref.ranges.length > 0) {
    s += ',' + ref.ranges
      .map(r => r.from === r.to ? `${r.from}` : `${r.from}-${r.to}`)
      .join('.');
  }
  return s;
}
