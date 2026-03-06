/**
 * Parser per riferimenti biblici in italiano.
 * Supporta:
 *   Lc 2,14        → libro, capitolo, versetto singolo
 *   Lc 2,14-16     → libro, capitolo, range versetti
 *   Lc 2           → libro, capitolo intero
 *   Gv 3,16        → libro, capitolo, versetto
 *   1Cor 13,4-7    → libri con numero prefisso
 *   giovanni 3,16  → nome per esteso (case-insensitive)
 */

export interface BibleRef {
  bookKey: string;       // chiave nel JSON (es. "Lc", "1Cor")
  chapter: number;
  verseFrom?: number;
  verseTo?: number;
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
 *   "luca 2,14"   "1 Cor 13"   "1Cor 13,4-7"
 *   "Sal 23"   "salmo 23,1"
 */
export function parseBibleRef(input: string): ParseResult {
  const raw = input.trim();
  if (!raw) return { message: 'Inserisci un riferimento biblico (es. Lc 2,14-16)' };

  // Pattern: [numero?][spazio?][nome libro][spazio][capitolo][,versetto[-versetto]?]
  const pattern =
    /^(\d?\s*[a-zA-ZÀ-ÿ]+(?:\s+[a-zA-ZÀ-ÿ]+)*)\s+(\d+)(?:[,.](\d+)(?:\s*[-–]\s*(\d+))?)?$/;

  const match = raw.match(pattern);
  if (!match) {
    return {
      message: `Formato non riconosciuto. Usa: "Lc 2,14" oppure "Lc 2,14-16" oppure "Lc 2"`,
    };
  }

  const [, bookRaw, chapterStr, verseFromStr, verseToStr] = match;

  const bookKey = normalizeBookName(bookRaw);
  if (!bookKey) {
    return { message: `Libro non riconosciuto: "${bookRaw}"` };
  }

  const chapter = parseInt(chapterStr, 10);
  const verseFrom = verseFromStr ? parseInt(verseFromStr, 10) : undefined;
  const verseTo = verseToStr ? parseInt(verseToStr, 10) : verseFrom;

  if (verseTo !== undefined && verseFrom !== undefined && verseTo < verseFrom) {
    return { message: `Il versetto finale (${verseTo}) è minore di quello iniziale (${verseFrom})` };
  }

  return { bookKey, chapter, verseFrom, verseTo };
}

/** Formatta un BibleRef in testo leggibile (es. "Lc 2,14-16") */
export function formatRef(ref: BibleRef, bookName: string): string {
  let s = `${bookName} ${ref.chapter}`;
  if (ref.verseFrom !== undefined) {
    s += `,${ref.verseFrom}`;
    if (ref.verseTo !== undefined && ref.verseTo !== ref.verseFrom) {
      s += `-${ref.verseTo}`;
    }
  }
  return s;
}
