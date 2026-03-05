import type { Folder } from '../../types'
import { p, h, it, v } from '../prayerBlocks'

export const quotidiane: Folder = {
  id: 'preghiere-quotidiane',
  title: 'Preghiere quotidiane',
  prayers: [
    {
      id: 'preghiera-del-mattino',
      title: 'Preghiera del mattino',
      blocks: [
        h('Atto di adorazione'),
        p('Ti adoro, mio Dio, e ti amo con tutto il cuore. Ti ringrazio di avermi creato, fatto cristiano e conservato in questa notte. Ti offro le azioni della giornata: fà che siano tutte secondo la tua volontà per la tua maggior gloria. Preservami dal peccato e da ogni male. La tua grazia sia sempre con me e con tutti i miei cari. Degnati, o Signore, di ricompensare con la vita eterna tutti quelli che mi fanno del bene nel tuo nome. Converti i peccatori, consola gli infermi, gli afflitti, i carcerati nelle loro tribolazioni. Agli agonizzanti che oggi morranno dona il Paradiso. Concedi il riposo eterno ai fedeli defunti. Amen.'),
        it('Padre, Ave e Gloria'),
        h('Atto di fede'),
        p('Mio Dio, perché sei verità infallibile, credo fermamente tutto quello che tu hai rivelato e la santa Chiesa ci propone a credere. Ed espressamente credo in te, unico vero Dio in tre Persone uguali e distinte, Padre, Figlio e Spirito Santo. E credo in Gesù Cristo, Figlio di Dio, incarnato e morto per noi, il quale darà a ciascuno, secondo i meriti, il premio o la pena eterna. Conforme a questa fede voglio sempre vivere. Signore, accresci la mia fede.'),
        h('Atto di speranza'),
        p('Mio Dio, spero dalla tua bontà, per le tue promesse e per i meriti di Gesú Cristo, nostro Salvatore, la vita eterna e le grazie necessarie per meritarla con le buone opere, che io debbo e voglio fare. Signore, che io possa goderti in eterno.'),
        h('Atto di carità'),
        p('Mio Dio, ti amo con tutto il cuore sopra ogni cosa, perché sei bene infinito e nostra eterna felicità; e per amor tuo amo il prossimo come me stesso, e perdono le offese ricevute. Signore, che io ti ami sempre piú.'),
        h("Consacrazione all'Immacolata"),
        p("Vergine Immacolata, Madre mia Maria, io rinnovo a te, oggi e per sempre, la consacrazione di tutto me stesso, perché tu disponga di me per il bene delle anime. Solo ti chiedo, o mia Regina e Madre della Chiesa, di cooperare fedelmente, come degno milite, alla tua missione, per l'avvento del regno di Gesú nel mondo. Ti offro pertanto, o Cuore Immacolato di Maria, le preghiere, le azioni e i sacrifici di questo giorno secondo le intenzioni suggerite."),
        it('«O Maria, concepita senza peccato, prega per noi che a te ricorriamo, e per quanti a te non ricorrono, in particolare per i nemici della santa Chiesa e per quelli che ti sono raccomandati.»'),
      ],
    },
    {
      id: 'preghiera-della-sera',
      title: 'Preghiera della sera',
      blocks: [
        h('Atto di adorazione'),
        p("Ti adoro, mio Dio e ti amo con tutto il cuore. Ti ringrazio di avermi creato, fatto cristiano e conservato in questo giorno. Perdonami il male oggi commesso e accetta a tua gloria il bene che ho compiuto. Ti affido in questa notte la mia anima e il mio corpo. Accetta i battiti del mio cuore come atti di amore per te. Allontana da me le insidie del demonio. I tuoi santi Angeli mi custodiscano nella pace. La tua grazia sia sempre con me e con tutti i miei cari. Agli agonizzanti che in questa notte morranno dona il Paradiso. Le anime dei defunti, per la tua misericordia, riposino in pace. Amen."),
        it('Padre, Ave e Gloria'),
        h('Al Sacro Cuore di Gesù'),
        p("O Cuore di Gesú, a te raccomando in questa notte l'anima e il corpo, affinché dolcemente in te riposino. E poiché durante il sonno non potró lodare il mio Dio, tu degnati di farlo per me, in modo che quanti saranno i battiti del mio cuore in questa notte, tante siano le lodi che tu darai alla SS. Trinità. Amen."),
        h('A Maria Santissima'),
        v(
          "Ti saluto, o Maria Immacolata, Figlia dell'eterno Padre, e ti prego di darmi la purità nei pensieri.",
          "Ti saluto, o Maria Immacolata, Madre dell'eterno Figlio, e ti prego di darmi la purità di parole.",
          "Ti saluto, o Maria Immacolata, Sposa dello Spirito Santo, e ti prego di darmi la purità nelle opere.",
        ),
        h('Esame di coscienza'),
        p('Illumina, o Signore, il mio cuore e la mia mente, perché possa conoscere bene i miei peccati e detestarli.'),
        it('Atto di dolore'),
        h('Invocazioni'),
        v(
          "Gesú, Giuseppe e Maria, vi dono il cuore e l'anima mia!",
          "Gesú, Giuseppe e Maria, assistetemi nell'ultima agonia!",
          "Gesú, Giuseppe e Maria, spiri in pace con voi l'anima mia!",
        ),
        h("L'eterno riposo"),
        p("L'eterno riposo dona loro, o Signore, e splenda ad essi la luce perpetua. Riposino in pace. Amen."),
      ],
    },
  ],
}
