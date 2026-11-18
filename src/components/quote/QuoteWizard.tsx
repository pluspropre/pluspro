'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm, type FieldErrors, type Path } from 'react-hook-form'
import { track } from '@vercel/analytics'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { publicEnv } from '@/lib/env'
import { frequencyOptions, ONE_OFF_TYPES, quoteSchema, typeValues, type QuoteInput } from '@/lib/validation/quote'
import { cn } from '@/lib/utils'
import { submitQuote } from '@/app/(site)/devis/actions'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from '@/components/ui/icons'

const STORAGE_KEY = 'pp-quote'
type FormValues = Partial<Omit<QuoteInput, 'consent'>> & { consent?: boolean }

const stepFields: Path<FormValues>[][] = [
  ['type', 'client'],
  ['surface', 'frequency', 'postalCode', 'city', 'sanitaires', 'cuisines', 'bureaux', 'fenetres', 'startDate'],
  ['fullName', 'company', 'jobTitle', 'email', 'phone', 'address', 'message', 'consent'],
]
const stepTitles = ['Votre besoin', 'Vos locaux', 'Vos coordonnées']

const fieldLabels: Record<string, string> = {
  type: 'Type de prestation',
  client: 'Professionnel ou particulier',
  surface: 'Surface',
  frequency: 'Fréquence',
  postalCode: 'Code postal',
  city: 'Ville',
  fullName: 'Nom et prénom',
  email: 'E-mail',
  phone: 'Téléphone',
  message: 'Message',
  company: 'Société',
  sanitaires: 'Sanitaires',
  cuisines: 'Cuisines',
  bureaux: 'Bureaux',
  fenetres: 'Fenêtres et baies vitrées',
  consent: 'Consentement',
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p className="form-error" id={id}>
      {msg}
    </p>
  ) : null
}

export function QuoteWizardWithParams() {
  const params = useSearchParams()
  const prefill: FormValues = {}
  const type = params.get('type')
  if (type && typeValues.includes(type)) prefill.type = type
  const surface = Number(params.get('surface'))
  if (Number.isInteger(surface) && surface > 0) prefill.surface = surface
  const freq = params.get('frequence')
  if (freq && frequencyOptions.some((o) => o.value === freq)) prefill.frequency = freq
  return <QuoteWizard prefill={prefill} />
}

export function QuoteWizard({ prefill = {} }: { prefill?: FormValues }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [token, setToken] = useState<string>()
  const startedAt = useRef(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const firstRender = useRef(true)
  const siteKey = publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(quoteSchema) as never,
    mode: 'onTouched',
    defaultValues: { client: 'pro', ...prefill },
    shouldFocusError: false,
  })

  const type = watch('type')
  const client = watch('client')
  const oneOff = type ? ONE_OFF_TYPES.includes(type) : false

  // restore progress (URL prefill wins), remember start time
  useEffect(() => {
    startedAt.current = Date.now()
    let start = 0
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const { _step, ...values } = JSON.parse(saved) as FormValues & { _step?: number }
        reset({ client: 'pro', ...values, ...prefill, consent: false })
        start = Math.min(2, Math.max(0, _step ?? 0))
      }
    } catch {
      /* storage unavailable */
    }
    // prefilled from a service page or the home quote bar: start on the first incomplete step
    if (prefill.type && (prefill.surface || prefill.frequency)) start = Math.max(start, 1)
    if (start > 0) setStep(start) // eslint-disable-line react-hooks/set-state-in-effect -- restore after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // persist progress
  useEffect(() => {
    const sub = watch((values) => {
      try {
        const { consent: _c, ...rest } = values // eslint-disable-line @typescript-eslint/no-unused-vars
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, _step: step }))
      } catch {
        /* ignore */
      }
    })
    return () => sub.unsubscribe()
  }, [watch, step])

  // one-off services default to "Ponctuelle"
  useEffect(() => {
    if (oneOff) setValue('frequency', 'ponctuelle')
  }, [oneOff, setValue])

  // move focus to the step heading on step change
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  // Turnstile (only on step 3, only when configured)
  useEffect(() => {
    if (!siteKey || step !== 2 || !turnstileRef.current) return
    const mount = () => {
      if (!window.turnstile || !turnstileRef.current || widgetId.current) return
      widgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        language: 'fr',
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(undefined),
      })
    }
    if (window.turnstile) mount()
    else {
      const s = document.createElement('script')
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      s.onload = mount
      document.head.appendChild(s)
    }
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [siteKey, step])

  const next = async () => {
    const ok = await trigger(stepFields[step])
    if (ok) setStep((s) => Math.min(2, s + 1))
    else summaryRef.current?.focus()
  }

  const onSubmit = (values: FormValues) => {
    setServerError(null)
    if (siteKey && !token) {
      setServerError('Merci de valider la vérification anti-spam ci-dessus.')
      return
    }
    const form = document.getElementById('quote-form') as HTMLFormElement | null
    const website = (form?.elements.namedItem('website') as HTMLInputElement | null)?.value ?? ''
    startTransition(async () => {
      const res = await submitQuote({
        ...values,
        website,
        startedAt: startedAt.current,
        turnstileToken: token,
        sourcePath: '/devis',
      })
      if (res.ok) {
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
        track('quote_submitted', { type: values.type ?? 'autre' })
        router.push('/devis/merci')
        return
      }
      if (res.fieldErrors) {
        for (const [k, msg] of Object.entries(res.fieldErrors)) setError(k as Path<FormValues>, { message: msg })
        const firstStep = stepFields.findIndex((f) => f.some((name) => res.fieldErrors?.[name]))
        if (firstStep >= 0) setStep(firstStep)
      }
      setServerError(res.error)
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    })
  }

  const onInvalid = (errs: FieldErrors<FormValues>) => {
    const firstStep = stepFields.findIndex((f) => f.some((name) => errs[name as keyof FormValues]))
    if (firstStep >= 0 && firstStep !== step) setStep(firstStep)
    window.setTimeout(() => summaryRef.current?.focus(), 0)
  }

  const stepErrors = stepFields[step]
    .map((f) => [f, errors[f as keyof FormValues]?.message] as const)
    .filter(([, m]) => Boolean(m))
  const a = (name: keyof FormValues) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${String(name)}-err` : undefined,
  })

  return (
    <form id="quote-form" noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="card p-6 md:p-10">
      {/* progress */}
      <div>
        <p className="text-[14px] font-semibold text-label" aria-live="polite">
          Étape {step + 1} sur 3 · {stepTitles[step]}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden>
          <div className="h-full rounded-full bg-teal transition-[width] duration-700" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="h3 mt-8 text-[28px] outline-none">
        {stepTitles[step]}
      </h2>

      {stepErrors.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-2xl border border-danger/30 bg-[#fff6f5] p-5 outline-none">
          <p className="font-semibold text-danger">Merci de corriger {stepErrors.length > 1 ? 'les champs suivants' : 'le champ suivant'}&nbsp;:</p>
          <ul className="mt-2 list-disc pl-5 text-[15px]">
            {stepErrors.map(([f, m]) => (
              <li key={f}>
                <a className="underline" href={`#f-${f}`}>
                  {fieldLabels[f] ?? f}
                </a>
                &nbsp;: {m}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div ref={summaryRef} tabIndex={-1} className="outline-none" />
      )}

      {/* STEP 1 */}
      <div hidden={step !== 0} className="mt-8 grid gap-8">
        <fieldset aria-describedby={errors.type ? 'type-err' : undefined}>
          <legend className="form-label">Type de prestation</legend>
          <div className="grid gap-3 sm:grid-cols-2" id="f-type">
            {services.map((s) => (
              <label key={s.slug} className="choice">
                <input type="radio" value={s.slug} {...register('type')} />
                <span>
                  <strong>{s.name}</strong>
                </span>
              </label>
            ))}
            <label className="choice">
              <input type="radio" value="autre" {...register('type')} />
              <span>
                <strong>Autre besoin</strong>
                <span>Décrivez-le à l’étape 3</span>
              </span>
            </label>
          </div>
          <Err id="type-err" msg={errors.type?.message} />
        </fieldset>
        <fieldset>
          <legend className="form-label">Vous êtes</legend>
          <div className="flex flex-wrap gap-3" id="f-client">
            <label className="choice choice--pill">
              <input type="radio" value="pro" {...register('client')} />
              Un professionnel
            </label>
            <label className="choice choice--pill">
              <input type="radio" value="particulier" {...register('client')} />
              Un particulier
            </label>
          </div>
          <Err id="client-err" msg={errors.client?.message} />
        </fieldset>
      </div>

      {/* STEP 2 */}
      <div hidden={step !== 1} className="mt-8 grid gap-8">
        <div className="max-w-xs">
          <label className="form-label" htmlFor="f-surface">
            Surface (m²)
          </label>
          <input id="f-surface" className="input" inputMode="numeric" placeholder="ex. 250" aria-required {...register('surface')} {...a('surface')} />
          <Err id="surface-err" msg={errors.surface?.message} />
        </div>
        {oneOff ? (
          <input type="hidden" value="ponctuelle" {...register('frequency')} />
        ) : (
          <fieldset>
            <legend className="form-label">Fréquence souhaitée</legend>
            <div className="flex flex-wrap gap-3" id="f-frequency">
              {frequencyOptions.map((o) => (
                <label key={o.value} className="choice choice--pill">
                  <input type="radio" value={o.value} {...register('frequency')} />
                  {o.label}
                </label>
              ))}
            </div>
            <Err id="frequency-err" msg={errors.frequency?.message} />
          </fieldset>
        )}
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <div>
            <label className="form-label" htmlFor="f-postalCode">
              Code postal
            </label>
            <input id="f-postalCode" className="input" inputMode="numeric" autoComplete="postal-code" maxLength={5} {...register('postalCode')} {...a('postalCode')} />
            <Err id="postalCode-err" msg={errors.postalCode?.message} />
          </div>
          <div>
            <label className="form-label" htmlFor="f-city">
              Ville
            </label>
            <input id="f-city" className="input" autoComplete="address-level2" {...register('city')} {...a('city')} />
            <Err id="city-err" msg={errors.city?.message} />
          </div>
        </div>
        <details className="rounded-2xl border border-line p-5">
          <summary className="cursor-pointer font-semibold text-ink">Préciser vos locaux (facultatif)</summary>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(
              [
                ['sanitaires', 'Nombre de sanitaires'],
                ['cuisines', 'Cuisines / kitchenettes'],
                ['bureaux', 'Bureaux / salles'],
                ['fenetres', 'Nombre de fenêtres et baies vitrées'],
              ] as const
            ).map(([name, label]) => (
              <div key={name}>
                <label className="form-label" htmlFor={`f-${name}`}>
                  {label}
                </label>
                <input id={`f-${name}`} className="input" inputMode="numeric" {...register(name)} {...a(name)} />
                <Err id={`${name}-err`} msg={errors[name]?.message} />
              </div>
            ))}
          </div>
          <div className="mt-4 sm:max-w-[calc(50%-8px)]">
            <label className="form-label" htmlFor="f-startDate">
              Date de démarrage souhaitée
            </label>
            <input id="f-startDate" type="date" className="input" {...register('startDate')} />
          </div>
        </details>
      </div>

      {/* STEP 3 */}
      <div hidden={step !== 2} className="mt-8 grid gap-5">
        <div>
          <label className="form-label" htmlFor="f-fullName">
            Nom et prénom
          </label>
          <input id="f-fullName" className="input" autoComplete="name" {...register('fullName')} {...a('fullName')} />
          <Err id="fullName-err" msg={errors.fullName?.message} />
        </div>
        {client === 'pro' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="f-company">
                Société <span className="font-normal text-label">(facultatif)</span>
              </label>
              <input id="f-company" className="input" autoComplete="organization" {...register('company')} />
            </div>
            <div>
              <label className="form-label" htmlFor="f-jobTitle">
                Fonction <span className="font-normal text-label">(facultatif)</span>
              </label>
              <input id="f-jobTitle" className="input" autoComplete="organization-title" {...register('jobTitle')} />
            </div>
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="f-email">
              E-mail
            </label>
            <input id="f-email" type="email" className="input" autoComplete="email" {...register('email')} {...a('email')} />
            <Err id="email-err" msg={errors.email?.message} />
          </div>
          <div>
            <label className="form-label" htmlFor="f-phone">
              Téléphone
            </label>
            <input id="f-phone" type="tel" className="input" autoComplete="tel" {...register('phone')} {...a('phone')} />
            <Err id="phone-err" msg={errors.phone?.message} />
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="f-address">
            Adresse des locaux <span className="font-normal text-label">(facultatif)</span>
          </label>
          <input id="f-address" className="input" autoComplete="street-address" {...register('address')} />
        </div>
        <div>
          <label className="form-label" htmlFor="f-message">
            Message <span className="font-normal text-label">(facultatif)</span>
          </label>
          <textarea id="f-message" className="input" rows={4} placeholder="Horaires, contraintes d’accès, zones sensibles…" {...register('message')} {...a('message')} />
          <Err id="message-err" msg={errors.message?.message} />
        </div>
        {/* honeypot: hidden from people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="f-website">Site web</label>
          <input id="f-website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <div>
          <label className="flex items-start gap-3 text-[15px] leading-relaxed" htmlFor="f-consent">
            <input id="f-consent" type="checkbox" className="mt-1 size-5 shrink-0 accent-[#0F766E]" {...register('consent')} {...a('consent')} />
            <span>
              J’accepte que +Propre utilise ces informations pour traiter ma demande de devis et me recontacter. En savoir
              plus dans notre{' '}
              <Link className="link" href="/politique-de-confidentialite" target="_blank">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <Err id="consent-err" msg={errors.consent?.message} />
        </div>
        {siteKey ? <div ref={turnstileRef} className="min-h-[65px]" /> : null}
      </div>

      {serverError ? (
        <p role="alert" className="mt-6 rounded-2xl bg-[#fff6f5] p-4 font-semibold text-danger">
          {serverError}
          <br />
          <span className="font-normal text-ink">Besoin d’aide&nbsp;? </span>
          <a className="underline" href={`tel:${site.phone.e164}`}>
            {site.phone.display}
          </a>
        </p>
      ) : null}

      <div className={cn('mt-10 flex flex-wrap items-center gap-3', step > 0 ? 'justify-between' : 'justify-end')}>
        {step > 0 ? (
          <button type="button" className="btn btn--ghost btn--plain gap-2" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft width={16} height={16} />
            Retour
          </button>
        ) : null}
        {/* Distinct keys: if React reused the same <button> and only flipped its type to "submit", the click that
            validates step 2 (next() resolves in a microtask, before the browser's default action) would also
            submit the form and show every step-3 error before the visitor has typed anything. */}
        {step < 2 ? (
          <Button key="next" onClick={next}>
            Continuer
          </Button>
        ) : (
          <Button key="submit" type="submit" disabled={pending}>
            {pending ? 'Envoi en cours…' : 'Envoyer ma demande'}
          </Button>
        )}
      </div>
      {step === 2 ? (
        <p className="mt-6 text-[13px] leading-relaxed text-label">
          Vos données sont traitées par +Propre pour répondre à votre demande de devis et vous recontacter. Elles sont
          conservées 3 ans au plus et ne sont jamais cédées. Vous pouvez exercer vos droits d’accès, de rectification et
          d’effacement à {site.email}.{' '}
          <Link className="underline" href="/politique-de-confidentialite">
            Politique de confidentialité
          </Link>
        </p>
      ) : null}
    </form>
  )
}
