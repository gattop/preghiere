/**
 * Shorthand helpers for building PrayerBlock arrays.
 *
 * Usage:
 *   import { p, h, it, v, resp, rep, lit, div } from '../prayerBlocks'
 *
 *   blocks: [
 *     h('Atto di adorazione'),
 *     p('Ti adoro, mio Dio...'),
 *     it('Padre, Ave e Gloria'),
 *     v('Riga uno', 'Riga due', 'Riga tre'),
 *     resp('Signore, pietà.', 'Signore, pietà.'),
 *     rep('Sia benedetto il nome di San Michele.', 9),
 *     lit([{ prompt: 'Signore, pietà.', response: 'Signore, pietà.' }]),
 *     div(),
 *   ]
 */

import type { PrayerBlock } from '../types'

/** Plain paragraph */
export const p = (text: string): PrayerBlock => ({ type: 'paragraph', text })

/** Section heading (renders as <h3>) */
export const h = (text: string): PrayerBlock => ({ type: 'heading', text })

/** Italic / rubric text */
export const it = (text: string): PrayerBlock => ({ type: 'italic', text })

/** Stanza — lines joined with <br> */
export const v = (...lines: string[]): PrayerBlock => ({ type: 'verse', lines })

/** Single call-and-response row */
export const resp = (prompt: string, response: string): PrayerBlock =>
  ({ type: 'response', prompt, response })

/** Repeated text with a count label */
export const rep = (text: string, count: number): PrayerBlock =>
  ({ type: 'repetition', text, count })

/** Litany table — array of { prompt, response } rows */
export const lit = (
  rows: Array<{ prompt: string; response: string }>
): PrayerBlock => ({ type: 'litany', rows })

/** Horizontal divider */
export const div = (): PrayerBlock => ({ type: 'divider' })
