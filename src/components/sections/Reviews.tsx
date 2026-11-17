import { getReviews, getReviewStats } from '@/lib/data/reviews'
import { getSettings } from '@/lib/data/settings'
import { site } from '@/content/site'
import { formatRating } from '@/lib/utils'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Stars } from '@/components/ui/Stars'
import { ReviewsCarousel } from './ReviewsCarousel'

/** Admin-managed reviews (no Google API): average + count, carousel, "Laisser un avis". */
export async function Reviews({ service, title }: { service?: string; title?: React.ReactNode }) {
  const [reviews, stats, settings] = await Promise.all([getReviews({ service }), getReviewStats(), getSettings()])
  if (reviews.length === 0) return null
  const reviewUrl = settings.googleReviewUrl ?? site.googleSearchUrl
  return (
    <section className="sec sec--tight overflow-hidden" aria-labelledby="t-rev">
      <div className="wrap rev">
        <div>
          <div data-reveal>
            <Eyebrow>Avis clients</Eyebrow>
            <h2 className="h2" id="t-rev">
              {title ?? (
                <>
                  Ils nous font <em className="serif">confiance</em>
                </>
              )}
            </h2>
          </div>
          {settings.showReviewStats && stats.average !== null ? (
            <div className="rating">
              <div className="rating-n">{formatRating(stats.average)}</div>
              <Stars rating={stats.average} />
              <div className="rating-l">
                <span>
                  {stats.count} avis · {settings.reviewsSummaryLabel}
                </span>
                <a className="ul" href={reviewUrl} target="_blank" rel="noopener">
                  Laisser un avis
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-8">
              <a className="link" href={reviewUrl} target="_blank" rel="noopener">
                Laisser un avis sur Google
              </a>
            </p>
          )}
        </div>
        <ReviewsCarousel reviews={reviews} />
      </div>
    </section>
  )
}
