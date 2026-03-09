import { defineCollection, z } from 'astro:content'

const prayers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    folder: z.string(),
    subtitle: z.string().nullish().transform(v => v ?? undefined),
    description: z.string().nullish().transform(v => v ?? undefined),
    order: z.number().optional(),
  }),
})

export const collections = { prayers }
