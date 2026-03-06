import type { Folder } from '../../types'
import { v } from '../prayerBlocks'

export const spiritoSanto: Folder = {
  id: 'spirito-santo',
  title: 'Spirito Santo',
  prayers: [
    {
      id: 'veni-spirito-santo',
      title: 'Veni Santo Spirito',
      blocks: [
        v('Vieni, Santo Spirito,', 'manda a noi dal cielo', 'un raggio della tua luce.'),
        v('Vieni, padre dei poveri,', 'vieni; datore dei doni,', 'vieni, luce dei cuori.'),
        v('Consolatore perfetto,', "ospite dolce dell'anima,", 'dolcissimo sollievo.'),
        v('Nella fatica, riposo,', 'nella calura, riparo,', 'nel pianto, conforto.'),
        v('O luce beatissima,', "invadi nell'intimo", 'il cuore dei tuoi fedeli.'),
        v("Senza la tua forza,", "nulla è nell'uomo,", 'nulla senza colpa.'),
        v('Lava ciò che è sordido,', 'bagna ciò che è arido,', 'sana ciò che sanguina.'),
        v('Piega ciò che è rigido,', 'scalda ciò che è gelido,', "raddrizza ciò ch'è sviato."),
        v('Dona ai tuoi fedeli', 'che solo in te confidano', 'i tuoi santi doni.'),
        v('Dona virtù e premio,', 'dona morte santa,', 'dona gioia eterna. Amen.'),
      ],
    },
  ],
}
