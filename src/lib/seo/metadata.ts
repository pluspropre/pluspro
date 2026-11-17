import type { Metadata } from 'next'
import { site } from '@/content/site'

export const ROBOTS_INDEX: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
}

/** Unique title, description, canonical and Open Graph for every public page (docs/07 §3). */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex,
  absoluteTitle,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
}: {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  absoluteTitle?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  section?: string
}): Metadata {
  const ogTitle = absoluteTitle ? title : `${title} | ${site.name}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : ROBOTS_INDEX,
    openGraph: {
      type,
      siteName: site.name,
      locale: 'fr_FR',
      url: path,
      title: ogTitle,
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
      ...(type === 'article' ? { publishedTime, modifiedTime, section } : {}),
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description, ...(image ? { images: [image] } : {}) },
  }
}
