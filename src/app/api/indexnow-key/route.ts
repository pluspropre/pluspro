/** Serves the IndexNow key; exposed at /{INDEXNOW_KEY}.txt through a rewrite in next.config.ts. */
export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) return new Response('Not found', { status: 404 })
  return new Response(key, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
