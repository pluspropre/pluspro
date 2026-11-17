import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export const PlusIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={4} {...p}>
    <path d="M12 3v18M3 12h18" />
  </svg>
)
export const ArrowUpRight = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M4 12 12 4M5.5 4H12v6.5" />
  </svg>
)
export const ArrowLeft = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M13 8H3M7 4 3 8l4 4" />
  </svg>
)
export const ArrowRight = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)
export const ChevronDown = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M4 6l4 4 4-4" />
  </svg>
)
export const ChevronRight = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} {...p}>
    <path d="M6 4l4 4-4 4" />
  </svg>
)
export const PhoneIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
)
export const MailIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
export const PinIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
export const ClockIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
export const CheckIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base} strokeWidth={2.2} {...p}>
    <path d="M3.5 8.5l3 3L12.5 5" />
  </svg>
)
export const ShieldIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)
export const SwapIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
  </svg>
)
export const MenuIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <path d="M4 8h16M4 16h16" />
  </svg>
)
export const CloseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
export const QuoteIcon = (p: IconProps) => (
  <svg viewBox="0 0 32 32" aria-hidden focusable={false} {...p}>
    <path
      d="M6 24c0-7 2-12 8-15l1.5 2.4C12 13.5 11 16 11 18h4v8H6zm13 0c0-7 2-12 8-15l1.5 2.4C25 13.5 24 16 24 18h4v8h-9z"
      fill="currentColor"
    />
  </svg>
)
export const StarPath = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'
export const InstagramIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden focusable={false} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
)
export const LinkedInIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden focusable={false} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13a2.5 2.5 0 0 1 5 0v3" />
  </svg>
)
export const FacebookIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" aria-hidden focusable={false} {...p}>
    <path d="M14.5 21v-7.5H17l.5-3h-3V8.6c0-.9.4-1.6 1.7-1.6H17.6V4.3A17 17 0 0 0 15.2 4c-2.6 0-4 1.5-4 4.2v2.3H8.5v3h2.7V21z" />
  </svg>
)
export const ShareIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
)
export const LinkIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
  </svg>
)
export const WhatsAppIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.9.8a4 4 0 0 1-2.2-2.2l.8-.9-1-2z" />
  </svg>
)
