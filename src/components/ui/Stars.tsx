import { cn, formatRating } from '@/lib/utils'
import { StarPath } from './icons'

export function Stars({ rating, size = 'md', className }: { rating: number; size?: 'sm' | 'md'; className?: string }) {
  return (
    <div className={cn('stars', size === 'sm' && 'stars--sm', className)} role="img" aria-label={`Note : ${formatRating(rating)} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <span className="star" key={i} aria-hidden>
            <svg className="s0" viewBox="0 0 24 24">
              <path d={StarPath} fill="currentColor" />
            </svg>
            <span className="star-f" style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}>
              <svg viewBox="0 0 24 24">
                <path d={StarPath} fill="currentColor" />
              </svg>
            </span>
          </span>
        )
      })}
    </div>
  )
}
