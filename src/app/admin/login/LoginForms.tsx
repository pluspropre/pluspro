'use client'
import { useActionState, useState } from 'react'
import { requestReset, signIn, updatePassword } from './actions'

export function LoginForm({ next, error }: { next?: string; error?: string }) {
  const [state, action, pending] = useActionState(signIn, error ? { error } : undefined)
  const [forgot, setForgot] = useState(false)
  if (forgot) return <ResetRequestForm onBack={() => setForgot(false)} />
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="next" value={next ?? '/admin'} />
      <div>
        <label className="form-label" htmlFor="email">
          E-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="input" />
      </div>
      <div>
        <label className="form-label" htmlFor="password">
          Mot de passe
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      {state?.error ? (
        <p role="alert" className="form-error">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn--green btn--plain w-full" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
      <button type="button" className="text-[15px] font-semibold text-teal-dk underline underline-offset-4" onClick={() => setForgot(true)}>
        Mot de passe oublié&nbsp;?
      </button>
    </form>
  )
}

function ResetRequestForm({ onBack }: { onBack: () => void }) {
  const [state, action, pending] = useActionState(requestReset, undefined)
  return (
    <form action={action} className="grid gap-5">
      <p className="text-[15px]">Indiquez votre e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.</p>
      <div>
        <label className="form-label" htmlFor="reset-email">
          E-mail
        </label>
        <input id="reset-email" name="email" type="email" autoComplete="username" required className="input" />
      </div>
      {state?.info ? (
        <p role="status" className="rounded-2xl bg-mint p-4 text-[15px] text-ink">
          {state.info}
        </p>
      ) : null}
      <button type="submit" className="btn btn--green btn--plain w-full" disabled={pending}>
        {pending ? 'Envoi…' : 'Recevoir le lien'}
      </button>
      <button type="button" className="text-[15px] font-semibold text-teal-dk underline underline-offset-4" onClick={onBack}>
        Retour à la connexion
      </button>
    </form>
  )
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined)
  return (
    <form action={action} className="grid gap-5">
      <div>
        <label className="form-label" htmlFor="password">
          Nouveau mot de passe
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required className="input" />
        <p className="form-hint">10 caractères minimum.</p>
      </div>
      <div>
        <label className="form-label" htmlFor="confirm">
          Confirmer le mot de passe
        </label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className="input" />
      </div>
      {state?.error ? (
        <p role="alert" className="form-error">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="btn btn--green btn--plain w-full" disabled={pending}>
        {pending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
