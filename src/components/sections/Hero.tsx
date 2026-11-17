import Image from 'next/image'
import { ButtonLink } from '@/components/ui/Button'
import type { SiteSettings } from '@/lib/settings'
import { enabledFigure } from '@/lib/settings'

const bubbles = [
  [
    { l: '8%', t: '62%', s: 46, d: '19s', dl: '-3s' },
    { l: '22%', t: '84%', s: 22, d: '15s', dl: '-9s' },
    { l: '71%', t: '78%', s: 30, d: '17s', dl: '-6s' },
    { l: '90%', t: '46%', s: 18, d: '14s', dl: '-2s' },
  ],
  [
    { l: '15%', t: '38%', s: 64, d: '24s', dl: '-12s' },
    { l: '36%', t: '70%', s: 28, d: '18s', dl: '-4s' },
    { l: '82%', t: '88%', s: 56, d: '22s', dl: '-15s' },
    { l: '62%', t: '30%', s: 20, d: '16s', dl: '-7s' },
  ],
]

function Avatar({ bg, fg }: { bg: string; fg: string }) {
  return (
    <span className="av" style={{ background: bg }}>
      <svg viewBox="0 0 34 34">
        <circle cx="17" cy="13" r="7" fill={fg} opacity="0.55" />
        <path d="M3 34c1-9 7-13 14-13s13 4 14 13z" fill={fg} opacity="0.55" />
      </svg>
    </span>
  )
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const sites = enabledFigure(settings, 'sites')
  const team = enabledFigure(settings, 'team')
  const availability = enabledFigure(settings, 'availability')
  const chips = [
    settings.showEcoProducts ? { label: 'Produits écolabellisés', color: '#1FA39A' } : null,
    team ? { label: 'Équipe formée et assurée', color: '#9DB2F5' } : null,
    availability ? { label: 'Interventions 7j/7', color: '#0B1B3F' } : null,
  ].filter(Boolean) as { label: string; color: string }[]

  return (
    <section className="hero" aria-labelledby="hero-title" data-hero>
      <div className="hero-card">
        <div className="bubbles" aria-hidden>
          {bubbles.map((layer, i) => (
            <div className="bub-l" data-depth={i === 0 ? 0.35 : 0.9} key={i}>
              {layer.map((b, j) => (
                <span
                  key={j}
                  className="bub"
                  style={
                    { left: b.l, top: b.t, width: b.s, height: b.s, '--d': b.d, '--dl': b.dl } as React.CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>

        <div className="hero-copy">
          <span className="badge" data-hero-badge>
            <span className="dot" />
            Nettoyage professionnel à Strasbourg
          </span>
          <h1 className="h1" id="hero-title">
            <span className="ln">
              <span className="w">La</span>
            </span>{' '}
            <span className="ln">
              <span className="w">propreté,</span>
            </span>{' '}
            <span className="ln acc">
              <span className="w">
                <em className="serif">notre</em>
                <span className="shine" aria-hidden />
              </span>
            </span>{' '}
            <span className="ln">
              <span className="w">engagement.</span>
            </span>
          </h1>
          <p className="sub" data-hero-fade>
            Bureaux, cabinets médicaux, commerces, copropriétés&nbsp;: des prestations sur mesure, une équipe formée et un
            devis sous 24h.
          </p>
          <div className="hero-ctas" data-hero-fade>
            <ButtonLink href="/devis" magnetic>
              Obtenir mon devis
            </ButtonLink>
            <ButtonLink href="#services" variant="ghost" arrow={false}>
              Découvrir nos services
            </ButtonLink>
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-vis">
            <svg className="arcs" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax meet" aria-hidden>
              <path d="M170 520 A430 430 0 0 1 1030 520" />
              <path d="M100 520 A500 500 0 0 1 167 270" />
              <path d="M1033 270 A500 500 0 0 1 1100 520" />
              <path d="M40 520 A560 560 0 0 1 74 330" />
              <path d="M1126 330 A560 560 0 0 1 1160 520" />
            </svg>
            <div className="semi" aria-hidden />
            <div className="person-mask" data-person>
              <Image
                src="/images/illustrations/equipe-agents-entretien.webp"
                alt="Illustration de deux agents d’entretien +Propre avec raclette, balai, seau et caisse de produits"
                fill
                priority
                sizes="(max-width: 767px) 340px, (max-width: 1024px) 420px, 640px"
              />
            </div>
            <svg className="sparks" viewBox="0 0 72 72" aria-hidden>
              <path className="spark" d="M8 40 L14 10" stroke="#1FA39A" />
              <path className="spark" d="M24 46 L44 24" stroke="#9DB2F5" />
              <path className="spark" d="M30 62 L58 54" stroke="#1FA39A" />
            </svg>
            <svg className="harrow" viewBox="0 0 280 160" aria-hidden>
              <path className="ar-body" d="M20 150 C30 62 150 8 258 70" />
              <path className="ar-head" d="M236 54 L260 72 L233 84" />
            </svg>
          </div>

          {sites ? (
            <div className="proof">
              <div className="par" data-depth="0.6">
                <div className="flt">
                  <div className="proof-in">
                    <div className="avs" aria-hidden>
                      <Avatar bg="#D9E3FF" fg="#2346C2" />
                      <Avatar bg="#FCE6D2" fg="#B4642A" />
                      <Avatar bg="#D3F1EA" fg="#0F766E" />
                    </div>
                    <div>
                      <div className="proof-n">
                        {sites.prefix}
                        {sites.value}
                        {sites.suffix}
                      </div>
                      <div className="proof-t">{sites.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {chips.length > 0 ? (
            <ul className="chips" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {chips.map((c, i) => (
                <li className="par" data-depth={[0.8, 0.5, 1][i]} key={c.label}>
                  <div className="flt">
                    <span className="hchip">
                      <i style={{ background: c.color }} />
                      {c.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
