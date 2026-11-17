import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LogoMark } from '@/components/ui/Logo'
import { LoginForm } from './LoginForms'

/** Prerendered per param (or request-bound); opt out of the dev-only instant-navigation validation. */
export const instant = false

export const metadata: Metadata = { title: 'Connexion' }

const errors: Record<string, string> = {
  acces: 'Ce compte n’a pas accès à l’espace admin.',
  lien: 'Le lien a expiré ou n’est plus valide.',
}

async function Form({ searchParams }: { searchParams: PageProps<'/admin/login'>['searchParams'] }) {
  const sp = await searchParams
  const next = typeof sp.next === 'string' ? sp.next : undefined
  const err = typeof sp.error === 'string' ? errors[sp.error] : undefined
  return <LoginForm next={next} error={err} />
}

export default function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  return (
    <main className="grid min-h-dvh place-items-center p-5">
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-8 shadow-[var(--shadow-card)] md:p-10">
        <div className="flex items-center gap-3">
          <LogoMark className="size-11" />
          <div>
            <p className="font-display text-[22px] leading-none font-extrabold tracking-tight text-blue">+PROPRE</p>
            <p className="text-[14px] text-label">Espace administration</p>
          </div>
        </div>
        <h1 className="h3 mt-8">Connexion</h1>
        <div className="mt-6">
          <Suspense fallback={<LoginForm />}>
            <Form searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
