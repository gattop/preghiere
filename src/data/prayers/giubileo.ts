import type { Folder } from '../../types'
import { p } from '../prayerBlocks'

export const giubileo: Folder = {
  id: 'giubileo-2025',
  title: 'Giubileo 2025',
  prayers: [
    {
      id: 'preghiera-giubileo-1',
      title: 'Padre Nostro — Giubileo',
      blocks: [
        p("Padre nostro che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà come in cielo così in terra. Dacci oggi il nostro pane quotidiano, e rimetti a noi i nostri debiti come noi li rimettiamo ai nostri debitori, e non ci indurre in tentazione, ma liberaci dal male. Amen."),
      ],
    },
  ],
}
