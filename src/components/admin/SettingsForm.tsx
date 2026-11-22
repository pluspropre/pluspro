'use client'
import { useState, useTransition } from 'react'
import { days } from '@/content/site'
import type { Figure, OpeningDay, SiteSettings } from '@/lib/settings'
import { cn } from '@/lib/utils'
import { saveSettings } from '@/app/admin/(protected)/parametres/actions'
import { btn, Panel } from './ui'

function fullWeek(hours: OpeningDay[]): OpeningDay[] {
  return days.map((d) => hours.find((h) => h.day === d.key) ?? { day: d.key, open: d.key !== 'Su', opens: '08:00', closes: '19:00' })
}

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [pending, start] = useTransition()
  const [reviewUrl, setReviewUrl] = useState(initial.googleReviewUrl ?? '')
  const [summaryLabel, setSummaryLabel] = useState(initial.reviewsSummaryLabel)
  const [showStats, setShowStats] = useState(initial.showReviewStats)
  const [figures, setFigures] = useState<Figure[]>(initial.figures)
  const [eco, setEco] = useState(initial.showEcoProducts)
  const [contract, setContract] = useState(initial.contractTerms ?? '')
  const [hours, setHours] = useState<OpeningDay[]>(fullWeek(initial.openingHours))
  const [hoursNote, setHoursNote] = useState(initial.hoursNote ?? '')
  const [legalForm, setLegalForm] = useState(initial.legalForm ?? '')
  const [director, setDirector] = useState(initial.publicationDirector ?? '')
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setFigure = (i: number, patch: Partial<Figure>) => setFigures((f) => f.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const setDay = (i: number, patch: Partial<OpeningDay>) => setHours((h) => h.map((x, j) => (j === i ? { ...x, ...patch } : x)))

  const save = () => {
    setResult(null)
    start(async () => {
      const res = await saveSettings({
        google_review_url: reviewUrl.trim(),
        reviews_summary_label: summaryLabel,
        show_review_stats: showStats,
        figures,
        show_eco_products: eco,
        contract_terms: contract,
        opening_hours: hours,
        hours_note: hoursNote,
        legal_form: legalForm,
        publication_director: director,
      })
      setErrors(res.ok ? {} : (res.fieldErrors ?? {}))
      setResult({ ok: res.ok, text: res.ok ? (res.message ?? 'Enregistré.') : res.error })
    })
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <Panel title="Chiffres clés affichés sur le site">
        <p className="mb-5 text-[15px] text-label">
          Cochez « Confirmé » uniquement pour les chiffres que vous pouvez justifier. Un chiffre non confirmé n’apparaît
          nulle part (accueil, à propos, bandeau du haut).
        </p>
        <div className="grid gap-4">
          {figures.map((f, i) => (
            <fieldset key={f.key} className={cn('rounded-[20px] border p-4 md:p-5', f.enabled ? 'border-teal bg-mint/40' : 'border-line')}>
              <legend className="sr-only">Chiffre {f.label}</legend>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-[28px] leading-none font-extrabold text-ink">
                  {f.prefix}
                  {f.value}
                  {f.suffix} <span className="text-[15px] font-semibold text-label">{f.label}</span>
                </p>
                <label className="flex items-center gap-2 font-semibold text-ink">
                  <input type="checkbox" className="size-5 accent-[#0F766E]" checked={f.enabled} onChange={(e) => setFigure(i, { enabled: e.target.checked })} />
                  Confirmé, afficher
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[80px_120px_100px_1fr]">
                <div>
                  <label className="form-label text-[13px]" htmlFor={`f-pre-${i}`}>
                    Préfixe
                  </label>
                  <input id={`f-pre-${i}`} className="input" value={f.prefix} maxLength={4} onChange={(e) => setFigure(i, { prefix: e.target.value })} />
                </div>
                <div>
                  <label className="form-label text-[13px]" htmlFor={`f-val-${i}`}>
                    Valeur
                  </label>
                  <input id={`f-val-${i}`} className="input" value={f.value} maxLength={10} onChange={(e) => setFigure(i, { value: e.target.value })} />
                </div>
                <div>
                  <label className="form-label text-[13px]" htmlFor={`f-suf-${i}`}>
                    Suffixe
                  </label>
                  <input id={`f-suf-${i}`} className="input" value={f.suffix} maxLength={8} onChange={(e) => setFigure(i, { suffix: e.target.value })} />
                </div>
                <div>
                  <label className="form-label text-[13px]" htmlFor={`f-lab-${i}`}>
                    Libellé
                  </label>
                  <input id={`f-lab-${i}`} className="input" value={f.label} maxLength={80} onChange={(e) => setFigure(i, { label: e.target.value })} />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label text-[13px]" htmlFor={`f-desc-${i}`}>
                  Phrase d’explication
                </label>
                <input id={`f-desc-${i}`} className="input" value={f.description} maxLength={240} onChange={(e) => setFigure(i, { description: e.target.value })} />
              </div>
            </fieldset>
          ))}
          <label className="flex items-center gap-3 font-semibold text-ink">
            <input type="checkbox" className="size-5 accent-[#0F766E]" checked={eco} onChange={(e) => setEco(e.target.checked)} />
            Afficher « Produits écolabellisés » dans le bandeau d’accueil
          </label>
        </div>
      </Panel>

      <Panel title="Durée d’engagement minimale">
        <label className="form-label" htmlFor="s-contract">
          Texte affiché dans la FAQ « Y a-t-il un engagement de durée ? »
        </label>
        <textarea
          id="s-contract"
          className="input"
          rows={3}
          maxLength={400}
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          placeholder="ex. L’entretien régulier est conclu pour 3 mois minimum, puis résiliable avec un préavis d’un mois."
        />
        <p className="form-hint">Laissé vide, la FAQ indique que la durée et le préavis sont précisés dans chaque devis.</p>
      </Panel>

      <Panel title="Horaires d’ouverture (accueil téléphonique)">
        <div className="grid gap-2">
          {hours.map((h, i) => {
            const label = days.find((d) => d.key === h.day)?.label
            return (
              <div key={h.day} className="grid grid-cols-[110px_1fr] items-center gap-3 rounded-2xl bg-surface-2 p-3 sm:grid-cols-[130px_120px_1fr]">
                <span className="font-semibold text-ink">{label}</span>
                <label className="flex items-center gap-2 text-[15px]">
                  <input type="checkbox" className="size-5 accent-[#0F766E]" checked={h.open} onChange={(e) => setDay(i, { open: e.target.checked })} />
                  {h.open ? 'Ouvert' : 'Fermé'}
                </label>
                {h.open ? (
                  <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                    <label className="sr-only" htmlFor={`h-o-${i}`}>
                      Ouverture {label}
                    </label>
                    <input id={`h-o-${i}`} type="time" className="input !min-h-11 max-w-36" value={h.opens} onChange={(e) => setDay(i, { opens: e.target.value })} />
                    <span>–</span>
                    <label className="sr-only" htmlFor={`h-c-${i}`}>
                      Fermeture {label}
                    </label>
                    <input id={`h-c-${i}`} type="time" className="input !min-h-11 max-w-36" value={h.closes} onChange={(e) => setDay(i, { closes: e.target.value })} />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
        <div className="mt-4">
          <label className="form-label" htmlFor="s-hnote">
            Précision <span className="font-normal text-label">(facultatif)</span>
          </label>
          <input id="s-hnote" className="input" maxLength={200} value={hoursNote} onChange={(e) => setHoursNote(e.target.value)} placeholder="ex. Interventions 7j/7 sur rendez-vous, y compris tôt le matin et le soir." />
        </div>
        <p className="form-hint">Les horaires apparaissent dans le pied de page, la page À propos et les données Google (balisage local).</p>
      </Panel>

      <Panel title="Avis clients">
        <div className="grid gap-4">
          <div>
            <label className="form-label" htmlFor="s-review">
              Lien Google « Laisser un avis »
            </label>
            <input id="s-review" type="url" className="input" value={reviewUrl} onChange={(e) => setReviewUrl(e.target.value)} placeholder="https://g.page/r/…/review" />
            <p className="form-hint">
              Dans votre fiche Google Business Profile : « Demander des avis » → copier le lien. Sans lien, le bouton ouvre une
              recherche Google de l’entreprise.
            </p>
            {errors.google_review_url ? <p className="form-error">{errors.google_review_url}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="s-label">
                Libellé sous la note
              </label>
              <input id="s-label" className="input" value={summaryLabel} onChange={(e) => setSummaryLabel(e.target.value)} />
            </div>
            <label className="flex items-center gap-3 self-end pb-3 font-semibold text-ink">
              <input type="checkbox" className="size-5 accent-[#0F766E]" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} />
              Afficher la note moyenne et le nombre d’avis
            </label>
          </div>
        </div>
      </Panel>

      <Panel title="Mentions légales">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="s-legal">
              Forme juridique et capital
            </label>
            <input id="s-legal" className="input" value={legalForm} onChange={(e) => setLegalForm(e.target.value)} placeholder="ex. SASU au capital de 1 000 €" />
          </div>
          <div>
            <label className="form-label" htmlFor="s-dir">
              Directeur de la publication
            </label>
            <input id="s-dir" className="input" value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Prénom Nom" />
          </div>
        </div>
        <p className="form-hint">Raison sociale : +PROPRE · SIREN 992 924 944 (déjà renseignés).</p>
      </Panel>

      <div className="sticky bottom-20 z-10 flex flex-wrap items-center gap-4 rounded-[22px] bg-white p-4 shadow-[var(--shadow-card)] lg:bottom-4">
        <button type="submit" className={btn.primary} disabled={pending}>
          {pending ? 'Enregistrement…' : 'Enregistrer la configuration'}
        </button>
        {result ? (
          <p role="status" className={cn('font-semibold', result.ok ? 'text-teal-dk' : 'text-danger')}>
            {result.text}
          </p>
        ) : null}
      </div>
    </form>
  )
}
