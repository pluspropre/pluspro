import type { ReactNode } from 'react'
import type { Crumb } from '@/lib/seo/jsonld'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'

/** Compact hero for inner pages: breadcrumbs, eyebrow, H1, intro, actions and an optional visual. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  actions,
  aside,
  children,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="page-hero-card">
        <div className="wrap">
          <div className={aside ? 'page-hero-grid' : undefined}>
            <div>
              <Breadcrumbs items={crumbs} />
              {eyebrow ? (
                <div className="mt-8">
                  <Eyebrow>{eyebrow}</Eyebrow>
                </div>
              ) : null}
              <h1 className="h1 h1--page mt-5" id="page-title">
                {title}
              </h1>
              {intro ? <div className="lead mt-6 max-w-2xl">{intro}</div> : null}
              {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
              {children}
            </div>
            {aside ? <div>{aside}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
