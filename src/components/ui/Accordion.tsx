'use client'
import { useId, useState } from 'react'
import type { FaqItem } from '@/content/types'
import { cn } from '@/lib/utils'

/** FAQ accordion: answers always in the DOM (SEO, no-JS), first item open (docs/04 §3). */
export function Accordion({ items, headingLevel = 3 }: { items: FaqItem[]; headingLevel?: 2 | 3 }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i
        const qid = `${base}-q${i}`
        const aid = `${base}-a${i}`
        return (
          <div className={cn('faq-item', isOpen && 'is-open')} key={item.q}>
            <H style={{ margin: 0 }}>
              <button
                className="faq-q"
                type="button"
                id={qid}
                aria-expanded={isOpen}
                aria-controls={aid}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <span className="faq-x" aria-hidden>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
            </H>
            <div className="faq-a" id={aid} role="region" aria-labelledby={qid}>
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
