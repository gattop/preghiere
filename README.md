# ✝ Spada dello Spirito

> *"La fede è fondamento di ciò che si spera, prova di ciò che non si vede."*

Una web app cattolica per pregare ogni giorno: **Santo Rosario guidato**, **Vangelo del giorno**, **Bibbia CEI**, litanie e una ricca raccolta di preghiere tradizionali della fede cristiana.

🔗 **Sito live:** [spadadellospirito.org](https://spadadellospirito.org/)

Costruita con [Astro](https://astro.build) per essere veloce, leggera e piacevole da usare anche da mobile.

## ✨ Funzionalità

- 🕊️ **Santo Rosario guidato** — recita interattiva dei misteri del Rosario
- 📖 **Vangelo del giorno** — lettura quotidiana sempre aggiornata
- 📜 **Bibbia CEI** — testo integrale della Bibbia secondo la traduzione CEI
- 🙏 **Raccolta di preghiere** organizzate per categoria, tra cui:
  - Preghiere quotidiane
  - Spirito Santo
  - Sacro Cuore di Gesù
  - Santi
  - Credo
- 💬 **Vangelo del giorno via WhatsApp** — scrivi "vangelo oggi" al numero +39 375 112 2880
- ⚡ **Veloce e leggero** — grazie all'architettura a isole di Astro, il sito carica solo il JS strettamente necessario, senza alcun backend/account richiesto

## 🛠️ Tecnologie

- [Astro](https://astro.build) — framework principale
- Sito interamente statico, nessun account utente/backend
- HTML / CSS / JavaScript

## 📦 Installazione

Clona il repository e installa le dipendenze:

```bash
git clone https://github.com/gitpippihub/preghiere.git
cd preghiere
npm install
```

## 💻 Sviluppo locale

Avvia il server di sviluppo:

```bash
npm run dev
```

Il sito sarà disponibile su `http://localhost:4321`.

## 🏗️ Build di produzione

```bash
npm run build
```

I file generati saranno nella cartella `dist/`, pronti per il deploy.

Per vedere in anteprima la build:

```bash
npm run preview
```

## 📁 Struttura del progetto

```text
/
├── public/          # asset statici (immagini, favicon, ecc.)
├── src/
│   ├── components/  # componenti riutilizzabili
│   ├── layouts/     # layout delle pagine
│   ├── pages/       # pagine del sito (routing automatico Astro)
│   │   ├── rosario/
│   │   ├── vangelo/
│   │   ├── bibbia/
│   │   └── cartella/    # categorie di preghiere
│   └── content/     # contenuti (preghiere, letture, ecc.)
├── astro.config.mjs
└── package.json
```

> La struttura può variare leggermente in base all'organizzazione effettiva del progetto: aggiorna questa sezione se necessario.

## 🤝 Contribuire

I contributi sono benvenuti! Se vuoi aggiungere una preghiera, correggere un testo o proporre una nuova funzionalità:

1. Fai un fork del progetto
2. Crea un branch (`git checkout -b feature/nome-feature`)
3. Fai commit delle modifiche (`git commit -m 'Aggiunta nuova preghiera'`)
4. Fai push sul branch (`git push origin feature/nome-feature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza **[GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE)**.

In sintesi: sei libero di usare, modificare e ridistribuire il codice, anche per far girare una tua istanza del sito — ma se lo fai (anche solo offrendolo come servizio via rete, senza distribuire alcun file), sei tenuto a rendere disponibile il codice sorgente completo, comprese le tue modifiche, con la stessa licenza AGPL-3.0.

## 🙏 Ringraziamenti

Un piccolo strumento pensato per accompagnare la preghiera quotidiana, a gloria di Dio e a beneficio di chi lo userà.

---

Web App Cattolica by [kyrie](https://bsky.app/profile/kyrie.tngl.sh)
(readme AI generated)
