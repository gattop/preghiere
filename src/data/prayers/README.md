# Come aggiungere preghiere

## Aggiungere una preghiera a una sezione esistente

Apri il file della sezione (es. `quotidiane.ts`) e aggiungi un oggetto nell'array `prayers[]`:

```ts
{
  id: 'la-mia-preghiera',   // kebab-case, deve essere UNICO in tutto il sito
  title: 'La mia preghiera',
  blocks: [
    h('Titolo sezione'),              // intestazione <h3>
    p('Testo paragrafo.'),            // paragrafo
    it('Testo in corsivo.'),          // corsivo / rubrica
    v('Riga 1', 'Riga 2', 'Riga 3'), // strofa poetica
    resp('Signore, pietà.', 'Signore, pietà.'), // risposta liturgica
    rep('Sia lodato.', 3),            // testo ripetuto x n
    div(),                            // separatore orizzontale
    lit([                             // litania (tabella due colonne)
      { prompt: 'Cristo, ascoltaci.', response: 'Cristo, ascoltaci.' },
    ]),
  ],
},
```

> L'import degli helper è già in cima ad ogni file di preghiere.

---

## Aggiungere un nuovo santo

Apri `src/data/prayers/santi.ts`, copia il blocco di un santo semplice come modello,
cambia `id`, `title` e `blocks`, poi aggiungi la variabile all'array `santi[]` in fondo al file.

---

## Aggiungere una nuova sezione di primo livello

1. Crea `src/data/prayers/<nome-sezione>.ts`
2. Esporta un oggetto `Folder` (usa `credo.ts` come modello)
3. Importalo in `src/data/prayers.ts` e aggiungilo a `prayerTree[]`

---

## Regola importante sugli id

- Devono essere **globalmente unici** in tutto il sito
- **Non cambiarli mai** dopo il deploy (diventano parte dell'URL)
- Formato: `kebab-case` — es. `preghiera-san-nome`, `novena-misericordia`
