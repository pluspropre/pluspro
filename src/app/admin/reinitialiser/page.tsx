import type { Metadata } from 'next'
import { NewPasswordForm } from '../login/LoginForms'

export const metadata: Metadata = { title: 'Nouveau mot de passe' }

export default function ResetPage() {
  return (
    <main className="grid min-h-dvh place-items-center p-5">
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-8 shadow-[var(--shadow-card)] md:p-10">
        <h1 className="h3">Choisissez un nouveau mot de passe</h1>
        <div className="mt-6">
          <NewPasswordForm />
        </div>
      </div>
    </main>
  )
}
