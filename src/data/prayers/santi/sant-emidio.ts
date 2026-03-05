import type { Folder } from '../../../types'
import { p, it, v, resp, lit } from '../../prayerBlocks'

export const santEmidio: Folder = {
  id: 'sant-emidio',
  title: "Sant'Emidio",
  description: 'Vescovo e martire, protettore contro il terremoto. Festa il 5 agosto.',
  prayers: [],
  subfolders: [
    {
      id: 'triduo-sant-emidio',
      title: "Triduo a Sant'Emidio",
      description: 'di Fratel Cosimo. In preparazione alla festa del 5 agosto.',
      prayers: [
        {
          id: 'triduo-emidio-giorno-1',
          title: "Triduo a Sant'Emidio — Giorno 1",
          blocks: [
            it('Nel nome del Padre, del Figlio e dello Spirito Santo. Amen.'),
            p("O ammirabile ed eroico S. Emidio, nostro celeste patrono e protettore, atleta e messaggero del Signore, tu che ti sei nutrito della Parola di Dio e ti sei fatto apostolo di pace e di speranza, e hai portato il lieto annunzio ai poveri, e hai parlato a tutti con un linguaggio di amore e di bontà, rendici partecipi, te ne preghiamo, di una scintilla di quell'ardente carità che hai avuto tu, e fa che anche noi possiamo avere la forza dinamica di annunciare il Vangelo e proclamare senza vergogna il glorioso e Santo Nome di Gesù Cristo. Aiutaci ad amare Dio con tutto il nostro cuore e a servirlo con carità e amore nei nostri fratelli, affinché praticando il nostro servizio cristiano, possiamo indirizzare i cuori verso Dio, il solo ed unico supremo bene."),
            p('Amen.'),
            it('Padre, Ave e Gloria.'),
            resp("Sant'Emidio, vescovo e martire,", 'prega per noi.'),
            v(
              'Sant Emidio Protettore',
              'sul tuo popolo devoto',
              'col tuo sguardo di Pastore',
              "veglia sempre in tutte l'ore.",
            ),
          ],
        },
        {
          id: 'triduo-emidio-giorno-2',
          title: "Triduo a Sant'Emidio — Giorno 2",
          blocks: [
            it('Nel nome del Padre, del Figlio e dello Spirito Santo. Amen.'),
            p("O potente e vittorioso martire S. Emidio, docile strumento di grazia e di sapienza, vincitore degli idoli e dei demoni, tu che hai debellato le potenze del male con l'invocazione del Santissimo Nome di Gesù Cristo, fa che anche noi con l'ausilio del tuo soccorso possiamo vincere la tirannia del demonio, le lotte, le battaglie e le passioni ingannatrici di questo mondo. Tu che sei stato eletto come particolare protettore contro il terremoto, e la tua vita è stata illuminata dal potere soprannaturale di preservarci dalle forze della natura, dalle guerre, dalle pestilenze e dalla carestia, alla tua intercessione affidiamo la tutela della nostra vita e ti chiediamo di ottenerci da Dio grazia, protezione e pace per la nostra patria. La nostra tanta fervorosa fiducia nel tuo potente patrocinio è proprio giustificata dalla così evidente potenza nel dominare le occulte forze della natura, e qualunque altra calamità."),
            p('Amen.'),
            it('Padre, Ave e Gloria.'),
            resp("Sant'Emidio, vescovo e martire,", 'prega per noi.'),
            v(
              'Il tuo braccio taumaturgo',
              'tieni alzato su di noi',
              'ci proteggi da ogni male',
              'e da ogni altra avversità.',
            ),
          ],
        },
        {
          id: 'triduo-emidio-giorno-3',
          title: "Triduo a Sant'Emidio — Giorno 3",
          blocks: [
            it('Nel nome del Padre, del Figlio e dello Spirito Santo. Amen.'),
            p("O illustre ed eccelso martire S. Emidio, araldo di Dio e testimone della verità, astro fulgido di luce celestiale, tu che sei stato dotato di sublime eroismo per affrontare il dolore, le tante fatiche apostoliche, la persecuzione, le prepotenze, le calunnie e perfino il crudele martirio, e con spirito di eroica fede hai sopportato tutto con docilità per amor di Dio, rimanendo sempre saldo nella fede cristiana, fa che anche noi sostenuti da te, possiamo testimoniare la nostra fede con le opere. Il tuo coraggioso e luminoso esempio sia per ciascuno di noi oggi un sollecito richiamo non solo ad un'autentica fede, ma anche un invito a vivere nella vera santità, affinché una volta terminato il nostro combattimento terreno, per i tuoi meriti possiamo ottenere dal Signore di poter essere un giorno accolti nel regno dei cieli insieme a te, e far parte per l'eternità della Santa Famiglia di Dio: Gesù, Giuseppe e Maria."),
            p('Amen.'),
            it('Padre, Ave e Gloria.'),
            resp("Sant'Emidio, vescovo e martire,", 'prega per noi.'),
            v(
              'Santo Martire glorioso',
              'tutti a Te noi ci affidiamo',
              'e su tutti noi invochiamo',
              'la tua santa benedizione.',
            ),
          ],
        },
        {
          id: 'litanie-sant-emidio',
          title: 'Litanie a S. Emidio, vescovo e martire',
          blocks: [
            lit([
              { prompt: 'Signore, pietà.', response: 'Signore, pietà.' },
              { prompt: 'Cristo, pietà.', response: 'Cristo, pietà.' },
              { prompt: 'Signore, pietà.', response: 'Signore, pietà.' },
              { prompt: 'Cristo, ascoltaci.', response: 'Cristo, ascoltaci.' },
              { prompt: 'Cristo, esaudiscici.', response: 'Cristo, esaudiscici.' },
              { prompt: 'Padre del cielo, che sei Dio.', response: 'Abbi pietà di noi.' },
              { prompt: 'Figlio, Redentore del mondo, che sei Dio.', response: 'Abbi pietà di noi.' },
              { prompt: 'Spirito Santo, che sei Dio.', response: 'Abbi pietà di noi.' },
              { prompt: 'Santa Trinità, unico Dio.', response: 'Abbi pietà di noi.' },
              { prompt: "Sant'Emidio, apostolo invincibile della fede.", response: 'Prega per noi.' },
              { prompt: "Sant'Emidio, araldo di Dio.", response: 'Prega per noi.' },
              { prompt: "Sant'Emidio, insigne martire di Gesù Cristo.", response: 'Prega per noi.' },
              { prompt: "Sant'Emidio, grande taumaturgo.", response: 'Prega per noi.' },
              { prompt: "Sant'Emidio, difensore della fede.", response: 'Prega per noi.' },
              { prompt: "Sant'Emidio, protettore contro il terremoto.", response: 'Prega per noi.' },
              { prompt: "Sant'Emidio, nostro potente patrono.", response: 'Prega per noi.' },
              { prompt: 'Da ogni pericolo di terremoto.', response: 'Liberaci, o Signore.' },
              { prompt: 'Da ogni calamità naturale.', response: 'Liberaci, o Signore.' },
              { prompt: 'Agnello di Dio, che togli i peccati del mondo.', response: 'Perdonaci, o Signore.' },
              { prompt: 'Agnello di Dio, che togli i peccati del mondo.', response: 'Esaudiscici, o Signore.' },
              { prompt: 'Agnello di Dio, che togli i peccati del mondo.', response: 'Abbi pietà di noi.' },
            ]),
          ],
        },
      ],
    },
    {
      id: 'preghiera-sant-emidio',
      title: "Preghiera a Sant'Emidio",
      subtitle: 'di Fratel Cosimo',
      prayers: [
        {
          id: 'preghiera-sant-emidio-principale',
          title: "Preghiera a Sant'Emidio",
          subtitle: 'di Fratel Cosimo',
          blocks: [
            p("O glorioso e amato S. Emidio, invitto martire e apostolo invincibile della fede, nostro particolare protettore, tu che con ardente zelo propagasti il messaggio del Vangelo di Gesù Cristo, ascolta oggi la nostra preghiera che con tanta fiducia a te rivolgiamo."),
            p("O grande taumaturgo e protettore potente, intercedi per noi presso il trono del Dio altissimo, affinché in questo tempo di poca fede e di crudele malvagità, prendendo esempio da te, possiamo testimoniare con eroico coraggio e perfino con la propria vita la nostra fede. Ottienici con la tua valida ed efficace intercessione quell'amore ardente verso Gesù Cristo e la Vergine Santissima, di cui il tuo cuore fu pieno ed infiammato. Aiutaci a conformare sempre più la nostra vita, secondo la volontà del Signore e impetraci dal suo cuore paterno e misericordioso, di perseverare santamente nella preghiera e nel servizio di Dio e dei fratelli."),
            p("O insigne e valoroso martire di Cristo, in te noi confidiamo e riponiamo ogni nostra speranza, e con piena fiducia ti chiediamo, anche se indegni e immeritevoli, di accompagnarci sempre con il tuo patrocinio nell'aspro cammino di questo esilio terreno, soccorrici nelle prove della vita affinché non ci lasceremo mai vincere dalle difficoltà e dallo scoraggiamento."),
            p("O glorioso santo martire Emidio, ti chiediamo ancora supplichevoli di estendere la tua protezione e la tua benedizione su tutti noi, sulle nostre famiglie, le nostre città, e per il tuo atroce martirio di liberarci dall'orrendo flagello del terremoto e da qualunque altro male e pericolo."),
            p("O amabilissimo S. Emidio, degnati di accogliere la nostra preghiera e donaci di vivere una vita pacifica e serena, in attesa della chiamata del Signore, e quando sarà giunto il momento estremo, sorretti da te andremo con gioia incontro al Signore nel Regno dei Cieli."),
            p('Amen.'),
            resp('S. Emidio, vescovo e martire,', 'prega sempre per noi.'),
          ],
        },
      ],
    },
  ],
}
