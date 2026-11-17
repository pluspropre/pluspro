import type { NextConfig } from 'next'

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '*.supabase.co'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://${supabaseHost}`,
      `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://challenges.cloudflare.com https://vitals.vercel-insights.com`,
      'frame-src https://challenges.cloudflare.com https://www.google.com',
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }],
    qualities: [75, 85],
  },
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  async headers() {
    const headers = [{ source: '/:path*', headers: securityHeaders }]
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
      headers.push({ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] })
    }
    return headers
  },
  async rewrites() {
    const key = process.env.INDEXNOW_KEY
    return key ? [{ source: `/${key}.txt`, destination: '/api/indexnow-key' }] : []
  },
  async redirects() {
    return [
      { source: '/contact', destination: '/devis', permanent: true },
      { source: '/blog', destination: '/actualites', permanent: true },
      { source: '/blog/:slug', destination: '/actualites/:slug', permanent: true },
    ]
  },
}

export default nextConfig
