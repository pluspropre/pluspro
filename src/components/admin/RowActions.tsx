'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

type Result = { ok: boolean; error?: string }

/** Small switch bound to a server action (publish / feature toggles). */
export function ActionSwitch({ label, checked, action }: { label: string; checked: boolean; action: (v: boolean) => Promise<Result> }) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await action(!checked)
          if (!r.ok) window.alert(r.error)
          router.refresh()
        })
      }
      className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink disabled:opacity-60"
    >
      <span className={cn('relative h-6 w-11 rounded-full transition-colors', checked ? 'bg-green' : 'bg-line')}>
        <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]', checked ? 'left-[22px]' : 'left-0.5')} />
      </span>
      {label}
    </button>
  )
}

export function ActionButton({
  children,
  action,
  confirm,
  className,
  label,
}: {
  children: React.ReactNode
  action: () => Promise<Result>
  confirm?: string
  className?: string
  label?: string
}) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      type="button"
      aria-label={label}
      disabled={pending}
      className={cn('disabled:opacity-50', className)}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return
        start(async () => {
          const r = await action()
          if (!r.ok) window.alert(r.error)
          router.refresh()
        })
      }}
    >
      {children}
    </button>
  )
}
