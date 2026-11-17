'use client'
import { useRef } from 'react'
import { gsap, PLAY_ONCE, prefersReducedMotion, useGSAP } from '@/components/motion/gsap'

/** Giant "+PROPRE" watermark with cleaning products rising from the bottom (decorative). */
export function FooterWatermark() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.wm-l', {
        yPercent: 100,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: 'top 95%', ...PLAY_ONCE },
      })
      gsap.from('.prod', {
        y: 120,
        scale: 0.6,
        duration: 1,
        ease: 'back.out(1.6)',
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', ...PLAY_ONCE },
      })
    },
    { scope: ref },
  )
  return (
    <div className="foot-wm" aria-hidden ref={ref}>
      <div className="wm">
        {['+', 'P', 'R', 'O', 'P', 'R', 'E'].map((l, i) => (
          <span key={i} className={i === 0 ? 'wm-l plus' : 'wm-l'}>
            {l}
          </span>
        ))}
      </div>
      <div className="prods">
        <svg className="prod" viewBox="0 0 170 110" style={{ width: 'clamp(70px, 11vw, 180px)' }}>
          <rect x="6" y="70" width="158" height="36" rx="12" fill="#9FE0D6" />
          <rect x="14" y="40" width="146" height="34" rx="12" fill="#EAD3F5" />
          <rect x="4" y="10" width="150" height="34" rx="12" fill="#B9C8F5" />
          <path d="M20 27h120M24 57h120M22 88h126" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="4 6" />
        </svg>
        <svg className="prod" viewBox="0 0 110 230" style={{ width: 'clamp(42px, 6.6vw, 112px)' }}>
          <path d="M22 100 H88 V214 Q88 226 76 226 H34 Q22 226 22 214 Z" fill="#2346C2" />
          <rect x="38" y="70" width="34" height="32" rx="4" fill="#E6ECF5" />
          <path d="M26 34 H84 L94 72 H24 Z" fill="#3BB273" />
          <rect x="4" y="38" width="26" height="12" rx="4" fill="#3BB273" />
          <path d="M62 74 L54 98" stroke="#2E9A60" strokeWidth="8" strokeLinecap="round" />
          <rect x="32" y="136" width="46" height="56" rx="8" fill="#FFFFFF" />
          <path d="M55 150 V178 M41 164 H69" stroke="#1FA39A" strokeWidth="7" strokeLinecap="round" />
        </svg>
        <svg className="prod" viewBox="0 0 220 210" style={{ width: 'clamp(100px, 15vw, 240px)' }}>
          <path d="M24 66 C24 4 196 4 196 66" fill="none" stroke="#E6ECF5" strokeWidth="5" />
          <g transform="rotate(-12 88 44)">
            <rect x="60" y="22" width="56" height="44" rx="8" fill="#F4C542" />
            <rect x="60" y="22" width="56" height="16" rx="6" fill="#3BB273" />
          </g>
          <path d="M124 64 C126 30 160 14 176 26 C186 34 172 50 156 64 Z" fill="#B9C8F5" />
          <path d="M28 70 H192 L174 196 Q172 206 162 206 H58 Q48 206 46 196 Z" fill="#1FA39A" />
          <path d="M38 112 H182" stroke="#178C84" strokeWidth="6" />
          <rect x="18" y="58" width="184" height="20" rx="10" fill="#178C84" />
          <path d="M104 136 v34 M87 153 h34" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
        </svg>
        <svg className="prod" viewBox="0 0 160 100" style={{ width: 'clamp(70px, 10vw, 160px)' }}>
          <rect x="4" y="34" width="152" height="62" rx="14" fill="#F4C542" />
          <rect x="4" y="16" width="152" height="30" rx="10" fill="#3BB273" />
          <circle cx="34" cy="64" r="4" fill="#E0AE2C" />
          <circle cx="64" cy="78" r="3" fill="#E0AE2C" />
          <circle cx="96" cy="62" r="4" fill="#E0AE2C" />
          <circle cx="128" cy="80" r="3" fill="#E0AE2C" />
        </svg>
        <svg className="prod" viewBox="0 0 100 210" style={{ width: 'clamp(36px, 5.6vw, 96px)' }}>
          <rect x="34" y="8" width="32" height="34" rx="6" fill="#2346C2" />
          <rect x="40" y="40" width="20" height="16" fill="#C9D4EA" />
          <path d="M14 74 Q14 56 32 56 H68 Q86 56 86 74 V196 Q86 206 76 206 H24 Q14 206 14 196 Z" fill="#F2F5FA" />
          <rect x="24" y="104" width="52" height="64" rx="8" fill="#1FA39A" />
          <path d="M50 120 v32 M34 136 h32" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
