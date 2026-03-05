import type { Folder } from '../../../types'
import { v } from '../../prayerBlocks'

export const sanFrancesco: Folder = {
  id: 'san-francesco-assisi',
  title: "San Francesco d'Assisi",
  prayers: [
    {
      id: 'preghiera-san-francesco',
      title: "Preghiera di San Francesco d'Assisi",
      blocks: [
        v(
          "Signore, fa' di me uno strumento della tua pace.",
          "Dove è odio, ch'io porti l'amore;",
          "dove è offesa, ch'io porti il perdono;",
          "dove è discordia, ch'io porti l'unione;",
          "dove è dubbio, ch'io porti la fede;",
          "dove è errore, ch'io porti la verità;",
          "dove è disperazione, ch'io porti la speranza;",
          "dove è tristezza, ch'io porti la gioia;",
          "dove sono le tenebre, ch'io porti la luce.",
        ),
        v(
          "O Maestro, fa' ch'io non cerchi tanto",
          'ad essere consolato, quanto a consolare;',
          'ad essere compreso, quanto a comprendere;',
          'ad essere amato, quanto ad amare.',
        ),
        v(
          'Poiché donando si riceve,',
          'perdonando si è perdonati,',
          'morendo si risuscita a vita eterna.',
        ),
      ],
    },
  ],
}
