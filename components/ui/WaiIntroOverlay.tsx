'use client'

import { useEffect, useMemo, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { createPortal } from 'react-dom'

import { ThemeName } from '@/lib/designSystem'

type WaiIntroOverlayProps = {
  theme: ThemeName
  icon: StaticImageData
  label: string
  durationMs?: number
  size?: 'default' | 'hero'
  applyBodyTint?: boolean
}

const overlayTint: Record<ThemeName, string> = {
  lotus: 'bg-rose-200/70',
  manipura: 'bg-amber-200/70',
  twilight: 'bg-sky-200/60',
  anahata: 'bg-emerald-200/70',
  vishuddha: 'bg-sky-200/70',
  sahasrara: 'bg-violet-200/70'
}

const bodyTint: Record<ThemeName, string> = {
  lotus: '#FDF2F8',
  manipura: '#FFF3D6',
  twilight: '#EEF2FF',
  anahata: '#E7FFF2',
  vishuddha: '#E8F4FE',
  sahasrara: '#F4ECFF'
}

const sizeStyles = {
  default: {
    wrapper: 'h-36 w-36 rounded-full',
    image: 'h-16 w-16',
    shadow: 'shadow-[0_0_45px_rgba(255,255,255,0.45)]'
  },
  hero: {
    wrapper: 'h-52 w-52 rounded-full',
    image: 'h-36 w-36',
    shadow: 'shadow-[0_0_70px_rgba(255,255,255,0.55)]'
  }
} as const

export function WaiIntroOverlay({
  theme,
  icon,
  label,
  durationMs = 2600,
  size = 'default',
  applyBodyTint = true
}: WaiIntroOverlayProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalEl(document.body)
  }, [])

  useEffect(() => {
    if (!applyBodyTint || typeof document === 'undefined') return
    const previousBackground = document.body.style.background
    const previousBackgroundColor = document.body.style.backgroundColor
    document.body.style.background = ''
    document.body.style.backgroundColor = bodyTint[theme]

    return () => {
      document.body.style.background = previousBackground
      document.body.style.backgroundColor = previousBackgroundColor
    }
  }, [applyBodyTint, theme])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    const fadeTimer = window.setTimeout(() => setIsFading(true), Math.max(durationMs - 900, 900))
    const hideTimer = window.setTimeout(() => setIsVisible(false), durationMs)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [durationMs, hasMounted])

  const content = useMemo(() => {
    if (!isVisible) return null
    const overlayOpacity = !hasMounted || isFading ? 'opacity-0' : 'opacity-100'
    const iconState = !hasMounted
      ? 'scale-75 opacity-0'
      : isFading
        ? 'scale-125 opacity-0 blur-sm'
        : 'scale-100 opacity-100'

    return (
      <div
        className={[
          'pointer-events-none fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm transition-opacity duration-1000 ease-out',
          overlayTint[theme],
          overlayOpacity
        ].join(' ')}
        aria-hidden
      >
        <div
          className={[
            'flex items-center justify-center bg-white/95 transition-all duration-1000 ease-out',
            sizeStyles[size].wrapper,
            sizeStyles[size].shadow,
            iconState
          ].join(' ')}
        >
          <Image src={icon} alt={`${label} icon`} className={sizeStyles[size].image} priority />
        </div>
      </div>
    )
  }, [hasMounted, icon, isFading, isVisible, label, size, theme])

  if (!portalEl) {
    return null
  }

  return createPortal(content, portalEl)
}
