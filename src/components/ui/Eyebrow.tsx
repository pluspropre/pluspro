import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { PlusIcon } from './icons'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('eyebrow', className)}>
      <PlusIcon className="eb-plus" />
      {children}
    </span>
  )
}
