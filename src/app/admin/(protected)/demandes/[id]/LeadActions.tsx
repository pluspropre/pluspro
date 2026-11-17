'use client'
import { useEffect, useTransition } from 'react'
import { btn } from '@/components/admin/ui'
import { deleteLead, markLeadRead } from '../actions'

export function MarkReadOnOpen({ id, unread }: { id: string; unread: boolean }) {
  useEffect(() => {
    if (unread) void markLeadRead(id, true)
  }, [id, unread])
  return null
}

export function LeadButtons({ id }: { id: string }) {
  const [pending, start] = useTransition()
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={btn.ghost} disabled={pending} onClick={() => start(async () => void (await markLeadRead(id, false)))}>
        Marquer comme non lue
      </button>
      <button
        type="button"
        className={btn.danger}
        disabled={pending}
        onClick={() => {
          if (window.confirm('Supprimer définitivement cette demande ? Cette action est irréversible (droit à l’effacement RGPD).'))
            start(async () => void (await deleteLead(id)))
        }}
      >
        Supprimer (RGPD)
      </button>
    </div>
  )
}
