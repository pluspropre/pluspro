'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <h1>Une erreur est survenue</h1>
          <p>Merci de réessayer, ou de nous appeler au 07 65 55 11 11.</p>
          <button type="button" onClick={reset} style={{ padding: '12px 24px', borderRadius: 999, border: 0, background: '#3BB273', fontWeight: 600 }}>
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
