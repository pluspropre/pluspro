'use client'
import { site } from '@/content/site'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="contenu" className="grid min-h-[70dvh] place-items-center bg-white px-5 py-32 text-center">
      <div className="max-w-lg">
        <h1 className="h1 h1--page">Une erreur est survenue</h1>
        <p className="lead mt-6">
          Le chargement de la page a échoué. Vous pouvez réessayer, ou nous appeler au{' '}
          <a className="link" href={`tel:${site.phone.e164}`}>
            {site.phone.display}
          </a>
          .
        </p>
        <button type="button" className="btn btn--green btn--plain mt-8" onClick={reset}>
          Réessayer
        </button>
      </div>
    </main>
  )
}
