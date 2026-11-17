'use client'
import type { JSONContent } from '@tiptap/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { services } from '@/content/services'
import { compressAndUpload } from '@/lib/admin/uploadImage'
import type { Tables } from '@/lib/supabase/database.types'
import { mediaUrl } from '@/lib/images'
import { cn, slugify } from '@/lib/utils'
import { deletePost, savePost } from '@/app/admin/(protected)/articles/actions'
import { ImageUploader, type UploadedImage } from './ImageUploader'
import { RichTextEditor } from './RichTextEditor'
import { btn, Panel } from './ui'

type Post = Tables<'posts'>
type GalleryImage = { path: string; alt: string; caption?: string; width?: number | null; height?: number | null }

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={cn('text-[13px]', value.length > max ? 'font-bold text-danger' : 'text-label')}>{value.length} / {max}</span>
}

export function PostForm({
  initial,
  initialImages = [],
  categories,
}: {
  initial?: Post
  initialImages?: GalleryImage[]
  categories: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [id, setId] = useState(initial?.id)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? '')
  const [serviceSlugs, setServiceSlugs] = useState<string[]>(initial?.service_slugs ?? [])
  const [cover, setCover] = useState<UploadedImage | null>(initial?.cover_path ? { path: initial.cover_path, width: 0, height: 0 } : null)
  const [coverAlt, setCoverAlt] = useState(initial?.cover_alt ?? '')
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '')
  const [content, setContent] = useState<JSONContent | null>((initial?.content_json as JSONContent) ?? null)
  const [gallery, setGallery] = useState<GalleryImage[]>(initialImages)
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? '')
  const [seoDesc, setSeoDesc] = useState(initial?.seo_description ?? '')
  const [schedule, setSchedule] = useState(
    initial?.status === 'published' && initial.published_at && new Date(initial.published_at) > new Date() ? toLocalInput(initial.published_at) : '',
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [dirty, setDirty] = useState(false)
  const [galleryStatus, setGalleryStatus] = useState<string | null>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const status = initial?.status ?? 'draft'

  const mark = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setDirty(true)
  }

  // auto slug from title until edited
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title)) // eslint-disable-line react-hooks/set-state-in-effect -- derived until the editor takes over
  }, [title, slugTouched])

  const payload = useCallback(
    (nextStatus: 'draft' | 'published' | 'archived', publishedAt: string | null) => ({
      id,
      title,
      slug,
      excerpt,
      category_id: categoryId || null,
      service_slugs: serviceSlugs,
      cover_path: cover?.path ?? null,
      cover_alt: coverAlt,
      content_json: content ?? { type: 'doc', content: [] },
      seo_title: seoTitle,
      seo_description: seoDesc,
      status: nextStatus,
      published_at: publishedAt,
      images: gallery,
    }),
    [id, title, slug, excerpt, categoryId, serviceSlugs, cover, coverAlt, content, seoTitle, seoDesc, gallery],
  )

  const submit = (nextStatus: 'draft' | 'published' | 'archived', publishedAt: string | null, silent = false) =>
    new Promise<void>((resolve) =>
      start(async () => {
        const res = await savePost(payload(nextStatus, publishedAt))
        if (!res.ok) {
          setErrors(res.fieldErrors ?? {})
          if (!silent) setMessage({ ok: false, text: res.error })
          resolve()
          return
        }
        setErrors({})
        setDirty(false)
        setMessage({ ok: true, text: silent ? 'Brouillon enregistré automatiquement.' : (res.message ?? 'Enregistré.') })
        if (!id && res.data) {
          setId(res.data.id)
          router.replace(`/admin/articles/${res.data.id}`)
        } else router.refresh()
        resolve()
      }),
    )

  // autosave drafts every 10 s when there are unsaved changes
  useEffect(() => {
    if (!dirty || !id || status !== 'draft' || title.length < 3 || slug.length < 3) return
    const t = window.setTimeout(() => void submit('draft', null, true), 10_000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, id, status, title, slug, content, excerpt])

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const addGallery = async (files: FileList | null) => {
    if (!files?.length) return
    for (const file of Array.from(files)) {
      try {
        const up = await compressAndUpload(file, 'posts', setGalleryStatus)
        setGallery((g) => [...g, { path: up.path, alt: '', width: up.width, height: up.height }])
        setDirty(true)
      } catch {
        window.alert(`L’envoi de « ${file.name} » a échoué.`)
      }
    }
    setGalleryStatus(null)
    if (galleryRef.current) galleryRef.current.value = ''
  }

  const moveImg = (i: number, d: -1 | 1) =>
    setGallery((g) => {
      const j = i + d
      if (j < 0 || j >= g.length) return g
      const copy = [...g]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })

  const previewTitle = (seoTitle || title || 'Titre de l’article').slice(0, 60)
  const previewDesc = (seoDesc || excerpt || 'Description de l’article…').slice(0, 160)

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
      onSubmit={(e) => {
        e.preventDefault()
        void submit('published', schedule ? new Date(schedule).toISOString() : (initial?.published_at && status === 'published' ? initial.published_at : null))
      }}
    >
      <div className="grid gap-6">
        <Panel>
          <div className="grid gap-5">
            <div>
              <label className="form-label" htmlFor="a-title">
                Titre
              </label>
              <input id="a-title" className="input text-[20px] font-semibold" value={title} onChange={(e) => mark(setTitle)(e.target.value)} />
              {errors.title ? <p className="form-error">{errors.title}</p> : null}
            </div>
            <div>
              <label className="form-label" htmlFor="a-slug">
                Adresse de la page
              </label>
              <div className="flex items-center gap-2">
                <span className="hidden text-[14px] text-label sm:inline">plus-propre.fr/actualites/</span>
                <input
                  id="a-slug"
                  className="input"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    mark(setSlug)(slugify(e.target.value))
                  }}
                />
              </div>
              {errors.slug ? <p className="form-error">{errors.slug}</p> : null}
              {initial?.slug && slug !== initial.slug && status === 'published' ? (
                <p className="form-hint text-danger">Attention : changer l’adresse d’un article publié casse les liens existants.</p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="a-cat">
                  Catégorie
                </label>
                <select id="a-cat" className="input" value={categoryId} onChange={(e) => mark(setCategoryId)(e.target.value)}>
                  <option value="">Aucune</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <fieldset>
              <legend className="form-label">Services liés (l’article apparaîtra sur ces pages)</legend>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <label key={s.slug} className="choice choice--pill !py-2 text-[14px]">
                    <input
                      type="checkbox"
                      checked={serviceSlugs.includes(s.slug)}
                      onChange={(e) => mark(setServiceSlugs)(e.target.checked ? [...serviceSlugs, s.slug] : serviceSlugs.filter((x) => x !== s.slug))}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <div className="flex items-center justify-between">
                <label className="form-label" htmlFor="a-excerpt">
                  Résumé (affiché sur les cartes et dans Google)
                </label>
                <Counter value={excerpt} max={160} />
              </div>
              <textarea id="a-excerpt" className="input" rows={2} value={excerpt} onChange={(e) => mark(setExcerpt)(e.target.value)} />
            </div>
          </div>
        </Panel>

        <Panel title="Contenu">
          <RichTextEditor
            folder="posts"
            initialJson={initial?.content_json as JSONContent | null}
            initialHtml={initial?.content_html}
            onChange={(json) => {
              setContent(json)
              setDirty(true)
            }}
          />
        </Panel>

        <Panel title="Galerie photos">
          {gallery.length > 0 ? (
            <ul className="grid gap-3">
              {gallery.map((img, i) => (
                <li key={img.path} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-2 p-3">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                    {mediaUrl(img.path) ? <Image src={mediaUrl(img.path)!} alt="" fill sizes="64px" className="object-cover" /> : null}
                  </span>
                  <div className="grid min-w-0 flex-1 gap-2">
                    <label className="sr-only" htmlFor={`g-alt-${i}`}>
                      Description de la photo {i + 1}
                    </label>
                    <input
                      id={`g-alt-${i}`}
                      className="input !min-h-10"
                      placeholder="Description de la photo (texte alternatif)"
                      value={img.alt}
                      onChange={(e) => mark(setGallery)(gallery.map((g, j) => (j === i ? { ...g, alt: e.target.value } : g)))}
                    />
                    <input
                      className="input !min-h-10"
                      aria-label={`Légende de la photo ${i + 1}`}
                      placeholder="Légende (facultatif)"
                      value={img.caption ?? ''}
                      onChange={(e) => mark(setGallery)(gallery.map((g, j) => (j === i ? { ...g, caption: e.target.value } : g)))}
                    />
                  </div>
                  <div className="flex gap-1">
                    <button type="button" className="grid size-10 place-items-center rounded-full border border-line bg-white" aria-label="Monter" onClick={() => moveImg(i, -1)}>
                      ↑
                    </button>
                    <button type="button" className="grid size-10 place-items-center rounded-full border border-line bg-white" aria-label="Descendre" onClick={() => moveImg(i, 1)}>
                      ↓
                    </button>
                    <button
                      type="button"
                      className="grid size-10 place-items-center rounded-full border border-danger/30 bg-white text-danger"
                      aria-label="Retirer"
                      onClick={() => mark(setGallery)(gallery.filter((_, j) => j !== i))}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-label">Aucune photo dans la galerie.</p>
          )}
          <button type="button" className={`${btn.ghost} mt-4`} disabled={Boolean(galleryStatus)} onClick={() => galleryRef.current?.click()}>
            {galleryStatus ?? '+ Ajouter des photos'}
          </button>
          <input ref={galleryRef} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} onChange={(e) => addGallery(e.target.files)} />
        </Panel>

        <Panel title="Référencement (Google)">
          <div className="grid gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="form-label" htmlFor="a-seot">
                  Titre pour Google
                </label>
                <Counter value={seoTitle} max={60} />
              </div>
              <input id="a-seot" className="input" value={seoTitle} placeholder={title} onChange={(e) => mark(setSeoTitle)(e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="form-label" htmlFor="a-seod">
                  Description pour Google
                </label>
                <Counter value={seoDesc} max={160} />
              </div>
              <textarea id="a-seod" className="input" rows={2} value={seoDesc} placeholder={excerpt} onChange={(e) => mark(setSeoDesc)(e.target.value)} />
            </div>
            <div className="rounded-2xl border border-line p-4" aria-label="Aperçu Google">
              <p className="text-[13px] text-[#4d5156]">plus-propre.fr › actualites › {slug || '…'}</p>
              <p className="mt-1 text-[19px] leading-snug text-[#1a0dab]">{previewTitle} | +Propre</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[#4d5156]">{previewDesc}</p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid content-start gap-4 xl:sticky xl:top-6">
        <Panel title="Image de couverture">
          <ImageUploader folder="posts" label="Couverture" value={cover} onChange={(v) => mark(setCover)(v)} aspect="aspect-[4/3]" allowCamera />
          <div className="mt-3">
            <label className="form-label" htmlFor="a-calt">
              Description de l’image
            </label>
            <input id="a-calt" className="input" value={coverAlt} onChange={(e) => mark(setCoverAlt)(e.target.value)} />
          </div>
        </Panel>
        <Panel title="Publication">
          <p className="mb-4 text-[14px] text-label">
            Statut :{' '}
            <strong className="text-ink">
              {status === 'draft' ? 'Brouillon' : status === 'archived' ? 'Archivé' : initial?.published_at && new Date(initial.published_at) > new Date() ? 'Programmé' : 'Publié'}
            </strong>
          </p>
          <div className="grid gap-3">
            <button type="submit" className={btn.primary} disabled={pending}>
              {schedule ? 'Programmer' : status === 'published' ? 'Mettre à jour' : 'Publier maintenant'}
            </button>
            <div>
              <label className="form-label text-[14px]" htmlFor="a-sched">
                Programmer la publication (facultatif)
              </label>
              <input id="a-sched" type="datetime-local" className="input" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
              <p className="form-hint">Heure de Paris. L’article apparaît sur le site dans l’heure qui suit.</p>
            </div>
            <button type="button" className={btn.ghost} disabled={pending} onClick={() => void submit('draft', null)}>
              Enregistrer le brouillon
            </button>
            {id ? (
              <Link href={`/admin/articles/${id}/apercu`} target="_blank" className={btn.ghost}>
                Prévisualiser ↗
              </Link>
            ) : null}
            {id && status === 'published' ? (
              <button type="button" className={btn.ghost} disabled={pending} onClick={() => void submit('archived', initial?.published_at ?? null)}>
                Retirer du site (archiver)
              </button>
            ) : null}
            {id ? (
              <button
                type="button"
                className={btn.danger}
                disabled={pending}
                onClick={() => {
                  if (!window.confirm('Supprimer définitivement cet article ?')) return
                  start(async () => {
                    const r = await deletePost(id)
                    if (r.ok) {
                      setDirty(false)
                      router.push('/admin/articles')
                    } else setMessage({ ok: false, text: r.error })
                  })
                }}
              >
                Supprimer
              </button>
            ) : null}
          </div>
          {message ? (
            <p role="status" className={cn('mt-4 font-semibold', message.ok ? 'text-teal-dk' : 'text-danger')}>
              {message.text}
            </p>
          ) : dirty ? (
            <p className="mt-4 text-[14px] text-label">Modifications non enregistrées.</p>
          ) : null}
        </Panel>
      </div>
    </form>
  )
}
