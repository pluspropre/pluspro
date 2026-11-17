import 'server-only'
import { site } from '@/content/site'
import { serverEnv } from '@/lib/env.server'

/** Fire-and-forget IndexNow ping (Bing / Copilot / ChatGPT search), production only (docs/07 §6). */
export async function pingIndexNow(paths: string[]) {
  const key = serverEnv.INDEXNOW_KEY
  if (!key || process.env.VERCEL_ENV !== 'production') return
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(site.url).host,
        key,
        keyLocation: `${site.url}/${key}.txt`,
        urlList: paths.map((p) => `${site.url}${p}`),
      }),
    })
  } catch {
    /* non-blocking */
  }
}
