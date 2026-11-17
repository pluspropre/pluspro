import type { MetadataRoute } from 'next'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { getAllPostSlugs, getCategories } from '@/lib/data/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getAllPostSlugs(), getCategories()])
  const url = (path: string) => `${site.url}${path}`
  const statics: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/services'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/realisations'), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/a-propos'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/actualites'), changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/devis'), changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/mentions-legales'), changeFrequency: 'yearly', priority: 0.2 },
    { url: url('/politique-de-confidentialite'), changeFrequency: 'yearly', priority: 0.2 },
  ]
  return [
    ...statics,
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), changeFrequency: 'monthly' as const, priority: 0.9 })),
    ...categories.map((c) => ({ url: url(`/actualites/categorie/${c.slug}`), changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: url(`/actualites/${p.slug}`), lastModified: new Date(p.updated_at), changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
