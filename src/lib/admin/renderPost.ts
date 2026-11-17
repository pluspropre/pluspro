import 'server-only'
import { generateHTML } from '@tiptap/html/server'
import sanitizeHtml from 'sanitize-html'
import { publicEnv } from '@/lib/env'
import { tiptapExtensions } from '@/lib/tiptap'
import { readingTime } from '@/lib/utils'

const storageHost = publicEnv.NEXT_PUBLIC_SUPABASE_URL ? new URL(publicEnv.NEXT_PUBLIC_SUPABASE_URL).hostname : null

/** Tiptap JSON → HTML → allow-list sanitising (docs/06 §4 Rich text). Only the sanitised HTML is ever rendered. */
export function renderPostHtml(doc: unknown): { html: string; minutes: number } {
  let raw = ''
  try {
    raw = generateHTML(doc as Parameters<typeof generateHTML>[0], tiptapExtensions)
  } catch {
    raw = ''
  }
  const html = sanitizeHtml(raw, {
    allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'blockquote', 'a', 'img', 'figure', 'figcaption', 'br'],
    allowedAttributes: { a: ['href', 'rel', 'target'], img: ['src', 'alt', 'width', 'height', 'title', 'loading'] },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['https'] },
    exclusiveFilter: (frame) =>
      frame.tag === 'img' && Boolean(storageHost) && !String(frame.attribs.src ?? '').includes(`${storageHost}/storage/v1/object/public/media/`),
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? '') && !(attribs.href ?? '').includes('plus-propre.fr')
        return { tagName, attribs: { href: attribs.href ?? '#', ...(external ? { rel: 'noopener', target: '_blank' } : {}) } }
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    },
  })
  return { html, minutes: readingTime(html) }
}
