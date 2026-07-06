# Resoconto tecnico completo — Spada dello Spirito

> Documento di riferimento per la riscrittura del sito come progetto TypeScript
> self-hosted (Docker Compose, VPS propria, nessuna dipendenza da Supabase).
> Descrive lo stato attuale del sito in ogni suo componente, così da poter
> essere usato come specifica funzionale per il nuovo progetto.

---

## 1. Panoramica

**Nome**: Spada dello Spirito — `spadadellospirito.org`
**Tipo**: sito/PWA cattolico — raccolta di preghiere, Rosario guidato, Vangelo del giorno, ricerca biblica, area utente con preferiti e proposte.
**Stack attuale**: Astro 5 (output `static`, prerendering completo) + isole React 19 per l'interattività + Supabase (Postgres, Auth, Edge Functions) + Vercel per hosting/rewrite/headers.
**Lingua**: italiano, `lang="it"` fisso, nessuna i18n.

---

## 2. Stack tecnologico attuale

| Livello | Tecnologia | Note |
|---|---|---|
| Framework | Astro 5.3, `output: 'static'` | Nessun server Node in produzione: tutto è HTML statico + client JS |
| UI interattiva | React 19 via `@astrojs/react`, montato con direttive `client:load` / `client:visible` | Isole isolate, non un'app React SPA |
| Linguaggio | TypeScript 5.6 (strict, da `astro/tsconfigs/strict`) | Alias `@/*` → `src/*` non risulta effettivamente usato nel codice |
| Contenuti | Astro Content Collections (`src/content/prayers/*.md`) | Frontmatter validato con Zod |
| Backend/DB | Supabase (Postgres 15 gestito, Auth, Edge Functions Deno) | Nessun server proprio: tutta la logica “server” sta in RLS + 3 Edge Function |
| Hosting | Vercel (static) | Rewrite proxy per API esterne, security header, cache header |
| PWA | Service Worker custom scritto a mano (no Workbox), Web App Manifest | Cache-first per asset, network-first per pagine/HTML |
| SEO | `@astrojs/sitemap`, JSON-LD manuale per pagina, OG/Twitter meta, `robots.txt` | |
| Servizi esterni | Vatican News RSS (vangelo), `calapi.inadiutorium.cz` (calendario liturgico), mail-server esterno separato (invio email) | Nessuno di questi è sotto il controllo dell'app |

---

## 3. Struttura del repository

```
src/
  components/         # isole React
    BibleSearch.tsx
    CalendarioLiturgico.tsx
    FavoriteButton.tsx
    RosarioPlayer.tsx
  content/
    config.ts          # schema Zod della collection "prayers"
    prayers/*.md        # 20 file, una preghiera per file
  data/
    folders.ts          # metadati statici delle cartelle (titolo, icona, colore, descrizione, ordine)
    rosario.ts           # dati e generatore di sequenza del Santo Rosario
    prayers/README.md    # ⚠️ documentazione OBSOLETA (vedi §9)
  layouts/
    Layout.astro         # head/nav/footer condivisi, gestione auth-state via script client
  lib/
    supabase.ts          # client Supabase (istanziato solo se env presenti)
    gospelService.ts      # fetch + parsing RSS vangelo (lato client)
  pages/
    index.astro
    rosario.astro         # NB: non usa Layout.astro, ha un proprio <html> standalone
    vangelo.astro
    bibbia.astro
    cartella/[...slug].astro
    preghiera/[...slug].astro
    accedi.astro
    reset-password.astro
    nuova-password.astro
    profilo.astro
    preferiti.astro
    proposta.astro
    admin.astro
  styles/global.css       # ~1 file CSS globale, custom properties, glassmorphism
  utils/
    escHtml.ts             # escaping manuale per innerHTML
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

supabase/
  config.toml
  migrations/001_initial.sql
  migrations/002_drop_gospel_log.sql
  functions/
    delete-account/index.ts
    gospel-proxy/index.ts        # ⚠️ non chiamata dal client (vedi §9)
    send-daily-gospel/index.ts   # ⚠️ bug: invia ogni ora (vedi §9)

astro.config.mjs
vercel.json
package.json
.env.example
```

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
- Il corpo Markdown viene renderizzato con `Content` di Astro (basato su remark/rehype) — **supporta HTML grezzo inline** (es. `<table>` per le litanie a due colonne, vedi `litanie-sant-emidio.md`). Questo va tenuto a mente per il nuovo renderer Markdown: serve un parser che lasci passare HTML raw (non un semplice Markdown "safe mode").
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

**Per il nuovo progetto**: questo modello (cartella come stringa path-like + metadati decorativi separati dai contenuti) è semplice da riprodurre con una tabella `prayers` (id, title, subtitle, description, folder_path, order, body_markdown/html) + una tabella o file di configurazione `folders` (id, title, icon, color, description, order, parent implicito dal path).

---

## 5. Pagine (routing) — comportamento dettagliato

| Rotta | File | Auth richiesta | Prerendering | Descrizione |
|---|---|---|---|---|
| `/` | `pages/index.astro` | No | Statico | Hero, `CalendarioLiturgico` (React), griglia cartelle top-level con conteggio preghiere (incluse nidificate) |
| `/cartella/[...slug]` | `pages/cartella/[...slug].astro` | No | Statico (`getStaticPaths` genera **ogni** path di cartella/sottocartella derivato dai frontmatter) | Lista sottocartelle (con badge conteggio) + preghiere dirette, ordinate per `order` |
| `/preghiera/[...slug]` | `pages/preghiera/[...slug].astro` | No (bottone preferiti richiede login) | Statico (una pagina per ogni file `.md`) | Titolo/sottotitolo/descrizione, corpo Markdown renderizzato, breadcrumb JSON-LD, bottone "modalità lettura" (persistita in `localStorage`), bottone preferiti (React), Web Share API se disponibile |
| `/rosario` | `pages/rosario.astro` | No | Statico | **Non usa `Layout.astro`**: head HTML proprio, nessun header/nav — esperienza immersiva a schermo intero. Monta `RosarioPlayer` React |
| `/vangelo` | `pages/vangelo.astro` | No | Statico (contenuto caricato client-side) | Fetch RSS Vatican News via proxy `/api/rss/...`, mostra titolo/descrizione/link |
| `/bibbia` | `pages/bibbia.astro` | No | Statico | Monta `BibleSearch` React, che carica **l'intero** `bibbia.json` (5.1 MB) al mount |
| `/accedi` | `pages/accedi.astro` | — | Statico | Form login + registrazione (stesso form, due bottoni), toggle mostra/nascondi password, redirect se già loggato |
| `/reset-password` | `pages/reset-password.astro` | — | Statico | Invia email di reset (Supabase `resetPasswordForEmail`) |
| `/nuova-password` | `pages/nuova-password.astro` | Token di recovery nell'URL | Statico | Ascolta evento `PASSWORD_RECOVERY` di Supabase Auth, poi permette di impostare nuova password |
| `/profilo` | `pages/profilo.astro` | Sì (redirect a `/accedi` se non loggato) | Statico, dati caricati client-side | Mostra email, data iscrizione, toggle "ricevi vangelo via email" (scrive su `profiles.receive_daily_gospel`), logout, **elimina account** (chiama Edge Function `delete-account`) |
| `/preferiti` | `pages/preferiti.astro` | Soft (mostra CTA login se non autenticato) | Statico | Lista preferiti utente (join concettuale `favorites` → id preghiera, label derivata dallo slug) |
| `/proposta` | `pages/proposta.astro` | Sì (redirect se non loggato al submit) | Statico | Form libero (titolo, testo, note) → insert in `prayer_proposals` |
| `/admin` | `pages/admin.astro` | Sì + `profiles.is_admin = true` | Statico, `noindex` | Lista tutte le proposte (`prayer_proposals`), possibilità di eliminarle |

Note trasversali:
- Tutte le pagine "protette" sono **staticamente prerenderizzate senza dati utente incorporati**: il gate di autenticazione avviene interamente lato client dopo il mount (query a Supabase Auth), coerente con `output: 'static'`. Nessun leak di dati privati nell'HTML servito.
- `robots.txt` esclude esplicitamente le rotte autenticate/private dall'indicizzazione.

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

### 6.4 `FavoriteButton.tsx`
- Al mount: legge sessione Supabase; se loggato, verifica se `prayer_id` è già nei preferiti (`favorites` table).
- Toggle ottimistico (aggiorna lo stato subito, rollback se la query fallisce).
- Se non loggato, il click reindirizza a `/accedi`.

---

## 7. Layout condiviso (`Layout.astro`)

- Head: meta OG/Twitter completi, canonical, JSON-LD opzionale via prop, Google Fonts (Libre Baskerville + Inter) caricati in modo non bloccante (`media="print" onload="this.media='all'"` + `<noscript>` fallback), manifest PWA, meta iOS (`apple-mobile-web-app-*`).
- Header sticky con logo SVG (gradiente), menu hamburger responsive, nav con voci sempre visibili (Home, Rosario, Vangelo, Bibbia) e voci **auth-dependent** nascoste di default via `display:none` inline e mostrate da script client dopo aver controllato la sessione Supabase (Preferiti, Proponi, Admin-se-admin, Profilo/Esci oppure Accedi).
- Script client nel layout: toggle nav, chiusura su `Escape`/click esterno, stato auth (inclusa query `profiles.is_admin` per mostrare la voce Admin), logout, **registrazione service worker**.
- Footer minimale con credito autore.
- `rosario.astro` **duplica** questo scheletro HTML invece di riusare `Layout.astro` (per un'esperienza a schermo intero senza header) — da tenere a mente per evitare la stessa duplicazione nel riscritto (meglio un parametro tipo `hideNav` sul layout).

---

## 8. Stile

- Un solo file CSS globale (`global.css`), niente CSS-in-JS/Tailwind.
- Design "glassmorphism" chiaro: sfondo gradiente pastello fisso, card semitrasparenti con `backdrop-filter: blur`, ombre morbide, bordi arrotondati pill/`22px`.
- Palette dinamica tramite CSS custom properties `@property`-dichiarate (`--accent`, `--accent-d`, `--accent-l`) che vengono **animate** (`transition`) quando il tema liturgico cambia colore.
- Font: `Libre Baskerville` (serif, titoli/hero) + `Inter` (corpo/UI).
- Micro-animazioni diffuse: `fadeInUp`, `popIn`, `heartBeat` (bottone preferiti), `pulseRing`, stagger delay su elementi in lista.

---

## 9. Backend Supabase — schema e logica (da riprodurre self-hosted)

### 9.1 Tabelle (Postgres)

```sql
-- profiles: 1:1 con l'utente auth, creata da trigger alla registrazione
profiles (
  id uuid PK  → auth.users(id) on delete cascade,
  display_name text,
  receive_daily_gospel boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
)

-- favorites: preferiti utente
favorites (
  id uuid PK,
  user_id uuid → auth.users(id) on delete cascade,
  prayer_id text not null,       -- slug della preghiera, non FK verso una tabella prayers (i contenuti sono file, non righe)
  created_at timestamptz not null default now(),
  unique (user_id, prayer_id)
)

-- prayer_proposals: proposte di nuove preghiere inviate dagli utenti
prayer_proposals (
  id uuid PK,
  user_id uuid → auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  author_note text,
  suggested_folder text,
  status enum('pending','approved','rejected') not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()   -- auto-aggiornato da trigger
)

-- gospel_log: RIMOSSA nella migration 002 (vedi bug §9.4)
```

### 9.2 Row Level Security (RLS) — regole da riprodurre nel nuovo backend

| Tabella | Regola | Equivalente da implementare senza Supabase |
|---|---|---|
| `profiles` | select/update solo se `auth.uid() = id` | Nel nuovo backend: ogni endpoint `/api/profile` deve filtrare per l'utente autenticato dal JWT/sessione, mai per id passato dal client |
| `favorites` | tutte le operazioni solo se `auth.uid() = user_id` | Stesso principio: endpoint `/api/favorites` sempre scoped all'utente di sessione |
| `prayer_proposals` | insert/select proprio autore; **admin** ha policy `ALL` se `profiles.is_admin = true` (subquery) | Middleware "isAdmin" esplicito per le rotte di amministrazione, controllo autore per le rotte utente |

Trigger:
- `handle_new_user()`: alla creazione riga in `auth.users`, crea automaticamente la riga `profiles` corrispondente (con `display_name` da `raw_user_meta_data`). **Da riprodurre**: nel nuovo sistema di auth self-hosted, creare il profilo nella stessa transazione della registrazione (non un trigger DB se non si usa più lo schema `auth.users` di Supabase).
- `set_updated_at()`: aggiorna `updated_at` su ogni update di `prayer_proposals`.

### 9.3 Edge Functions (Deno) — da riscrivere come endpoint del proprio backend

| Funzione | JWT richiesto | Comportamento | Note per la riscrittura |
|---|---|---|---|
| `delete-account` | Sì | Verifica l'utente dal JWT (client anon), poi usa un client **service role** per `auth.admin.deleteUser(user.id)` | Nel nuovo sistema: endpoint `DELETE /api/account` autenticato, cancella l'utente + cascata (favorites, proposals) via `ON DELETE CASCADE` |
| `gospel-proxy` | No | Fetch RSS Vatican News, parsing regex di `<item>`, ritorna JSON `{title, description, pubDate, link}` | **Non è mai chiamata dal client attuale** (il client usa il rewrite `/api/rss` diretto) — codice morto. Nel nuovo progetto: unificare in un solo endpoint `/api/vangelo` lato backend che fa da proxy/cache al feed, evitando la duplicazione fetch+parsing presente sia qui sia in `send-daily-gospel` sia in `gospelService.ts` (client) |
| `send-daily-gospel` | No (cron interno) | Cron **ogni ora** (`0 * * * *`), fetch RSS, recupera tutti i `profiles` con `receive_daily_gospel = true`, per ciascuno recupera l'email da `auth.admin.getUserById`, invia una mail HTML tramite un mail-server esterno (`POST {MAIL_SERVER_URL}/api/mail/send` con API key + config SMTP nel body) | ⚠️ **Bug**: vedi §9.4 |

Variabili d'ambiente usate dalle funzioni (da mappare 1:1 nel nuovo backend):
```
SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
MAIL_SERVER_URL, MAIL_SERVER_KEY
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM
```

### 9.4 Bug noto da NON riportare nel riscritto

`send-daily-gospel` gira ogni ora via cron, ma la logica di deduplica ("invia solo se l'articolo è cambiato dall'ultimo invio") si basava sulla tabella `gospel_log`, **eliminata** dalla migration `002_drop_gospel_log.sql` senza sostituire il controllo. Il commento nel codice/config dichiara ancora il comportamento "una mail al giorno", ma di fatto **ogni utente iscritto riceve una mail identica ogni ora** (fino a 24/giorno). Nel nuovo sistema self-hosted, implementare esplicitamente:
- o un cron **giornaliero** (non orario) invece di orario, oppure
- mantenere il cron orario ma **reintrodurre** una tabella/riga "ultimo articolo inviato" (link o hash del contenuto) e inviare solo se diverso dall'ultimo registrato.

### 9.5 Env vars lato client (`.env`)

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_MAIL_SERVER_URL=...
VITE_MAIL_SERVER_KEY=...
```
Il client Supabase (`src/lib/supabase.ts`) è **nullable by design**: se le env non sono definite, `supabase` è `null` e i componenti che lo usano ritornano `null`/no-op invece di crashare — pattern utile da mantenere per permettere build/dev senza backend configurato.

---

## 10. Integrazioni esterne (da riprodurre o sostituire)

| Servizio | Uso | Endpoint | Come viene raggiunto oggi |
|---|---|---|---|
| Vatican News RSS | Vangelo del giorno | `https://www.vaticannews.va/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml` | Proxy Vite in dev (`astro.config.mjs`), rewrite Vercel in prod (`vercel.json`) su `/api/rss/*`; parsing XML lato client con `DOMParser` (`gospelService.ts`) |
| CalAPI (calendario liturgico) | Tempo liturgico, festività del giorno, colore liturgico | `http://calapi.inadiutorium.cz/api/v0/it/calendars/general-it/{y}/{m}/{d}` | Stesso pattern proxy (`/api/cal/*`), fetch diretto dal componente React, cache `localStorage` giornaliera |
| Mail server esterno | Invio email vangelo giornaliero | `{MAIL_SERVER_URL}/api/mail/send` (repo separata, non in questo progetto) | Chiamato solo dalla Edge Function `send-daily-gospel`, con API key + credenziali SMTP passate nel body ad ogni richiesta |

**Per il self-hosting**: tutti e tre possono restare esterni (sono API pubbliche/di terzi, non serve replicarli), ma nel nuovo backend conviene:
1. Centralizzare i due fetch RSS (client "vangelo del giorno" + cron email) in un'unica funzione di servizio con cache breve (evita di interrogare Vatican News ad ogni singola visita/utente).
2. Sostituire il mail-server esterno con invio diretto SMTP (es. Nodemailer) dal proprio backend, se si vuole eliminare quella dipendenza esterna.
3. Tenere gli stessi path `/api/rss/*` e `/api/cal/*` come reverse-proxy interni (nginx/traefik nel docker-compose) per non dover riscrivere il client.

---

## 11. PWA

### 11.1 `manifest.webmanifest`
Nome, short_name, `display: standalone`, `background_color: #0f0d1a`, `theme_color: #9B8DF8`, icone 192/512 (+ maskable).

### 11.2 `sw.js` (service worker scritto a mano, no Workbox)
- `CACHE_NAME = 'spada-v2'` — precache di app-shell (`/`, `/rosario`, `/vangelo`, `/bibbia`, `/offline.html`, icone, manifest) all'`install`.
- All'`activate`, elimina cache con nome diverso da quello corrente (versionamento manuale della cache).
- Strategie al `fetch`:
  - Richieste verso `*.supabase.co` → **network-first**, fallback cache.
  - Asset statici (`png|jpg|svg|ico|webp|css|js|woff2?`) → **cache-first**, popolamento cache in background.
  - Pagine HTML/altro same-origin → **network-first**, fallback cache, fallback finale `offline.html`.
  - Richieste cross-origin diverse da Supabase → ignorate (passano dritte alla rete).

Per il riscritto, se si cambia dominio backend (niente più `supabase.co`), va aggiornato il match dell'hostname nella strategia network-first (es. verso il proprio dominio API).

---

## 12. SEO

- `@astrojs/sitemap` genera `sitemap-index.xml` automaticamente da tutte le route statiche.
- JSON-LD per pagina: `WebSite` + `SearchAction` in home, `BreadcrumbList` su cartelle e preghiere, `WebPage` su `/rosario`.
- Meta OG/Twitter completi su ogni pagina (via `Layout.astro`), canonical dinamico da `Astro.url.pathname`.
- `noindex` esplicito sulle pagine private (profilo, preferiti, proposta, admin, reset/nuova password).
- `robots.txt` allinea i `Disallow` alle stesse rotte private.

---

## 13. Sicurezza — stato attuale

| Aspetto | Stato | Note |
|---|---|---|
| Header di sicurezza (`vercel.json`) | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` | **Manca una Content-Security-Policy** — da aggiungere nel riscritto, specialmente ora che si controlla anche il backend |
| RLS Postgres | Presente e corretta (§9.2) | Nel self-hosted questa protezione va **ricostruita esplicitamente a livello applicativo** (middleware/authorization per ogni endpoint), perché senza Supabase non c'è RLS automatica sul DB — a meno di abilitare RLS "a mano" su Postgres puro (possibile, ma va scritta interamente da zero) |
| Escaping output utente | `escHtml()` usato correttamente in admin/profilo/preferiti per contenuti da DB inseriti via `innerHTML` | Pattern manuale e fragile: nel riscritto conviene usare binding sicuro nativo del framework scelto (es. React `{}` che escapa di default) invece di stringhe `innerHTML` |
| Contenuto RSS esterno | `gospel.description` iniettato via `innerHTML` **senza** escaping in `vangelo.astro` | Scelta intenzionale per preservare il markup del feed, ma è superficie XSS se la fonte fosse compromessa; da valutare se sanitizzare (es. DOMPurify) nel riscritto |
| Autenticazione | Supabase Auth (JWT, email/password, reset via email) | Da sostituire con soluzione self-hosted: opzioni tipiche sono libreria auth custom (es. Lucia/Better-Auth con sessioni in Postgres) oppure servizio dedicato (Keycloak/Ory) in un container a parte nel compose |

---

## 14. Considerazioni per la riscrittura self-hosted (Docker Compose, no Supabase)

Mappatura concettuale delle responsabilità Supabase → componenti da introdurre:

| Responsabilità Supabase | Sostituto self-hosted proposto |
|---|---|
| Postgres gestito | Container `postgres` nel compose, con le stesse tabelle (§9.1) ma senza schema `auth` gestito da Supabase — va creata una tabella `users` propria |
| Supabase Auth (JWT, sessioni, email conferma/reset) | Backend proprio (Node/TS: Fastify/Express/Hono) che gestisce hashing password (argon2/bcrypt), emissione JWT o sessioni in DB, invio email di verifica/reset via SMTP diretto |
| RLS | Middleware di autorizzazione espliciti per ogni rotta API (scoping per `user_id` dal token, controllo `is_admin` per le rotte admin) |
| Edge Functions | Rotte dello stesso backend Node/TS (niente Deno separato necessario, ma se si preferisce isolarle: microservizio separato nel compose) |
| Cron (`send-daily-gospel`) | `node-cron` dentro il backend, oppure un container separato con `cron` di sistema che chiama un endpoint interno — **correggendo il bug del §9.4** |
| Content Collections (Markdown) | Se si vuole restare "file-based" si può mantenere identico (parser Markdown con supporto HTML raw); se si vuole gestione da pannello admin, migrare i 20 file in righe di una tabella `prayers` con colonna `body` (markdown o HTML pre-renderizzato) |
| `bibbia.json` (5.1 MB) | Da servire staticamente com'è (va bene anche self-hosted, magari con compressione gzip/brotli a livello di reverse proxy) oppure importare in una tabella `bible_verses` se si vuole interrogarla via SQL invece che client-side |
| Hosting/rewrite Vercel | Reverse proxy (nginx/Traefik) nel compose per: servire l'app, fare da proxy verso Vatican News/CalAPI, applicare gli stessi header di sicurezza (+ CSP) |

Servizi minimi ipotizzabili per il `docker-compose.yml` del nuovo progetto:
1. `app` — backend+frontend TypeScript (se si abbandona Astro static, va scelto se SSR proprio o build statica servita da nginx + API separata)
2. `postgres` — DB con volume persistente
3. `reverse-proxy` (nginx/Traefik/Caddy) — TLS, rewrite `/api/rss`, `/api/cal`, header di sicurezza, sitemap/robots
4. (opzionale) `mailer` — se si vuole isolare l'invio email invece di farlo inline nel backend

---

## 15. Elenco file sorgente (riferimento rapido)

```
src/pages/index.astro
src/pages/rosario.astro
src/pages/vangelo.astro
src/pages/bibbia.astro
src/pages/cartella/[...slug].astro
src/pages/preghiera/[...slug].astro
src/pages/accedi.astro
src/pages/reset-password.astro
src/pages/nuova-password.astro
src/pages/profilo.astro
src/pages/preferiti.astro
src/pages/proposta.astro
src/pages/admin.astro
src/layouts/Layout.astro
src/components/BibleSearch.tsx
src/components/CalendarioLiturgico.tsx
src/components/FavoriteButton.tsx
src/components/RosarioPlayer.tsx
src/lib/supabase.ts
src/lib/gospelService.ts
src/data/folders.ts
src/data/rosario.ts
src/utils/escHtml.ts
src/utils/parseBibleRef.ts
src/utils/useBibbia.ts
src/content/config.ts
src/content/prayers/*.md   (20 file, vedi tabella §4.2)
supabase/migrations/001_initial.sql
supabase/migrations/002_drop_gospel_log.sql
supabase/functions/delete-account/index.ts
supabase/functions/gospel-proxy/index.ts
supabase/functions/send-daily-gospel/index.ts
public/sw.js
public/manifest.webmanifest
public/offline.html
public/bibbia.json
public/robots.txt
astro.config.mjs
vercel.json
```
