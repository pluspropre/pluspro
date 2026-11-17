'use client'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import { useRef, useState } from 'react'
import { compressAndUpload } from '@/lib/admin/uploadImage'
import { mediaUrl } from '@/lib/images'
import { tiptapExtensions } from '@/lib/tiptap'
import { cn } from '@/lib/utils'

type Props = { initialJson?: JSONContent | null; initialHtml?: string | null; onChange: (json: JSONContent) => void; folder: string }

/** Friendly editor: H2, H3, bold, italic, lists, quote, link, image (with alt). No colours or fonts. */
export function RichTextEditor({ initialJson, initialHtml, onChange, folder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)
  const editor = useEditor({
    extensions: tiptapExtensions,
    content: initialJson ?? initialHtml ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose min-h-[360px] max-w-none rounded-b-[20px] bg-white p-5 outline-none focus-visible:ring-4 focus-visible:ring-teal/20',
        'aria-label': 'Contenu de l’article',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  })

  if (!editor) return <div className="min-h-[420px] animate-pulse rounded-[20px] bg-surface-2" />

  const btn = (active: boolean) =>
    cn('min-h-10 rounded-xl px-3 text-[14px] font-semibold text-ink hover:bg-white', active && 'bg-white shadow-sm ring-1 ring-line')

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Adresse du lien (https://… ou /services/…)', prev ?? 'https://')
    if (url === null) return
    if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run()
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = async (file?: File) => {
    if (!file) return
    try {
      const up = await compressAndUpload(file, folder, setStatus)
      const alt = window.prompt('Décrivez l’image en quelques mots (texte alternatif) :', '') ?? ''
      const src = mediaUrl(up.path)
      if (src) editor.chain().focus().setImage({ src, alt }).run()
    } catch {
      window.alert('L’envoi de l’image a échoué.')
    } finally {
      setStatus(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="rounded-[20px] border border-line">
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 rounded-t-[20px] border-b border-line bg-surface-2 p-2" role="toolbar" aria-label="Mise en forme">
        <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          Titre
        </button>
        <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          Sous-titre
        </button>
        <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Gras">
          <strong>G</strong>
        </button>
        <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italique">
          <em>I</em>
        </button>
        <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Liste
        </button>
        <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Liste
        </button>
        <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          « Citation »
        </button>
        <button type="button" className={btn(editor.isActive('link'))} onClick={setLink}>
          Lien
        </button>
        <button type="button" className={btn(false)} onClick={() => fileRef.current?.click()} disabled={Boolean(status)}>
          {status ?? 'Image'}
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} aria-label="Annuler">
          ↶
        </button>
        <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} aria-label="Rétablir">
          ↷
        </button>
      </div>
      <EditorContent editor={editor} />
      <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => addImage(e.target.files?.[0])} />
    </div>
  )
}
