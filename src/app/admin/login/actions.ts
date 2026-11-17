'use server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { siteUrl } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type AuthState = { error?: string; info?: string } | undefined

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  next: z.string().optional(),
})

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Identifiants incorrects.' }
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password })
  if (error) return { error: 'Identifiants incorrects.' }
  const next = parsed.data.next?.startsWith('/admin') ? parsed.data.next : '/admin'
  redirect(next)
}

export async function requestReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = z.email().safeParse(formData.get('email'))
  if (email.success) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${siteUrl()}/admin/auth/callback?next=/admin/reinitialiser`,
    })
  }
  // same answer whether or not the account exists
  return { info: 'Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d’être envoyé.' }
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const pwd = z
    .object({ password: z.string().min(10, '10 caractères minimum.'), confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: 'Les deux mots de passe sont différents.' })
    .safeParse(Object.fromEntries(formData))
  if (!pwd.success) return { error: pwd.error.issues[0]?.message ?? 'Mot de passe invalide.' }
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password: pwd.data.password })
  if (error) return { error: 'Le lien a expiré. Recommencez la procédure « Mot de passe oublié ».' }
  redirect('/admin')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
