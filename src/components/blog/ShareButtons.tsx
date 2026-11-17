'use client'
import { useState } from 'react'
import { FacebookIcon, LinkedInIcon, LinkIcon, ShareIcon, WhatsAppIcon } from '@/components/ui/icons'

/** Plain share links (no third-party scripts) + copy link / native share. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const cls = 'grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-[14px] font-semibold text-ink">Partager</span>
      <a className={cls} href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener" aria-label="Partager sur LinkedIn">
        <LinkedInIcon width={18} height={18} />
      </a>
      <a className={cls} href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener" aria-label="Partager sur Facebook">
        <FacebookIcon width={18} height={18} />
      </a>
      <a className={cls} href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener" aria-label="Partager sur WhatsApp">
        <WhatsAppIcon width={18} height={18} />
      </a>
      <button
        type="button"
        className={cls}
        aria-label={copied ? 'Lien copié' : 'Copier le lien'}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        <LinkIcon width={18} height={18} />
      </button>
      <button
        type="button"
        className={`${cls} md:hidden`}
        aria-label="Plus d’options de partage"
        onClick={() => navigator.share?.({ title, url }).catch(() => undefined)}
      >
        <ShareIcon width={18} height={18} />
      </button>
      <span className="text-[13px] text-teal-dk" aria-live="polite">
        {copied ? 'Lien copié' : ''}
      </span>
    </div>
  )
}
