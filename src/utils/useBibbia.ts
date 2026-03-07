/**
 * useBibbia — hook che carica bibbia.json e fornisce lookup versetti.
 * Il JSON viene caricato una volta sola e messo in cache.
 */

import { useState, useEffect, useCallback } from 'react';
import { setAliases, parseBibleRef, isError } from './parseBibleRef';
import type { BibleRef } from './parseBibleRef';

function formatRef(ref: BibleRef, abbr: string): string {
  let s = `${abbr} ${ref.chapter}`
  if (ref.ranges.length > 0) {
    s += ',' + ref.ranges
      .map(r => r.from === r.to ? `${r.from}` : `${r.from}-${r.to}`)
      .join('.')
  }
  return s
}

// ── Tipi ──────────────────────────────────────────────────────────────

export interface Libro {
  nome: string;
  abbreviazione: string;
  testamento: 'AT' | 'NT';
  capitoli: Record<string, Record<string, string>>;
}

export interface BibbiaData {
  meta: { titolo: string; libri_totali: number };
  aliases: Record<string, string>;
  libri: Record<string, Libro>;
}

export interface VersettoResult {
  ref: string;           // es. "Lc 2,14"
  libro: string;         // nome completo
  capitolo: number;
  versetto: number;
  testo: string;
}

export interface SearchResult {
  query: string;
  refLabel: string;      // es. "Lc 2,14-16"
  versetti: VersettoResult[];
  error?: string;
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useBibbia() {
  const [data, setData] = useState<BibbiaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/bibbia.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: BibbiaData) => {
        setAliases(json.aliases);
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(`Impossibile caricare la Bibbia: ${e.message}`);
        setLoading(false);
      });
  }, []);

  const cerca = useCallback(
    (query: string): SearchResult => {
      if (!data) return { query, refLabel: '', versetti: [], error: 'Dati non ancora caricati' };

      const parsed = parseBibleRef(query);
      if (isError(parsed)) {
        return { query, refLabel: '', versetti: [], error: parsed.message };
      }

      const { bookKey, chapter, ranges } = parsed as BibleRef;
      const libro = data.libri[bookKey];

      if (!libro) {
        return { query, refLabel: '', versetti: [], error: `Libro non trovato: ${bookKey}` };
      }

      const capData = libro.capitoli[String(chapter)];
      if (!capData) {
        return {
          query,
          refLabel: '',
          versetti: [],
          error: `Capitolo ${chapter} non trovato in ${libro.nome}`,
        };
      }

      const allVerseNums = Object.keys(capData)
        .map(Number)
        .sort((a, b) => a - b);

      let versetti: VersettoResult[];
      if (ranges.length === 0) {
        // Capitolo intero
        versetti = allVerseNums.map((n) => ({
          ref: `${bookKey} ${chapter},${n}`,
          libro: libro.nome,
          capitolo: chapter,
          versetto: n,
          testo: capData[String(n)],
        }));
      } else {
        // Uno o più range: mantieni l'ordine del testo biblico
        const included = new Set<number>();
        for (const r of ranges) {
          allVerseNums.filter(n => n >= r.from && n <= r.to).forEach(n => included.add(n));
        }
        versetti = allVerseNums
          .filter(n => included.has(n))
          .map((n) => ({
            ref: `${bookKey} ${chapter},${n}`,
            libro: libro.nome,
            capitolo: chapter,
            versetto: n,
            testo: capData[String(n)],
          }));
      }

      if (versetti.length === 0) {
        return {
          query,
          refLabel: '',
          versetti: [],
          error: `Nessun versetto trovato per ${query}`,
        };
      }

      const refLabel = formatRef(parsed as BibleRef, libro.abbreviazione);
      return { query, refLabel, versetti };
    },
    [data]
  );

  return { data, loading, error, cerca };
}
