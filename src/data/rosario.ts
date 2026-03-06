export const misteriPerGiorno: Record<number, 'gaudiosi' | 'dolorosi' | 'gloriosi' | 'luminosi'> = {
  1: 'gaudiosi',   // Lunedì
  2: 'dolorosi',   // Martedì
  3: 'gloriosi',   // Mercoledì
  4: 'luminosi',   // Giovedì
  5: 'dolorosi',   // Venerdì
  6: 'gaudiosi',   // Sabato
  0: 'gloriosi',   // Domenica
}

export interface Mistero { titolo: string; descrizione: string }
export interface GruppoMisteri { nome: string; lista: Mistero[] }

export const misteri: Record<string, GruppoMisteri> = {
  gaudiosi: {
    nome: 'Misteri Gaudiosi',
    lista: [
      {
        titolo: "L'Annunciazione dell'Angelo a Maria",
        descrizione: "Dal Vangelo secondo Luca (1,26-28.30-31) — L'angelo Gabriele fu mandato da Dio in una città della Galilea, chiamata Nàzaret, a una vergine, promessa sposa di un uomo della casa di Davide, di nome Giuseppe. La vergine si chiamava Maria. Entrando da lei, disse: «Rallégrati, piena di grazia: il Signore è con te». L'angelo le disse: «Non temere, Maria, perché hai trovato grazia presso Dio. Ed ecco, concepirai un figlio, lo darai alla luce e lo chiamerai Gesù».",
      },
      {
        titolo: 'La visita di Maria SS. a S. Elisabetta',
        descrizione: "Dal Vangelo secondo Luca (1,39-40.41b-42.45) — In quei giorni Maria si alzò e andò in fretta verso la regione montuosa, in una città di Giuda. Entrata nella casa di Zaccaria, salutò Elisabetta. Elisabetta fu colmata di Spirito Santo ed esclamò a gran voce: «Benedetta tu fra le donne e benedetto il frutto del tuo grembo! E beata colei che ha creduto nell'adempimento di ciò che il Signore le ha detto».",
      },
      {
        titolo: 'La nascita di Gesù',
        descrizione: "Dal Vangelo secondo Luca (2,1.4a.6-7) — In quei giorni un decreto di Cesare Augusto ordinò che si facesse il censimento di tutta la terra. Anche Giuseppe, dalla Galilea, dalla città di Nàzaret, salì in Giudea alla città di Davide chiamata Betlemme. Mentre si trovavano in quel luogo, si compirono per Maria i giorni del parto. Diede alla luce il suo figlio primogenito, lo avvolse in fasce e lo pose in una mangiatoia, perché per loro non c'era posto nell'alloggio.",
      },
      {
        titolo: 'La presentazione di Gesù al Tempio',
        descrizione: "Dal Vangelo secondo Luca (2,22b.25a.27-28) — Portarono il bambino a Gerusalemme per presentarlo al Signore. Ora a Gerusalemme c'era un uomo di nome Simeone. Mosso dallo Spirito, si recò al tempio e, mentre i genitori vi portavano il bambino Gesù, anch'egli lo accolse tra le braccia e benedisse Dio.",
      },
      {
        titolo: 'Il ritrovamento di Gesù nel Tempio',
        descrizione: "Dal Vangelo secondo Luca (2,41-42.46.48-49) — I genitori di Gesù si recavano ogni anno a Gerusalemme per la festa di Pasqua. Quando egli ebbe dodici anni, vi salirono secondo la consuetudine della festa. Dopo tre giorni lo trovarono nel tempio, seduto in mezzo ai maestri, mentre li ascoltava e li interrogava. Al vederlo restarono stupiti, e sua madre gli disse: «Figlio, perché ci hai fatto questo? Ecco, tuo padre e io, angosciati, ti cercavamo». Ed egli rispose loro: «Perché mi cercavate? Non sapevate che io devo occuparmi delle cose del Padre mio?».",
      },
    ],
  },
  dolorosi: {
    nome: 'Misteri Dolorosi',
    lista: [
      {
        titolo: "L'Agonia di Gesù nel Getsemani",
        descrizione: "Dal Vangelo secondo Luca (22,44) — Al monte degli ulivi Gesù, entrato nella lotta, pregava più intensamente, e il suo sudore diventò come gocce di sangue che cadono a terra.",
      },
      {
        titolo: 'La flagellazione di Gesù',
        descrizione: "Dal Vangelo secondo Matteo (27,26) — Pilato rimise in libertà per loro Barabba e, dopo aver fatto flagellare Gesù, lo consegnò perché fosse crocifisso.",
      },
      {
        titolo: "L'incoronazione di spine",
        descrizione: "Dal Vangelo secondo Matteo (27,28-29) — I soldati spogliarono Gesù, gli fecero indossare un mantello scarlatto, intrecciarono una corona di spine, gliela posero sul capo e gli misero una canna nella mano destra. Poi, inginocchiandosi davanti a lui, lo deridevano: «Salve, re dei Giudei!».",
      },
      {
        titolo: 'Il viaggio di Gesù al Calvario',
        descrizione: "Dal Vangelo secondo Giovanni (19,17-18) — Gesù, portando la croce, si avviò verso il luogo detto del Cranio, in ebraico Gòlgota, dove lo crocifissero e con lui altri due, uno da una parte e uno dall'altra, e Gesù in mezzo.",
      },
      {
        titolo: 'La morte di Gesù in croce',
        descrizione: "Dal Vangelo secondo Giovanni (19,25.30) — Stavano presso la croce di Gesù sua madre, la sorella di sua madre, Maria madre di Clèopa e Maria di Màgdala. Dopo aver preso l'aceto, Gesù disse: «È compiuto!». E, chinato il capo, consegnò lo spirito.",
      },
    ],
  },
  gloriosi: {
    nome: 'Misteri Gloriosi',
    lista: [
      {
        titolo: 'La Resurrezione di Gesù',
        descrizione: "Dal Vangelo secondo Luca (24,1-6a.9) — Il primo giorno della settimana, al mattino presto le donne si recarono al sepolcro. Trovarono che la pietra era stata rimossa dal sepolcro e, entrate, non trovarono il corpo del Signore Gesù. Le donne, impaurite, tenevano il volto chinato a terra, ma quelli dissero loro: «Perché cercate tra i morti colui che è vivo? Non è qui, è risorto». Ed esse annunciarono tutto questo agli Undici e a tutti gli altri.",
      },
      {
        titolo: "L'Ascensione di Gesù al Cielo",
        descrizione: "Dal Vangelo secondo Marco (16,19-20) — Il Signore Gesù, dopo aver parlato con loro, fu elevato in cielo e sedette alla destra di Dio. Allora essi partirono e predicarono dappertutto, mentre il Signore agiva insieme con loro e confermava la Parola con i segni che la accompagnavano.",
      },
      {
        titolo: 'La discesa dello Spirito Santo',
        descrizione: "Dal Vangelo secondo Giovanni (20,19.22) — La sera di quel giorno, il primo della settimana, mentre erano chiuse le porte del luogo dove si trovavano i discepoli per timore dei Giudei, venne Gesù, stette in mezzo e disse loro: «Pace a voi!». Detto questo, soffiò e disse loro: «Ricevete lo Spirito Santo».",
      },
      {
        titolo: "L'Assunzione di Maria in Cielo",
        descrizione: "Dal Vangelo secondo Luca (1,46-50) — Allora Maria disse: «L'anima mia magnifica il Signore e il mio spirito esulta in Dio, mio salvatore, perché ha guardato l'umiltà della sua serva. D'ora in poi tutte le generazioni mi chiameranno beata. Grandi cose ha fatto per me l'Onnipotente e Santo è il suo nome; di generazione in generazione la sua misericordia per quelli che lo temono».",
      },
      {
        titolo: "L'incoronazione di Maria Regina del Cielo",
        descrizione: "Dal libro dell'Apocalisse (12,1-2.5) — Un segno grandioso apparve nel cielo: una donna vestita di sole, con la luna sotto i suoi piedi e, sul capo, una corona di dodici stelle. Era incinta, e gridava per le doglie e il travaglio del parto. Essa partorì un figlio maschio, destinato a governare tutte le nazioni.",
      },
    ],
  },
  luminosi: {
    nome: 'Misteri Luminosi',
    lista: [
      {
        titolo: 'Il Battesimo di Gesù nel Giordano',
        descrizione: "Dal Vangelo secondo Matteo (3,16-17) — Appena battezzato, Gesù uscì dall'acqua: ed ecco, si aprirono i cieli ed egli vide lo Spirito di Dio discendere come una colomba e venire sopra di lui. Ed ecco una voce dal cielo che diceva: «Questi è il Figlio mio, l'amato: in lui ho posto il mio compiacimento».",
      },
      {
        titolo: 'Il miracolo di Gesù alle nozze di Cana',
        descrizione: "Dal Vangelo secondo Giovanni (2,1-5) — In quel tempo vi fu una festa di nozze a Cana di Galilea e c'era la madre di Gesù. Fu invitato alle nozze anche Gesù con i suoi discepoli. Venuto a mancare il vino, la madre di Gesù gli disse: «Non hanno vino». E Gesù le rispose: «Donna, che vuoi da me? Non è ancora giunta la mia ora». Sua madre disse ai servitori: «Qualsiasi cosa vi dica, fatela».",
      },
      {
        titolo: "L'annuncio del Regno di Dio",
        descrizione: "Dal Vangelo secondo Marco (1,14-15) — Dopo che Giovanni fu arrestato, Gesù andò nella Galilea, proclamando il vangelo di Dio, e diceva: «Il tempo è compiuto e il regno di Dio è vicino; convertitevi e credete nel Vangelo».",
      },
      {
        titolo: 'La Trasfigurazione di Gesù',
        descrizione: "Dal Vangelo secondo Matteo (17,1-2) — Gesù prese con sé Pietro, Giacomo e Giovanni suo fratello e li condusse in disparte, su un alto monte. E fu trasfigurato davanti a loro: il suo volto brillò come il sole e le sue vesti divennero candide come la luce.",
      },
      {
        titolo: "L'istituzione dell'Eucaristia",
        descrizione: "Dal Vangelo secondo Matteo (26,26) — Ora, mentre mangiavano, Gesù prese il pane, recitò la benedizione, lo spezzò e, mentre lo dava ai discepoli, disse: «Prendete, mangiate: questo è il mio corpo».",
      },
    ],
  },
}

export const preghiereRosario = {
  segnoDelCroce: 'Nel nome del Padre, del Figlio e dello Spirito Santo. Amen.',
  credoApostolico: 'Credo in Dio, Padre onnipotente...',
  padreNostro: 'Padre nostro che sei nei cieli...',
  aveMaria: 'Ave, o Maria, piena di grazia...',
  gloria: 'Gloria al Padre e al Figlio e allo Spirito Santo...',
  preghieraFatima: 'Gesù mio, perdona le nostre colpe...',
  salveRegina: 'Salve, Regina, Madre di misericordia...',
}

export interface RosarioStep {
  tipo: string
  testo: string
  descrizione?: string
  aveIniziale?: number
  decina?: number
  aveNumber?: number
  misteroIndex?: number
}

export function buildRosarioSequence(dayOfWeek: number): RosarioStep[] {
  const chiave = misteriPerGiorno[dayOfWeek]
  const misteriDelGiorno = misteri[chiave]
  const p = preghiereRosario
  const seq: RosarioStep[] = [
    { tipo: 'segnoDelCroce', testo: p.segnoDelCroce },
    { tipo: 'credo', testo: p.credoApostolico },
    { tipo: 'padreNostro', testo: p.padreNostro },
    { tipo: 'aveMaria', testo: p.aveMaria, descrizione: '1ª Ave Maria', aveIniziale: 1 },
    { tipo: 'aveMaria', testo: p.aveMaria, descrizione: '2ª Ave Maria', aveIniziale: 2 },
    { tipo: 'aveMaria', testo: p.aveMaria, descrizione: '3ª Ave Maria', aveIniziale: 3 },
    { tipo: 'gloria', testo: p.gloria },
  ]
  for (let d = 0; d < 5; d++) {
    seq.push({ tipo: 'mistero', testo: `${d + 1}° Mistero: ${misteriDelGiorno.lista[d].titolo}`, misteroIndex: d })
    seq.push({ tipo: 'descrizione', testo: misteriDelGiorno.lista[d].descrizione, misteroIndex: d })
    seq.push({ tipo: 'padreNostro', testo: p.padreNostro })
    for (let a = 0; a < 10; a++) seq.push({ tipo: 'aveMaria', testo: p.aveMaria, decina: d, aveNumber: a + 1 })
    seq.push({ tipo: 'gloria', testo: p.gloria })
    seq.push({ tipo: 'fatima', testo: p.preghieraFatima })
  }
  seq.push({ tipo: 'salveRegina', testo: p.salveRegina })
  return seq
}

