import { SectionHeading } from '@/components/ui/SectionHeading'

const defaultSteps = [
  { title: 'Vous décrivez vos locaux', text: 'Surface, type d’activité, fréquence souhaitée : quelques minutes suffisent.' },
  { title: 'Visite et proposition sur mesure', text: 'Nous passons sur place si besoin, puis vous recevez un devis détaillé sous 24h.' },
  { title: 'Lancement et suivi régulier', text: 'Une équipe dédiée démarre, avec des points réguliers pour ajuster.' },
]

export function Process({
  steps = defaultSteps,
  eyebrow = 'Méthode',
  title,
  lead = 'Trois étapes, un seul interlocuteur du premier appel au suivi.',
  id = 't-proc',
}: {
  steps?: { title: string; text: string }[]
  eyebrow?: string
  title?: React.ReactNode
  lead?: string
  id?: string
}) {
  const three = steps.length === 3
  return (
    <section className="sec sec--tight" aria-labelledby={id} data-process>
      <div className="wrap">
        <SectionHeading
          eyebrow={eyebrow}
          id={id}
          title={
            title ?? (
              <>
                Comment ça <em className="serif">se passe</em>
              </>
            )
          }
          lead={lead}
        />
        <div className="proc-wrap">
          {three ? (
            <div className="proc-line" aria-hidden>
              <span className="proc-fill" />
              <span className="proc-tip">
                <span className="bub" />
              </span>
            </div>
          ) : null}
          <ol
            className="proc-steps"
            style={three ? undefined : { gridTemplateColumns: `repeat(auto-fit, minmax(min(240px, 100%), 1fr))` }}
          >
            {steps.map((s, i) => (
              <li className="step" key={s.title} data-reveal>
                <span className="proc-dot is-on" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="step-t">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
