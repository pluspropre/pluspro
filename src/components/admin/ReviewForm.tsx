'use client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { services } from '@/content/services'
import type { Tables } from '@/lib/supabase/database.types'
import { reviewSources } from '@/lib/validation/review'
import { cn } from '@/lib/utils'
import { saveReview } from '@/app/admin/(protected)/avis/actions'
import { btn, Panel } from './ui'

export function ReviewForm({ initial }: { initial?: Tables<'reviews'> }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [v, setV] = useState({
    author_name: initial?.author_name ?? '',
    author_context: initial?.author_context ?? '',
    rating: initial?.rating ?? 5,
    content: initial?.content ?? '',
    source: initial?.source ?? 'google',
    source_url: initial?.source_url ?? '',
    review_date: initial?.review_date ?? '',
    service_slugs: initial?.service_slugs ?? [],
    is_published: initial?.is_published ?? true,
    is_featured: initial?.is_featured ?? false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }))

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      onSubmit={(e) => {
        e.preventDefault()
        start(async () => {
          const res = await saveReview({ id: initial?.id, ...v })
          if (!res.ok) {
            setErrors(res.fieldErrors ?? {})
            setMessage(res.error)
            return
          }
          router.push('/admin/avis')
          router.refresh()
        })
      }}
    >
      <Panel>
        <div className="grid gap-5">
          <div>
            <p className="form-label" id="r-rating">
              Note
            </p>
            <div className="flex gap-1" role="radiogroup" aria-labelledby="r-rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={v.rating === n}
                  aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  onClick={() => set('rating', n)}
                  className={cn('grid size-12 place-items-center rounded-xl text-[30px] leading-none', n <= v.rating ? 'text-star' : 'text-line')}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="r-name">
                Nom affiché
              </label>
              <input id="r-name" className="input" value={v.author_name} onChange={(e) => set('author_name', e.target.value)} placeholder="Isabelle B." />
              <p className="form-hint">Prénom + initiale du nom.</p>
              {errors.author_name ? <p className="form-error">{errors.author_name}</p> : null}
            </div>
            <div>
              <label className="form-label" htmlFor="r-ctx">
                Contexte <span className="font-normal text-label">(facultatif)</span>
              </label>
              <input id="r-ctx" className="input" value={v.author_context} onChange={(e) => set('author_context', e.target.value)} placeholder="Bureaux à Strasbourg" />
            </div>
          </div>
          <div>
            <label className="form-label" htmlFor="r-content">
              Texte de l’avis
            </label>
            <textarea id="r-content" className="input" rows={5} value={v.content} onChange={(e) => set('content', e.target.value)} />
            {errors.content ? <p className="form-error">{errors.content}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label" htmlFor="r-source">
                Plateforme
              </label>
              <select id="r-source" className="input" value={v.source} onChange={(e) => set('source', e.target.value as typeof v.source)}>
                {reviewSources.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="r-url">
                Lien vers l’avis original <span className="font-normal text-label">(facultatif)</span>
              </label>
              <input id="r-url" type="url" className="input" value={v.source_url} onChange={(e) => set('source_url', e.target.value)} placeholder="https://…" />
              {errors.source_url ? <p className="form-error">{errors.source_url}</p> : null}
            </div>
          </div>
          <div className="max-w-xs">
            <label className="form-label" htmlFor="r-date">
              Date de l’avis
            </label>
            <input id="r-date" type="date" className="input" value={v.review_date} onChange={(e) => set('review_date', e.target.value)} />
          </div>
          <fieldset>
            <legend className="form-label">Afficher aussi sur les pages services</legend>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <label key={s.slug} className="choice choice--pill !py-2 text-[14px]">
                  <input
                    type="checkbox"
                    checked={v.service_slugs.includes(s.slug)}
                    onChange={(e) =>
                      set('service_slugs', e.target.checked ? [...v.service_slugs, s.slug] : v.service_slugs.filter((x) => x !== s.slug))
                    }
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Panel>
      <div className="grid content-start gap-4 xl:sticky xl:top-6">
        <Panel>
          <label className="flex items-center gap-3 font-semibold text-ink">
            <input type="checkbox" className="size-5 accent-[#0F766E]" checked={v.is_published} onChange={(e) => set('is_published', e.target.checked)} />
            Publié sur le site
          </label>
          <label className="mt-3 flex items-center gap-3 font-semibold text-ink">
            <input type="checkbox" className="size-5 accent-[#0F766E]" checked={v.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
            Mis en avant
          </label>
          <button type="submit" className={`${btn.primary} mt-6 w-full`} disabled={pending}>
            {pending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {message ? (
            <p className="form-error" role="alert">
              {message}
            </p>
          ) : null}
        </Panel>
      </div>
    </form>
  )
}
