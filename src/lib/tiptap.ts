import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit'

/** Shared by the admin editor (client) and the server-side HTML rendering, so both agree on the schema. */
export const tiptapExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { rel: 'noopener', target: null } },
  }),
  Image.configure({ inline: false, allowBase64: false }),
]
