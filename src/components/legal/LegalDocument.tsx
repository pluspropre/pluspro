import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LegalBlock, LegalDoc } from '@/content/legal/types'
import { formatDate } from '@/lib/utils'

/** Converts "[label](url)" inside legal texts into links; everything else stays plain text. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const [, label, href] = m
    out.push(
      href.startsWith('/') ? (
        <Link key={m.index} href={href}>
          {label}
        </Link>
      ) : (
        <a key={m.index} href={href} target="_blank" rel="noopener">
          {label}
        </a>
      ),
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'p') return <p>{inline(block.text)}</p>
  if (block.type === 'ul')
    return (
      <ul>
        {block.items.map((i) => (
          <li key={i}>{inline(i)}</li>
        ))}
      </ul>
    )
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {block.head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{inline(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function LegalDocument({ doc, toc }: { doc: LegalDoc; toc?: boolean }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
      {toc ? (
        <nav aria-label="Sommaire" className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Sommaire</p>
          <ol className="mt-4 grid gap-2 text-[15px]">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a className="ul text-ink" href={`#${s.id}`}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
        <div className="hidden lg:block" />
      )}
      <div className="prose">
        <p className="text-[15px] text-label">Dernière mise à jour&nbsp;: {formatDate(doc.lastUpdated)}</p>
        {doc.intro ? <p>{inline(doc.intro)}</p> : null}
        {doc.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-32">
            <h2 id={`${s.id}-t`}>{s.title}</h2>
            {s.blocks.map((b, i) => (
              <div key={i} className="mt-4">
                <Block block={b} />
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
