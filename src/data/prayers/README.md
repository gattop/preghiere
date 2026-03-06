# Gestione delle Preghiere — Guida completa

Questa guida spiega come aggiungere, modificare e rimuovere preghiere e cartelle di preghiere senza rompere nulla nel sito.

---

## Indice

1. [Struttura dei file](#1-struttura-dei-file)
2. [Come funziona il sistema internamente](#2-come-funziona-il-sistema-internamente)
3. [Regola fondamentale: gli `id`](#3-regola-fondamentale-gli-id)
4. [Gli helper `blocks`](#4-gli-helper-blocks)
5. [Aggiungere una preghiera a una cartella esistente](#5-aggiungere-una-preghiera-a-una-cartella-esistente)
6. [Aggiungere una nuova cartella di primo livello](#6-aggiungere-una-nuova-cartella-di-primo-livello)
7. [Aggiungere un nuovo Santo](#7-aggiungere-un-nuovo-santo)
8. [Aggiungere una sottocartella dentro una cartella esistente](#8-aggiungere-una-sottocartella-dentro-una-cartella-esistente)
9. [Rimuovere una preghiera](#9-rimuovere-una-preghiera)
10. [Rimuovere una cartella](#10-rimuovere-una-cartella)
11. [Modificare titolo o testo di una preghiera existente](#11-modificare-titolo-o-testo-di-una-preghiera-esistente)
12. [Checklist prima del commit](#12-checklist-prima-del-commit)

---

## 1. Struttura dei file

```
src/data/
├── prayers.ts              ← albero ufficiale (prayerTree) + prayerMap + findFolder
├── prayerBlocks.ts         ← funzioni helper per costruire i blocchi di testo
└── prayers/
    ├── README.md           ← questo file
    ├── quotidiane.ts       ← cartella "Preghiere quotidiane"
    ├── spirito-santo.ts    ← cartella "Spirito Santo"
    ├── sacro-cuore.ts      ← cartella "Sacro Cuore"
    ├── credo.ts            ← cartella "Credo"
    ├── giubileo.ts         ← cartella "Giubileo"
    └── santi/
        ├── san-michele.ts
        ├── san-tommaso.ts
        ├── sant-emidio.ts
        ├── san-giuda-taddeo.ts
        ├── san-francesco.ts
        ├── cosma-damiano.ts
        └── eustochio-bellini.ts
```

Il file centrale è **`src/data/prayers.ts`**: importa tutte le cartelle, le assembla nell'array `prayerTree` e costruisce `prayerMap` (una `Map` piatta che indicizza ogni preghiera per `id`).

---

## 2. Come funziona il sistema internamente

```
prayerTree (Folder[])
    │
    ├── findFolder(id)   → usato da FolderPage per mostrare una cartella
    │
    └── prayerMap (Map<id, Prayer>)  → usato da PrayerPage per mostrare una preghiera
```

- **URL cartella**: `/cartella/<folder.id>`
- **URL preghiera**: `/preghiera/<prayer.id>`
- **Sitemap**: viene ricalcolata automaticamente ad ogni `npm run build` leggendo `prayerTree`
- **SEO (JSON-LD)**: ogni pagina preghiera/cartella costruisce dinamicamente i dati strutturati dall'oggetto

---

## 3. Regola fondamentale: gli `id`

> **Gli `id` devono essere globalmente unici in tutto il sito.**

- Diventano parte dell'URL, quindi devono essere stabili: **non cambiarli mai dopo il deploy**
- Usa sempre il formato **kebab-case**: `esame-di-coscienza`, `novena-divina-misericordia`
- Se due preghiere hanno lo stesso `id`, `prayerMap` conserva solo l'ultima indicizzata — l'altra diventa invisibile senza alcun errore esplicito
- Se due cartelle hanno lo stesso `id`, `findFolder` restituisce la prima trovata — l'altra diventa irraggiungibile

**Convenzione consigliata:**

| Tipo | Formato |
|---|---|
| Preghiera generica | `nome-preghiera` |
| Preghiera a un santo | `preghiera-san-nome` |
| Cartella sezione | `nome-sezione` |
| Cartella santo | `san-nome` / `santa-nome` |

---

## 4. Gli helper `blocks`

Tutti gli helper sono in `src/data/prayerBlocks.ts`. Si importano sempre così:

```ts
import { p, h, it, v, resp, rep, lit, div } from '../../prayerBlocks'
// (o '../prayerBlocks' se sei dentro prayers/ e non in un sottolivello)
```

| Funzione | Tipo renderizzato | Quando usarla |
|---|---|---|
| `p('testo')` | Paragrafo | Testo principale della preghiera |
| `h('titolo')` | `<h3>` intestazione | Separare sezioni dentro una preghiera |
| `it('testo')` | Corsivo / rubrica | Indicazioni liturgiche, es. *"Padre, Ave e Gloria"* |
| `v('r1', 'r2', ...)` | Righe con `<br>` | Strofe poetiche, versetti |
| `resp('V/', 'R/')` | Versetto + risposta | Dialogo liturgico voce/assemblea |
| `rep('testo', 9)` | Testo + contatore | Ripetizioni contate, es. Ave Maria ×10 |
| `lit([{prompt, response}])` | Tabella litanie | Litanie lunghe con molte invocazioni |
| `div()` | `<hr>` | Separatore visuale tra sezioni |

### Esempi

```ts
// Paragrafo semplice
p('O Signore, abbi pietà di noi.')

// Intestazione di sezione
h('Atto di contrizione')

// Rubrica / indicazione
it('Si recita inginocchiati.')

// Strofa poetica
v(
  'Salve, Regina, Madre di misericordia,',
  'vita, dolcezza e speranza nostra, salve.',
)

// Versetto dialogato (V = voce, R = risposta)
resp('Signore, pietà.', 'Signore, pietà.')
resp('Cristo, pietà.', 'Cristo, pietà.')

// Ripetizione contata
rep('Ave Maria', 10)

// Litania
lit([
  { prompt: 'Signore, pietà.',  response: 'Signore, pietà.' },
  { prompt: 'Cristo, pietà.',   response: 'Cristo, pietà.' },
  { prompt: 'Kyrie, eleison.',  response: 'Kyrie, eleison.' },
])

// Divisore
div()
```

---

## 5. Aggiungere una preghiera a una cartella esistente

Apri il file `.ts` della cartella interessata (es. `prayers/quotidiane.ts`) e aggiungi un oggetto nell'array `prayers`:

```ts
// src/data/prayers/quotidiane.ts

export const quotidiane: Folder = {
  id: 'preghiere-quotidiane',
  title: 'Preghiere quotidiane',
  prayers: [
    // ... preghiere esistenti ...

    // ↓ NUOVA PREGHIERA
    {
      id: 'esame-di-coscienza',       // unico in tutto il sito
      title: 'Esame di coscienza',
      subtitle: 'da recitarsi la sera', // opzionale
      description: 'Breve esamina per prepararsi al riposo.', // opzionale — mostrato sopra il testo
      blocks: [
        h('Atto di contrizione'),
        p('Signore, ti chiedo perdono per i peccati di oggi...'),
        it('Si termina con un Padre Nostro.'),
      ],
    },
  ],
}
```

**Non serve toccare `prayers.ts`** — la cartella è già inclusa nell'albero.

---

## 6. Aggiungere una nuova cartella di primo livello

### Passo 1 — Crea il file

`src/data/prayers/mia-sezione.ts`

```ts
import type { Folder } from '../../types'
import { p, h, it } from '../prayerBlocks'

export const miaSezione: Folder = {
  id: 'mia-sezione',      // → URL: /cartella/mia-sezione
  title: 'Mia Sezione',
  description: 'Descrizione opzionale mostrata nella pagina cartella.',
  prayers: [
    {
      id: 'prima-preghiera',   // → URL: /preghiera/prima-preghiera
      title: 'Prima preghiera',
      blocks: [
        h('Titolo interno'),
        p('Testo della preghiera...'),
      ],
    },
  ],
}
```

### Passo 2 — Registra in `prayers.ts`

```ts
// src/data/prayers.ts

import { miaSezione } from './prayers/mia-sezione'   // ← aggiungi import

export const prayerTree: Folder[] = [
  quotidiane,
  spiritoSanto,
  // ...
  miaSezione,   // ← aggiungi alla posizione desiderata
  credo,
  giubileo,
]
```

---

## 7. Aggiungere un nuovo Santo

### Passo 1 — Crea il file santo

`src/data/prayers/santi/san-giuseppe.ts`

```ts
import type { Folder } from '../../../types'
import { p, div } from '../../prayerBlocks'

export const sanGiuseppe: Folder = {
  id: 'san-giuseppe',
  title: 'San Giuseppe',
  prayers: [
    {
      id: 'preghiera-san-giuseppe',
      title: 'Preghiera a San Giuseppe',
      blocks: [
        p('O glorioso San Giuseppe, sposo della Vergine Maria...'),
        div(),
        p('Amen.'),
      ],
    },
    {
      id: 'novena-san-giuseppe',
      title: 'Novena a San Giuseppe',
      description: 'Da recitarsi per 9 giorni.',
      blocks: [
        p('O San Giuseppe, padre putativo di Gesù...'),
      ],
    },
  ],
}
```

### Passo 2 — Registra in `prayers.ts`

```ts
import { sanGiuseppe } from './prayers/santi/san-giuseppe'   // ← import

// Dentro prayerTree:
{
  id: 'santi',
  title: 'Santi',
  subfolders: [
    sanMichele,
    sanTommaso,
    // ...
    sanGiuseppe,   // ← aggiungi qui
  ],
},
```

---

## 8. Aggiungere una sottocartella dentro una cartella esistente

Puoi nidificare cartelle all'infinito. Esempio: aggiungere una sottosezione "Novene" dentro "Preghiere quotidiane":

```ts
// src/data/prayers/quotidiane.ts

export const quotidiane: Folder = {
  id: 'preghiere-quotidiane',
  title: 'Preghiere quotidiane',
  prayers: [ /* ... */ ],
  subfolders: [             // ← aggiungi questo
    {
      id: 'novene-quotidiane',
      title: 'Novene',
      prayers: [
        {
          id: 'novena-divina-misericordia',
          title: 'Novena della Divina Misericordia',
          blocks: [ p('...') ],
        },
      ],
    },
  ],
}
```

---

## 9. Rimuovere una preghiera

### Passo 1 — Trova il file che contiene la preghiera

La preghiera si trova in uno dei file dentro `src/data/prayers/`. Per capire in quale:

- Se è una preghiera quotidiana → `src/data/prayers/quotidiane.ts`
- Se è legata a un santo → `src/data/prayers/santi/<nome-santo>.ts`
- Se è sul Sacro Cuore → `src/data/prayers/sacro-cuore.ts`
- ecc.

Puoi anche cercare direttamente per `id` con il terminale:
```
grep -r "id: 'nome-preghiera'" src/data/prayers/
```

### Passo 2 — Rimuovi l'oggetto dal file trovato

Apri il file e cancella l'intero oggetto preghiera dall'array `prayers[]`.

**Esempio:** rimuovere `preghiera-della-sera` da `quotidiane.ts`:

```ts
// PRIMA
export const quotidiane: Folder = {
  id: 'preghiere-quotidiane',
  title: 'Preghiere quotidiane',
  prayers: [
    {
      id: 'preghiera-del-mattino',
      title: 'Preghiera del mattino',
      blocks: [ /* ... */ ],
    },
    {
      id: 'preghiera-della-sera',   // ← da rimuovere
      title: 'Preghiera della sera',
      blocks: [ /* ... */ ],
    },
  ],
}

// DOPO
export const quotidiane: Folder = {
  id: 'preghiere-quotidiane',
  title: 'Preghiere quotidiane',
  prayers: [
    {
      id: 'preghiera-del-mattino',
      title: 'Preghiera del mattino',
      blocks: [ /* ... */ ],
    },
    // preghiera-della-sera rimossa
  ],
}
```

### Passo 3 — Non toccare `prayers.ts`

`src/data/prayers.ts` non va modificato: non elenca le singole preghiere, solo le cartelle. `prayerMap` si ricalcola automaticamente al prossimo build.

### Passo 4 — Pulizia del database (se la rimozione è definitiva)

Se degli utenti avevano aggiunto quella preghiera ai preferiti, la riga rimane nel DB ma viene ignorata silenziosamente dall'interfaccia. Per eliminare le righe orfane, esegui questa query nel pannello SQL di Supabase:

```sql
DELETE FROM favorites
WHERE prayer_id = 'nome-preghiera-da-rimuovere';
```

### ⚠️ Attenzione SEO

Se la preghiera era già indicizzata da Google (aveva traffico, link esterni), **non rimuoverla**: svuota invece il contenuto e lascia un messaggio:

```ts
{
  id: 'preghiera-della-sera',
  title: 'Preghiera della sera',
  blocks: [
    p('Questa preghiera non è più disponibile.'),
  ],
}
```

Oppure aggiungi un redirect in `vercel.json` verso una preghiera simile:

```json
{
  "redirects": [
    {
      "source": "/preghiera/preghiera-della-sera",
      "destination": "/preghiera/preghiera-del-mattino",
      "permanent": true
    }
  ]
}
```

---

## 10. Rimuovere una cartella

1. **Rimuovi la voce** da `prayerTree` (o da `subfolders[]`) in `src/data/prayers.ts`
2. **Rimuovi l'import** corrispondente in `src/data/prayers.ts`
3. **Elimina il file** `.ts` dalla directory `prayers/`
4. **Controlla** che nessun altro file importi direttamente quel modulo con:
   ```
   grep -r "from.*mia-sezione" src/
   ```

`prayerMap` e `findFolder` si ricalcolano automaticamente — non c'è altro da aggiornare.

---

## 11. Modificare titolo o testo di una preghiera esistente

- **Cambiare `title`, `subtitle`, `description`, `blocks`**: libero, non ha effetti collaterali
- **Cambiare `id`**: ⛔ **non farlo dopo il deploy** — l'URL cambia, i favoriti degli utenti puntano al vecchio `id` e vengono persi, Google ha già indicizzato il vecchio URL

Se devi rinominare un `id` già pubblicato, aggiungi un redirect in `vercel.json`:

```json
{
  "redirects": [
    { "source": "/preghiera/vecchio-id", "destination": "/preghiera/nuovo-id", "permanent": true }
  ]
}
```

---

## 12. Checklist prima del commit

```
[ ] L'id della preghiera/cartella è in kebab-case e globalmente unico
[ ] Il file è nella directory corretta (prayers/ o prayers/santi/)
[ ] L'import è stato aggiunto in prayers.ts
[ ] La voce è stata aggiunta in prayerTree o in subfolders[]
[ ] npm run build → nessun errore TypeScript
[ ] La pagina è raggiungibile manualmente in dev (npm run dev)
[ ] Il testo è corretto e non contiene errori ortografici
[ ] Se rimosso un id già pubblicato: redirect aggiunto in vercel.json
```
