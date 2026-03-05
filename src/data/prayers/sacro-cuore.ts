import type { Folder } from '../../types'
import { p, it, div } from '../prayerBlocks'

export const sacroCuore: Folder = {
  id: 'sacro-cuore',
  title: 'Sacro Cuore di Gesù',
  prayers: [
    {
      id: 'consacrazione-sacro-cuore',
      title: 'Consacrazione al Sacro Cuore di Gesù',
      subtitle: 'di Santa Margherita Maria Alacoque',
      blocks: [
        p("Io (nome e cognome), dono e consacro al Cuore adorabile di nostro Signore Gesù Cristo la mia persona e la mia vita, le mie azioni, pene e sofferenze, per non voler più servirmi d'alcuna parte del mio essere, che per onorarlo, amarlo e glorificarlo. È questa la mia volontà irrevocabile: essere tutto suo e fare ogni cosa per suo amore, rinunciando di cuore a tutto ciò che potrebbe dispiacergli. Ti scelgo, o Sacro Cuore, come unico oggetto del mio amore, come custode della mia vita, pegno della mia salvezza, rimedio della mia fragilità e incostanza, riparatore di tutte le colpe della mia vita e rifugio sicuro nell'ora della mia morte. Sii, o Cuore di bontà, la mia giustificazione presso Dio, tuo Padre, e allontana da me la sua giusta indignazione. O Cuore amoroso, pongo tutta la mia fiducia in te, perché temo tutto dalla mia malizia e debolezza, ma spero tutto dalla tua bontà. Consuma, dunque, in me quanto può dispiacerti o resisterti; il tuo puro amore s'imprima profondamente nel mio cuore, in modo che non ti possa più scordare o essere da te separato. Ti chiedo, per la tua bontà, che il mio nome sia scritto in te, poiché voglio concretizzare tutta la mia felicità e la mia gloria nel vivere e morire come tuo servo."),
        p('Amen.'),
      ],
    },
    {
      id: 'coroncina-sacro-cuore',
      title: 'Coroncina al Sacro Cuore di Gesù',
      subtitle: 'di San Pio da Pietrelcina',
      blocks: [
        p('O mio Gesù, che hai detto: «In verità vi dico, chiedete ed otterrete, cercate e troverete, picchiate e vi sarà aperto!», ecco che io picchio, io cerco, io chiedo la grazia…'),
        it('Padre, Ave e Gloria.'),
        p('Sacro Cuore di Gesù, confido e spero in te.'),
        div(),
        p('O mio Gesù, che hai detto: «In verità vi dico, qualunque cosa chiederete al Padre mio nel mio nome, Egli ve la concederà!», ecco che al Padre tuo, nel tuo nome, io chiedo la grazia…'),
        it('Padre, Ave e Gloria.'),
        p('Sacro Cuore di Gesù, confido e spero in te.'),
        div(),
        p("O mio Gesù, che hai detto: «In verità vi dico, passeranno il cielo e la terra, ma le mie parole mai!», ecco che, appoggiato all'infallibilità delle tue sante parole, io chiedo la grazia…"),
        it('Padre, Ave e Gloria.'),
        p('Sacro Cuore di Gesù, confido e spero in te.'),
        div(),
        p("O Sacro Cuore di Gesù, cui è impossibile non avere compassione degli infelici, abbi pietà di noi miseri peccatori, ed accordaci le grazie che ti domandiamo per mezzo dell'Immacolato Cuore di Maria, tua e nostra tenera Madre."),
        p('San Giuseppe, padre putativo del S. Cuore di Gesù, prega per noi.'),
        it('Salve o Regina.'),
      ],
    },
  ],
}
