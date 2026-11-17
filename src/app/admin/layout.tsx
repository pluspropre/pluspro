import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Espace admin', template: '%s · Admin +Propre' },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-surface-2 text-[16px]">{children}</div>
}
