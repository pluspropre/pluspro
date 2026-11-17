'use client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { services } from '@/content/services'
import type { Project } from '@/lib/data/projects'
import { BeforeAfterSlider } from '@/components/sections/BeforeAfter'
import { saveProject } from '@/app/admin/(protected)/realisations/actions'
import { ImageUploader, type UploadedImage } from './ImageUploader'
import { btn, Panel } from './ui'

type Initial = Partial<Project> & { id?: string; is_published?: boolean }

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function ProjectForm({ initial }: { initial?: Initial }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [service, setService] = useState(initial?.service_slug ?? '')
  const [city, setCity] = useState(initial?.city ?? 'Strasbourg')
  const [date, setDate] = useState(initial?.performed_on ?? today())
  const [description, setDescription] = useState(initial?.description ?? '')
  const [before, setBefore] = useState<UploadedImage | null>(initial?.before_path ? { path: initial.before_path, width: 0, height: 0 } : null)
  const [after, setAfter] = useState<UploadedImage | null>(
    initial?.after_path ? { path: initial.after_path, width: initial.width ?? 0, height: initial.height ?? 0 } : null,
  )
  const [beforeAlt, setBeforeAlt] = useState(initial?.before_alt ?? '')
  const [afterAlt, setAfterAlt] = useState(initial?.after_alt ?? '')
  const [featured, setFeatured] = useState(initial?.is_featured ?? false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)

  // suggested alt texts (editable)
  const altBefore = beforeAlt || (title ? `Avant nettoyage — ${title}` : '')
  const altAfter = afterAlt || (title ? `Après nettoyage — ${title}` : '')

  const submit = (publish: boolean) => {
    setMessage(null)
    start(async () => {
      const res = await saveProject({
        id: initial?.id,
        title,
        description,
        service_slug: service,
        city,
        performed_on: date,
        before_path: before?.path ?? null,
        before_alt: before ? altBefore : undefined,
        after_path: after?.path ?? '',
        after_alt: altAfter,
        width: after?.width || initial?.width || null,
        height: after?.height || initial?.height || null,
        is_published: publish,
        is_featured: featured,
      })
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {})
        setMessage(res.error)
        return
      }
      setErrors({})
      router.push('/admin/realisations')
      router.refresh()
    })
  }

  const preview =
    before && after
      ? {
          id: 'preview',
          title: title || 'Aperçu',
          description: null,
          service_slug: service,
          city,
          before_path: before.path,
          before_alt: altBefore,
          after_path: after.path,
          after_alt: altAfter,
          width: after.width || null,
          height: after.height || null,
          performed_on: null,
          is_featured: false,
        }
      : null

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
      onSubmit={(e) => {
        e.preventDefault()
        submit(true)
      }}
    >
      <div className="grid gap-6">
        <Panel title="Photos">
          <div className="grid grid-cols-2 gap-4">
            <ImageUploader folder="projects" label="Photo AVANT (facultatif)" value={before} onChange={setBefore} />
            <ImageUploader folder="projects" label="Photo APRÈS" value={after} onChange={setAfter} />
          </div>
          {errors.after_path ? <p className="form-error">{errors.after_path}</p> : null}
          {preview ? (
            <div className="mt-6">
              <p className="form-label">Aperçu du curseur avant / après</p>
              <BeforeAfterSlider project={preview} className="mx-auto max-w-sm" />
            </div>
          ) : null}
        </Panel>
        <Panel title="Informations">
          <div className="grid gap-5">
            <div>
              <label className="form-label" htmlFor="p-title">
                Titre
              </label>
              <input id="p-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex. Four encrassé remis à neuf" aria-invalid={Boolean(errors.title) || undefined} />
              {errors.title ? <p className="form-error">{errors.title}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="p-service">
                  Service
                </label>
                <select id="p-service" className="input" value={service} onChange={(e) => setService(e.target.value)} aria-invalid={Boolean(errors.service_slug) || undefined}>
                  <option value="">Choisir…</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.service_slug ? <p className="form-error">{errors.service_slug}</p> : null}
              </div>
              <div>
                <label className="form-label" htmlFor="p-city">
                  Ville
                </label>
                <input id="p-city" className="input" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
            </div>
            <div className="max-w-xs">
              <label className="form-label" htmlFor="p-date">
                Date de l’intervention
              </label>
              <input id="p-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="p-desc">
                Description <span className="font-normal text-label">(facultatif)</span>
              </label>
              <textarea id="p-desc" className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={600} />
            </div>
          </div>
        </Panel>
        <Panel title="Textes alternatifs (accessibilité et référencement)">
          <div className="grid gap-4">
            {before ? (
              <div>
                <label className="form-label" htmlFor="p-balt">
                  Description de la photo avant
                </label>
                <input id="p-balt" className="input" value={altBefore} onChange={(e) => setBeforeAlt(e.target.value)} />
                {errors.before_alt ? <p className="form-error">{errors.before_alt}</p> : null}
              </div>
            ) : null}
            <div>
              <label className="form-label" htmlFor="p-aalt">
                Description de la photo après
              </label>
              <input id="p-aalt" className="input" value={altAfter} onChange={(e) => setAfterAlt(e.target.value)} />
              {errors.after_alt ? <p className="form-error">{errors.after_alt}</p> : null}
            </div>
          </div>
        </Panel>
      </div>
      <div className="grid content-start gap-4 xl:sticky xl:top-6">
        <Panel>
          <label className="flex items-center gap-3 font-semibold text-ink">
            <input type="checkbox" className="size-5 accent-[#0F766E]" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Mettre en avant sur l’accueil
          </label>
          <p className="form-hint">Les réalisations avant / après mises en avant apparaissent dans le curseur de la page d’accueil.</p>
          <div className="mt-6 grid gap-3">
            <button type="submit" className={btn.primary} disabled={pending}>
              {pending ? 'Enregistrement…' : 'Publier'}
            </button>
            <button type="button" className={btn.ghost} disabled={pending} onClick={() => submit(false)}>
              Enregistrer en brouillon
            </button>
          </div>
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
