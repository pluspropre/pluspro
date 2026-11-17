export default function Loading() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-live="polite">
      <div className="h-10 w-56 animate-pulse rounded-2xl bg-white" />
      <div className="h-40 animate-pulse rounded-[24px] bg-white" />
      <div className="h-40 animate-pulse rounded-[24px] bg-white" />
      <span className="sr-only">Chargement…</span>
    </div>
  )
}
