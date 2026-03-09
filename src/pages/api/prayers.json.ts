import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const prayers = await getCollection('prayers')
  const index = prayers.map(p => ({
    id: p.id.replace(/\.md$/, ''),
    title: p.data.title,
    folder: p.data.folder,
  }))
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  })
}
