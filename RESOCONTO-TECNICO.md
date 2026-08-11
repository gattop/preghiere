# Resoconto tecnico completo — Spada dello Spirito

> Documento di riferimento sullo stato attuale del sito, componente per componente.

---

## 1. Panoramica

**Nome**: Spada dello Spirito — `spadadellospirito.org`
**Tipo**: sito/PWA cattolico statico — raccolta di preghiere, Rosario guidato, Vangelo del giorno, ricerca biblica.
**Stack attuale**: Astro 5 (output `static`, prerendering completo) + isole React 19 per l'interattività + Vercel per hosting/rewrite/headers.
**Lingua**: italiano, `lang="it"` fisso, nessuna i18n.
**Nessun backend, nessun account utente, nessun database.** Il sito è interamente statico: HTML generato a build-time + poche isole JS client-side per calendario liturgico, Rosario e ricerca biblica. Non c'è login, non ci sono preferiti/preghiere salvate/check-in, non c'è pannello admin, non c'è invio email. (Il progetto usava in precedenza Supabase per queste funzioni; sono state rimosse insieme a tutto il livello di autenticazione — vedi §9 per il canale sostitutivo del Vangelo del giorno.)

---

## 2. Stack tecnologico attuale

| Livello | Tecnologia | Note |
|---|---|---|
| Framework | Astro 5.3, `output: 'static'` | Nessun server Node in produzione: tutto è HTML statico + client JS |
| UI interattiva | React 19 via `@astrojs/react`, montato con direttive `client:load` / `client:visible` | Isole isolate, non un'app React SPA |
| Linguaggio | TypeScript 5.6 (strict, da `astro/tsconfigs/strict`) | |
| Contenuti | Astro Content Collections (`src/content/prayers/*.md`) | Frontmatter validato con Zod |
| Hosting | Vercel (static) | Rewrite proxy per API esterne, security header, cache header |
| PWA | Service Worker custom scritto a mano (no Workbox), Web App Manifest | Cache-first per asset, network-first per pagine/HTML |
| SEO | `@astrojs/sitemap`, JSON-LD manuale per pagina, OG/Twitter meta, `robots.txt` | |
| Servizi esterni | Vatican News RSS (vangelo), `calapi.inadiutorium.cz` (calendario liturgico), bot WhatsApp (vangelo su richiesta) | Nessuno di questi è sotto il controllo dell'app |

---

## 3. Struttura del repository

```
src/
  components/         # isole React
    BibleSearch.tsx
    CalendarioLiturgico.tsx
    RosarioPlayer.tsx
  content/
    config.ts          # schema Zod della collection "prayers"
    prayers/*.md        # 20 file, una preghiera per file
  data/
    folders.ts          # metadati statici delle cartelle (titolo, icona, colore, descrizione, ordine)
    rosario.ts           # dati e generatore di sequenza del Santo Rosario
    prayers/README.md    # ⚠️ documentazione obsoleta, da rivedere
  layouts/
    Layout.astro         # head/nav/footer condivisi
  lib/
    gospelService.ts      # fetch + parsing RSS vangelo (lato client)
  pages/
    index.astro
    rosario.astro         # NB: non usa Layout.astro, ha un proprio <html> standalone
    vangelo.astro
    bibbia.astro
    cartella/[...slug].astro
    preghiera/[...slug].astro
  styles/global.css       # ~1 file CSS globale, custom properties, glassmorphism
  utils/
    escHtml.ts             # escaping manuale per innerHTML (usato da vangelo.astro)
    parseBibleRef.ts        # parser riferimenti biblici italiani
    useBibbia.ts             # hook di ricerca versetti
  env.d.ts

public/
  bibbia.json           # 5.1 MB — intera Bibbia CEI in JSON
  manifest.webmanifest
  sw.js                 # service worker scritto a mano
  offline.html
  robots.txt
  favicon/

astro.config.mjs
vercel.json
package.json
```

Non esiste più una cartella `supabase/`: nessun backend, nessuna migration, nessuna Edge Function.

---

## 4. Modello dei contenuti (preghiere)

### 4.1 Schema (Content Collections + Zod)

`src/content/config.ts`:

```ts
const prayers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    folder: z.string(),               // path gerarchico, es. "santi/sant-emidio/triduo-sant-emidio"
    subtitle: z.string().nullish(),
    description: z.string().nullish(),
    order: z.number().optional(),     // ordinamento all'interno della cartella
  }),
})
```

- Ogni preghiera è **un file Markdown**, il cui `slug` (= id pagina `/preghiera/<slug>`) è il nome file senza estensione.
- Il corpo Markdown viene renderizzato con `Content` di Astro (basato su remark/rehype) — **supporta HTML grezzo inline** (es. `<table>` per le litanie a due colonne, vedi `litanie-sant-emidio.md`).
- Non esiste alcun database di preghiere: la **gerarchia delle cartelle è derivata a build-time** dal campo `folder` di tutti i file, non dichiarata esplicitamente da nessuna parte (eccetto i metadati decorativi in `folders.ts`).

### 4.2 Tassonomia cartelle → contenuti (stato reale al momento dell'analisi)

| Cartella (folder id) | Titolo | Icona/colore | Preghiere contenute (title — order) |
|---|---|---|---|
| `preghiere-quotidiane` | Preghiere quotidiane | 🌅 `#F59E0B` | Preghiera del mattino (1), Preghiera della sera (2) |
| `spirito-santo` | Spirito Santo | 🕊️ `#0EA5E9` | Veni Santo Spirito (1) |
| `sacro-cuore` | Sacro Cuore di Gesù | ❤️ `#EF4444` | Consacrazione al Sacro Cuore di Gesù (1), Coroncina al Sacro Cuore di Gesù (2) |
| `santi` | Santi | ✨ `#D97706` | *(nessuna preghiera diretta, solo sottocartelle)* |
| `santi/san-michele-arcangelo` | San Michele Arcangelo | | Preghiera a San Michele Arcangelo (1) |
| `santi/san-tommaso-apostolo` | San Tommaso Apostolo | | Preghiera a San Tommaso Apostolo (1) |
| `santi/sant-emidio` | Sant'Emidio | | Preghiera a Sant'Emidio (1) |
| `santi/sant-emidio/triduo-sant-emidio` | Triduo a Sant'Emidio | | Triduo Giorno 1 (1), Giorno 2 (2), Giorno 3 (3), Litanie a S. Emidio (4) |
| `santi/san-giuda-taddeo` | San Giuda Taddeo | | Preghiera a San Giuda Taddeo (1), Preghiera per i casi difficili (2) |
| `santi/san-francesco-assisi` | San Francesco d'Assisi | | Preghiera di San Francesco (1), Cantico delle creature (2) |
| `santi/ss-cosma-damiano` | Santi Cosma e Damiano | | Preghiera ai Santi Cosma e Damiano (1) |
| `santi/beata-eustochio-bellini` | Beata Eustochio Bellini | | Preghiera alla Beata Eustochio Bellini (1) |
| `credo` | Credo | 🙏 `#6D28D9` | Credo Apostolico (1), Credo Niceno-Costantinopolitano (2) |

Cartelle top-level mostrate in home (`TOP_LEVEL_FOLDERS`, in quest'ordine): `preghiere-quotidiane`, `spirito-santo`, `sacro-cuore`, `santi`, `credo`.

---

## 5. Pagine (routing) — comportamento dettagliato

| Rotta | File | Prerendering | Descrizione |
|---|---|---|---|
| `/` | `pages/index.astro` | Statico | Hero, `CalendarioLiturgico` (React), griglia cartelle top-level con conteggio preghiere (incluse nidificate) |
| `/cartella/[...slug]` | `pages/cartella/[...slug].astro` | Statico (`getStaticPaths` genera **ogni** path di cartella/sottocartella derivato dai frontmatter) | Lista sottocartelle (con badge conteggio) + preghiere dirette, ordinate per `order` |
| `/preghiera/[...slug]` | `pages/preghiera/[...slug].astro` | Statico (una pagina per ogni file `.md`) | Titolo/sottotitolo/descrizione, corpo Markdown renderizzato, breadcrumb JSON-LD, bottone "modalità lettura" (font-size, persistita in `localStorage`), stampa, Web Share API se disponibile |
| `/rosario` | `pages/rosario.astro` | Statico | **Non usa `Layout.astro`**: head HTML proprio, nessun header/nav — esperienza immersiva a schermo intero. Monta `RosarioPlayer` React |
| `/vangelo` | `pages/vangelo.astro` | Statico (contenuto caricato client-side) | Fetch RSS Vatican News via proxy `/api/rss/...`, mostra titolo/descrizione/link |
| `/bibbia` | `pages/bibbia.astro` | Statico | Monta `BibleSearch` React, che carica **l'intero** `bibbia.json` (5.1 MB) al mount |

Non esistono più pagine autenticate: `/accedi`, `/reset-password`, `/nuova-password`, `/profilo`, `/preferiti`, `/proposta`, `/admin` sono state rimosse insieme a login/preferiti/check-in/proposte/pannello admin.

Nota: `robots.txt` non ha più `Disallow` per rotte private (non esistono più).

---

## 6. Componenti React (isole)

### 6.1 `CalendarioLiturgico.tsx`
- Fetch giornaliero a `/api/cal/api/v0/it/calendars/general-it/{anno}/{mese}/{giorno}` (proxy verso `calapi.inadiutorium.cz`).
- Cache in `localStorage` con chiave `cal-YYYY-MM-DD` (evita richieste ripetute nello stesso giorno).
- In base al `season` liturgico ricevuto (`advent`, `christmas`, `ordinary`, `lent`, `easter_triduum`, `easter`), applica dinamicamente un tema colore **sovrascrivendo le CSS custom properties** globali (`--accent`, `--accent-d`, `--accent-l`, `--shadow-accent`) su `document.documentElement`, con transizione CSS (`@property` dichiarate in `global.css` per animare i colori).
- Mostra tempo liturgico, settimana, eventuale festa/santo del giorno, pallino colorato con colore liturgico (verde/bianco/rosso/viola/rosa/nero).

### 6.2 `RosarioPlayer.tsx`
- Stato: `steps` (array generato da `buildRosarioSequence(dayOfWeek)`), `current` (indice corrente).
- Naviga con bottoni Avanti/Indietro **e** tastiera (frecce/spazio).
- Barra di progresso proporzionale.
- Visualizzazione speciale per i misteri (card dedicata) e per le Ave Maria di una decina (10 "grani" visivi, evidenziati in base al conteggio).
- Determinismo: i misteri del giorno dipendono da `new Date().getDay()` (0=domenica…6=sabato) → mappatura fissa gaudiosi/dolorosi/gloriosi/luminosi.

### 6.3 `BibleSearch.tsx` + `useBibbia.ts` + `parseBibleRef.ts`
- `useBibbia`: fetch di `public/bibbia.json` al mount, estrae `aliases` (mappa nome-libro-normalizzato → chiave), espone `cerca(query)`.
- `parseBibleRef`: parser regex per riferimenti tipo `Lc 2,14`, `Lc 2,14-16`, `Lc 15,1-3.11-32` (range multipli separati da punto), `1Cor 13,4-7`, nomi estesi case-insensitive (`giovanni 3,16`). Ritorna `BibleRef {bookKey, chapter, ranges}` o un errore tipizzato.
- Formato dati Bibbia atteso (`bibbia.json`):
  ```ts
  interface BibbiaData {
    meta: { titolo: string; libri_totali: number }
    aliases: Record<string, string>          // "giovanni" -> "Gv", "1 cor" -> "1Cor", ecc.
    libri: Record<string, {                  // chiave = "Gv", "1Cor", ecc.
      nome: string
      abbreviazione: string
      testamento: 'AT' | 'NT'
      capitoli: Record<string /*numero capitolo*/, Record<string /*numero versetto*/, string /*testo*/>>
    }>
  }
  ```
- Risultato ricerca: lista di versetti con riferimento (`Lc 2,14`), libro, capitolo, versetto, testo.

---

## 7. Layout condiviso (`Layout.astro`)

- Head: meta OG/Twitter completi, canonical, JSON-LD opzionale via prop, Google Fonts (Libre Baskerville + Inter) caricati in modo non bloccante (`media="print" onload="this.media='all'"` + `<noscript>` fallback), manifest PWA, meta iOS (`apple-mobile-web-app-*`).
- Header sticky con logo SVG (gradiente), menu hamburger responsive, nav statica: Home, Rosario, Vangelo, Bibbia (nessuna voce auth-dependent, non c'è più login).
- Script client nel layout: toggle nav, chiusura su `Escape`/click esterno, **registrazione service worker**.
- Footer minimale con credito autore.
- `rosario.astro` **duplica** questo scheletro HTML invece di riusare `Layout.astro` (per un'esperienza a schermo intero senza header) — tech debt nota, non ancora risolta.

---

## 8. Stile

- Un solo file CSS globale (`global.css`), niente CSS-in-JS/Tailwind.
- Design "glassmorphism" chiaro: sfondo gradiente pastello fisso, card semitrasparenti con `backdrop-filter: blur`, ombre morbide, bordi arrotondati pill/`22px`.
- Palette dinamica tramite CSS custom properties `@property`-dichiarate (`--accent`, `--accent-d`, `--accent-l`) che vengono **animate** (`transition`) quando il tema liturgico cambia colore.
- Font: `Libre Baskerville` (serif, titoli/hero) + `Inter` (corpo/UI).
- Micro-animazioni diffuse: `fadeInUp`, `popIn`, `pulseRing`, stagger delay su elementi in lista.

---

## 9. Vangelo del giorno — canale WhatsApp

Il Vangelo del giorno via email (con relativo toggle in un profilo utente) è stato rimosso insieme a tutto il sistema di login. Il canale sostitutivo è un **bot WhatsApp esterno**: l'utente scrive **"vangelo oggi"** al numero **+39 375 112 2880** e riceve il testo del giorno. Il bot non fa parte di questo repository — è un servizio esterno indipendente, nessuna integrazione lato codice oltre a citarlo nei testi del sito dove rilevante.

La pagina `/vangelo` resta invariata: mostra il Vangelo del giorno letto dal feed RSS di Vatican News direttamente nel browser (nessun account richiesto).

---

## 10. Integrazioni esterne

| Servizio | Uso | Endpoint | Come viene raggiunto oggi |
|---|---|---|---|
| Vatican News RSS | Vangelo del giorno | `https://www.vaticannews.va/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml` | Proxy Vite in dev (`astro.config.mjs`), rewrite Vercel in prod (`vercel.json`) su `/api/rss/*`; parsing XML lato client con `DOMParser` (`gospelService.ts`) |
| CalAPI (calendario liturgico) | Tempo liturgico, festività del giorno, colore liturgico | `http://calapi.inadiutorium.cz/api/v0/it/calendars/general-it/{y}/{m}/{d}` | Stesso pattern proxy (`/api/cal/*`), fetch diretto dal componente React, cache `localStorage` giornaliera |
| Bot WhatsApp | Vangelo del giorno su richiesta (`"vangelo oggi"` → `+39 375 112 2880`) | n/a (numero WhatsApp) | Servizio esterno indipendente, vedi §9 |

---

## 11. PWA

### 11.1 `manifest.webmanifest`
Nome, short_name, `display: standalone`, `background_color: #0f0d1a`, `theme_color: #9B8DF8`, icone 192/512 (+ maskable).

### 11.2 `sw.js` (service worker scritto a mano, no Workbox)
- `CACHE_NAME = 'spada-v4'` — precache di app-shell (`/`, `/rosario`, `/vangelo`, `/bibbia`, `/offline.html`, icone, manifest) all'`install`.
- All'`activate`, elimina cache con nome diverso da quello corrente (versionamento manuale della cache).
- Strategie al `fetch`:
  - Asset statici (`png|jpg|svg|ico|webp|css|js|woff2?`) → **cache-first**, popolamento cache in background.
  - Pagine HTML/altro same-origin → **network-first**, fallback cache, fallback finale `offline.html`.
  - Richieste cross-origin → ignorate (passano dritte alla rete; erano previste eccezioni per Supabase, rimosse insieme al resto del backend).

---

## 12. SEO

- `@astrojs/sitemap` genera `sitemap-index.xml` automaticamente da tutte le route statiche.
- JSON-LD per pagina: `WebSite` + `SearchAction` in home, `BreadcrumbList` su cartelle e preghiere, `WebPage` su `/rosario`.
- Meta OG/Twitter completi su ogni pagina (via `Layout.astro`), canonical dinamico da `Astro.url.pathname`.
- Nessuna pagina privata da escludere (non esistono più rotte autenticate): `robots.txt` ha solo `Disallow: /api/`.

---

## 13. Sicurezza — stato attuale

| Aspetto | Stato | Note |
|---|---|---|
| Header di sicurezza (`vercel.json`) | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` | Manca una Content-Security-Policy — valutare se aggiungerla |
| Superficie d'attacco | Molto ridotta rispetto a prima: nessun account utente, nessun dato personale raccolto, nessun endpoint scrivibile | Il sito è puro contenuto statico + fetch a due API pubbliche di terzi |
| Escaping output utente | `escHtml()` usato in `vangelo.astro` per titolo/link del feed RSS iniettati via `innerHTML` | Pattern manuale ma circoscritto a un solo file ora |
| Contenuto RSS esterno | `gospel.description` iniettato via `innerHTML` **senza** escaping in `vangelo.astro` | Scelta intenzionale per preservare il markup del feed, ma è superficie XSS se la fonte fosse compromessa; da valutare se sanitizzare (es. DOMPurify) |

---

## 14. Elenco file sorgente (riferimento rapido)

```
src/pages/index.astro
src/pages/rosario.astro
src/pages/vangelo.astro
src/pages/bibbia.astro
src/pages/cartella/[...slug].astro
src/pages/preghiera/[...slug].astro
src/layouts/Layout.astro
src/components/BibleSearch.tsx
src/components/CalendarioLiturgico.tsx
src/components/RosarioPlayer.tsx
src/lib/gospelService.ts
src/data/folders.ts
src/data/rosario.ts
src/utils/escHtml.ts
src/utils/parseBibleRef.ts
src/utils/useBibbia.ts
src/content/config.ts
src/content/prayers/*.md   (20 file, vedi tabella §4.2)
public/sw.js
public/manifest.webmanifest
public/offline.html
public/bibbia.json
public/robots.txt
astro.config.mjs
vercel.json
```
