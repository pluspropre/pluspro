import Image from 'next/image'
import Link from 'next/link'
import type { Service } from '@/content/types'
import { ArrowUpRight } from '@/components/ui/icons'

export function ServiceCard({ service, headingLevel = 3 }: { service: Service; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link href={`/services/${service.slug}`} className="svc zoomable group block" data-cursor="view">
      <div className="media relative aspect-[4/3]">
        <Image src={service.photo.src} alt={service.photo.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 400px" className="object-cover" />
      </div>
      <div className="mt-5 flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <H className="h3">{service.name}</H>
          <p className="mt-2 text-[16px] leading-normal">{service.short}</p>
        </div>
        <span className="cap-a mt-1" aria-hidden>
          <ArrowUpRight />
        </span>
      </div>
    </Link>
  )
}
