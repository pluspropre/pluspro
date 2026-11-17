import type { FaqItem } from '@/content/types'
import { site } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Eyebrow } from '@/components/ui/Eyebrow'

export function FaqSection({ items, title, id = 't-faq' }: { items: FaqItem[]; title?: React.ReactNode; id?: string }) {
  if (items.length === 0) return null
  return (
    <section className="sec sec--tight" aria-labelledby={id}>
      <div className="wrap faq">
        <div className="faq-side" data-reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="h2" id={id}>
            {title ?? (
              <>
                Questions <em className="serif">fréquentes</em>
              </>
            )}
          </h2>
          <p className="lead">
            Une question qui n’est pas ici&nbsp;? Appelez-nous au{' '}
            <a className="ul" href={`tel:${site.phone.e164}`}>
              {site.phone.display}
            </a>
            .
          </p>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  )
}
