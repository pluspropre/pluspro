import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  const disallow = ['/admin', '/api/']
  return {
    rules: [
      // /devis/merci is NOT disallowed on purpose: crawlers must be able to read its noindex meta
      { userAgent: '*', allow: '/', disallow },
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'Perplexity-User',
          'ClaudeBot',
          'Claude-User',
          'Claude-SearchBot',
          'Google-Extended',
          'Applebot-Extended',
          'Bingbot',
          'DuckAssistBot',
        ],
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
