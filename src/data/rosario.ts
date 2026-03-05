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
      { titolo: "L'Annunciazione dell'Angelo a Maria", descrizione: "L'angelo Gabriele annuncia a Maria che sarà Madre di Dio. Maria risponde con il suo «Eccomi, sono la serva del Signore»." },
      { titolo: 'La visita di Maria SS. a S. Elisabetta', descrizione: 'Maria si affretta da Elisabetta. Al suo saluto, Giovanni esulta nel grembo e Elisabetta, piena di Spirito Santo, proclama: «Benedetta tu fra le donne e benedetto il frutto del tuo grembo!»' },
      { titolo: 'La nascita di Gesù', descrizione: "Gesù nasce a Betlemme in una mangiatoia. Gli angeli annunciano la buona novella ai pastori: «Vi annuncio una grande gioia: oggi è nato per voi un Salvatore»." },
      { titolo: 'La presentazione di Gesù al Tempio', descrizione: 'Maria e Giuseppe presentano Gesù al Tempio. Simeone, prendendo il Bambino tra le braccia, loda Dio; la profetessa Anna ringrazia il Signore.' },
      { titolo: 'Il ritrovamento di Gesù nel Tempio', descrizione: 'Gesù dodicenne rimane nel Tempio a discutere con i dottori della Legge. Maria e Giuseppe lo trovano dopo tre giorni. «Non sapevate che devo occuparmi delle cose del Padre mio?»' },
    ],
  },
  dolorosi: {
    nome: 'Misteri Dolorosi',
    lista: [
      { titolo: "L'Agonia di Gesù nel Getsemani", descrizione: 'Gesù agonizza nell\'orto degli ulivi, sudando sangue, mentre i discepoli dormono. «Padre mio, se è possibile, passi da me questo calice. Però non come voglio io, ma come vuoi tu».' },
      { titolo: 'La flagellazione di Gesù', descrizione: 'Gesù, consegnato a Pilato, è legato alla colonna e flagellato spietatamente dai soldati. Offre la sua sofferenza per la nostra guarigione.' },
      { titolo: "L'incoronazione di Spine", descrizione: 'I soldati intrecciano una corona di spine, la conficcano sul capo di Gesù, gli mettono un manto rosso e lo scherniscono: «Salve, re dei Giudei!»' },
      { titolo: 'Il viaggio di Gesù al Calvario', descrizione: 'Gesù porta la croce verso il Golgota. Cade tre volte, incontra sua Madre, il Cireneo lo aiuta. Ogni passo è offerto per la nostra salvezza.' },
      { titolo: 'La morte di Gesù in croce', descrizione: 'Gesù muore sulla croce dopo tre ore di agonia, tra due ladroni, alla presenza di Maria e Giovanni. Le sue ultime parole: «Tutto è compiuto». Il velo del Tempio si squarcia.' },
    ],
  },
  gloriosi: {
    nome: 'Misteri Gloriosi',
    lista: [
      { titolo: 'La Resurrezione di Gesù', descrizione: 'Il terzo giorno Gesù risorge glorioso. Le pie donne trovano il sepolcro vuoto. L\'angelo annuncia: «Non è qui, è risorto». Gesù appare a Maria Maddalena e poi agli Apostoli.' },
      { titolo: "L'Ascensione di Gesù al Cielo", descrizione: 'Quaranta giorni dopo la Resurrezione, Gesù ascende al Cielo davanti agli Apostoli riuniti sul Monte degli Ulivi, promettendo di inviare lo Spirito Santo.' },
      { titolo: 'La discesa dello Spirito Santo', descrizione: 'Nel giorno di Pentecoste, lo Spirito Santo scende sugli Apostoli e sulla Vergine Maria come lingue di fuoco. Nasce la Chiesa, e Pietro predica davanti a tremila persone.' },
      { titolo: "L'Assunzione di Maria in Cielo", descrizione: 'Al termine della sua vita terrena, Maria viene assunta in anima e corpo nella gloria del Cielo, anticipando la risurrezione della carne promessa a tutti i fedeli.' },
      { titolo: "L'incoronazione di Maria", descrizione: 'Maria viene incoronata Regina del Cielo e della terra, degli angeli e dei santi. Ella intercede per noi come Avvocata e Madre della misericordia.' },
    ],
  },
  luminosi: {
    nome: 'Misteri Luminosi',
    lista: [
      { titolo: 'Il Battesimo di Gesù nel Giordano', descrizione: 'Gesù è battezzato da Giovanni nel fiume Giordano. Il Padre proclama dal cielo: «Questi è il Figlio mio prediletto, nel quale mi sono compiaciuto», e lo Spirito scende su di lui come una colomba.' },
      { titolo: 'Il miracolo di Gesù alle nozze di Cana', descrizione: 'Su intercessione di Maria — «Fate quello che vi dirà» — Gesù compie il suo primo miracolo trasformando l\'acqua in vino. I discepoli credettero in lui.' },
      { titolo: "L'annuncio del Regno di Dio", descrizione: 'Gesù percorre la Galilea predicando: «Convertitevi e credete al Vangelo». Chiama i discepoli, li invia in missione e invita tutti alla sequela.' },
      { titolo: 'La Trasfigurazione di Gesù', descrizione: 'Sul monte Tabor Gesù si trasfigura: il suo volto risplende come il sole e le sue vesti diventano candide come la neve. Il Padre dice: «Questi è il Figlio mio prediletto, ascoltatelo».' },
      { titolo: "L'istituzione dell'Eucaristia", descrizione: "All'Ultima Cena, Gesù prende il pane e il vino e dice: «Questo è il mio corpo... questo è il mio sangue». Istituisce l'Eucaristia e il sacerdozio ministeriale." },
    ],
  },
}

export const preghiereRosario = {
  segnoDelCroce: 'Nel nome del Padre, del Figlio e dello Spirito Santo. Amen.',
  credoApostolico: "Io credo in Dio, Padre onnipotente, Creatore del cielo e della terra. E in Gesù Cristo, Suo unico Figlio, nostro Signore, il quale fu concepito di Spirito Santo, nacque da Maria Vergine, patì sotto Ponzio Pilato, fu crocifisso, morì e fu sepolto; discese agli inferi; il terzo giorno risuscitò da morte; salì al cielo, siede alla destra di Dio Padre onnipotente: di là verrà a giudicare i vivi e i morti. Credo nello Spirito Santo, la santa Chiesa cattolica, la comunione dei santi, la remissione dei peccati, la risurrezione della carne, la vita eterna. Amen.",
  padreNostro: "Padre nostro che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà come in cielo così in terra. Dacci oggi il nostro pane quotidiano, e rimetti a noi i nostri debiti come noi li rimettiamo ai nostri debitori, e non ci indurre in tentazione, ma liberaci dal male. Amen.",
  aveMaria: "Ave, o Maria, piena di grazia, il Signore è con te. Tu sei benedetta fra le donne e benedetto è il frutto del tuo seno, Gesù. Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell'ora della nostra morte. Amen.",
  gloria: "Gloria al Padre e al Figlio e allo Spirito Santo. Come era nel principio, e ora e sempre nei secoli dei secoli. Amen.",
  preghieraFatima: "Gesù mio, perdona le nostre colpe, preservaci dal fuoco dell'inferno, porta in cielo tutte le anime, specialmente le più bisognose della tua misericordia.",
  salveRegina: "Salve, Regina, Madre di misericordia, vita, dolcezza e speranza nostra, salve. A te ricorriamo, esuli figli di Eva; a te sospiriamo, gementi e piangenti in questa valle di lacrime. Orsù dunque, avvocata nostra, rivolgi a noi gli occhi tuoi misericordiosi. E mostraci, dopo questo esilio, Gesù, il frutto benedetto del tuo seno. O clemente, o pia, o dolce Vergine Maria.",
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

