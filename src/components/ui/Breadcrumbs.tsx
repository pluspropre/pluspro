import Link from 'next/link'
import type { Crumb } from '@/lib/seo/jsonld'
import { ChevronRight } from './icons'

/** Visible breadcrumbs; the matching BreadcrumbList JSON-LD is emitted by the page graph. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Fil d’Ariane">
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={c.path}>
              {last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <>
                  <Link href={c.path}>{c.name}</Link>
                  <ChevronRight />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
