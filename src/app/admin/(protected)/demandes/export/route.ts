import { getAdminOrNull } from '@/lib/auth/requireAdmin'
import { leadCallback, leadFrequency, leadService, leadSurface } from '@/lib/admin/leads'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const cell = (v: unknown) => {
  const s = String(v ?? '').replace(/"/g, '""')
  // neutralise spreadsheet formula injection
  return `"${/^[=+\-@]/.test(s) ? `'${s}` : s}"`
}

/** CSV export of all leads for the client's CRM (admin only; RLS applies). */
export async function GET() {
  if (!(await getAdminOrNull())) return new Response('Non autorisé', { status: 401 })
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false })
  if (error) return new Response('Export impossible', { status: 500 })
  const head = ['Date', 'Nom', 'Société', 'Fonction', 'E-mail', 'Téléphone', 'Prestation', 'Client', 'Surface', 'Fréquence', 'Code postal', 'Ville', 'Rappel', 'Message', 'Lue']
  const rows = data.map((l) => [
    l.created_at,
    l.full_name,
    l.company,
    l.job_title,
    l.email,
    l.phone,
    leadService(l),
    l.client_type,
    leadSurface(l),
    leadFrequency(l),
    l.postal_code,
    l.city,
    leadCallback(l),
    l.message,
    l.read_at ? 'oui' : 'non',
  ])
  const csv = '﻿' + [head, ...rows].map((r) => r.map(cell).join(';')).join('\r\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="demandes-devis-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
