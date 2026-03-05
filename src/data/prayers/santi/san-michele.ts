import type { Folder } from '../../../types'
import { p, div, rep } from '../../prayerBlocks'

export const sanMichele: Folder = {
  id: 'san-michele-arcangelo',
  title: 'San Michele Arcangelo',
  prayers: [
    {
      id: 'preghiera-san-michele',
      title: 'Preghiera a San Michele Arcangelo',
      blocks: [
        p("San Michele Arcangelo, difendici nella lotta, sii il nostro aiuto contro la malvagità e le insidie del demonio. Supplichevoli preghiamo che Dio lo domini e Tu, Principe della Milizia Celeste, con il potere che ti viene da Dio, incatena nell'inferno Satana e gli spiriti maligni, che si aggirano per il mondo per far perdere le anime."),
        p('Amen.'),
        div(),
        rep('Sia benedetto il nome di San Michele Arcangelo.', 9),
        div(),
        p('Alla Santissima Trinità, in ringraziamento per il nome dato al Principe degli Angeli.'),
        rep('x1', 1),
        div(),
        p('Gloria al Padre, al Figlio e allo Spirito Santo. Com\'era nel principio, ora e sempre, nei secoli dei secoli. Amen.'),
        rep('x9', 9),
      ],
    },
  ],
}
