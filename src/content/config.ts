import { defineCollection, z } from 'astro:content'

const prayers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    folder: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
})

export const collections = { prayers }
