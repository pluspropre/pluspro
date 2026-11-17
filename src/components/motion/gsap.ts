'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

export const MQ = {
  desk: '(min-width: 768px)',
  fine: '(pointer: fine)',
  reduce: '(prefers-reduced-motion: reduce)',
}

/**
 * Scroll-triggered entrance that plays once and never reverses. Used instead of `once: true`: a `once` trigger
 * that is already scrolled past kills itself inside ScrollTrigger's refresh loop, which mutates the trigger list
 * mid-iteration and crashes with "Cannot read properties of undefined (reading 'end')" after a client navigation.
 */
export const PLAY_ONCE = { toggleActions: 'play none none none' } as const

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(MQ.reduce).matches
}
