// supabase/functions/gospel-proxy/index.ts
// Fetches the Vatican News RSS feed, parses the first item,
// and returns a GospelItem JSON object.
// Called by the client via: ${SUPABASE_URL}/functions/v1/gospel-proxy

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RSS_URL =
  'https://www.vaticannews.va/it/vangelo-del-giorno-e-parola-del-giorno.rss.xml'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'preghiamo-app/1.0' },
    })

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch RSS feed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const xml = await res.text()

    // Extract the first <item> block
    const itemMatch = xml.match(/<item>([\s\S]*?)<\/item>/)
    if (!itemMatch) {
      return new Response(
        JSON.stringify({ error: 'No items found in RSS feed' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const item = itemMatch[1]
    const get = (tag: string) => {
      const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
      return m ? (m[1] ?? m[2] ?? '').trim() : ''
    }

    const title       = get('title')
    const description = get('description')
    const pubDate     = get('pubDate')
    const link        = get('link')

    return new Response(
      JSON.stringify({ title, description, pubDate, link }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
