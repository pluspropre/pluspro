'use client'
import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { compressAndUpload } from '@/lib/admin/uploadImage'
import { mediaUrl } from '@/lib/images'
import { cn } from '@/lib/utils'

export type UploadedImage = { path: string; width: number; height: number }

/**
 * Phone-friendly uploader (docs/06 §4): camera or gallery → resized + re-encoded to WebP in the browser
 * (which drops EXIF/GPS) → uploaded to the public "media" bucket with the admin's session.
 */
export function ImageUploader({
  folder,
  label,
  value,
  onChange,
  aspect = 'aspect-[4/5]',
  allowCamera = true,
}: {
  folder: string
  label: string
  value: UploadedImage | null
  onChange: (img: UploadedImage | null) => void
  aspect?: string
  allowCamera?: boolean
}) {
  const id = useId()
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handle = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) {
      setError('Ce fichier n’est pas une image.')
      return
    }
    setBusy(true)
    try {
      onChange(await compressAndUpload(file, folder, setStatus))
      setStatus(null)
    } catch {
      setError(
        /heic|heif/i.test(file.type + file.name)
          ? 'Format HEIC non pris en charge par ce navigateur : choisissez « Plus compatible » dans les réglages Appareil photo, ou envoyez la photo depuis la galerie.'
          : 'L’envoi a échoué. Vérifiez votre connexion et réessayez.',
      )
      setStatus(null)
    } finally {
      setBusy(false)
      if (cameraRef.current) cameraRef.current.value = ''
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }

  const src = mediaUrl(value?.path)
  return (
    <div>
      <p className="form-label" id={`${id}-l`}>
        {label}
      </p>
      <div className={cn('relative overflow-hidden rounded-[20px] border-2 border-dashed border-line bg-surface-2', aspect)}>
        {src ? (
          <Image src={src} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-4 text-center text-[14px] text-label">
            {busy ? status : 'Aucune photo'}
          </div>
        )}
        {busy && src ? <div className="absolute inset-0 grid place-items-center bg-white/80 text-[14px] font-semibold text-ink">{status}</div> : null}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2" aria-labelledby={`${id}-l`}>
        {allowCamera ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => cameraRef.current?.click()}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-4 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            📷 Prendre une photo
          </button>
        ) : null}
        <button
          type="button"
          disabled={busy}
          onClick={() => galleryRef.current?.click()}
          className={cn(
            'inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white px-4 text-[14px] font-semibold text-ink disabled:opacity-60',
            !allowCamera && 'col-span-2',
          )}
        >
          🖼️ {src ? 'Remplacer' : 'Galerie'}
        </button>
        {src ? (
          <button type="button" disabled={busy} onClick={() => onChange(null)} className="col-span-2 text-[14px] font-semibold text-danger">
            Retirer la photo
          </button>
        ) : null}
      </div>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} onChange={(e) => handle(e.target.files?.[0])} />
      <input ref={galleryRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => handle(e.target.files?.[0])} />
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
