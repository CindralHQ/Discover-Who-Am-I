'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import celestialBackground from '@/assets/celestialBackground.webp'

const WORDS = ['WHO', 'AM', 'I', '?', 'DISCOVER WHO AM I'] as const
const HOME_INTRO_SEEN_STORAGE_KEY = 'dwai-home-intro-overlay-seen'
const FINAL_WORD_INDEX = WORDS.length - 1
const WORD_DISPLAY_DURATION = 1111
const WORD_TRANSITION_DURATION = 500
const FINAL_FADE_DELAY = 500
const OVERLAY_HIDE_DELAY = 1200

export function HomeIntroOverlay() {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [shouldRunOverlay, setShouldRunOverlay] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [isWordVisible, setIsWordVisible] = useState(false)
  const [isFinale, setIsFinale] = useState(false)
  const [isIntroFlashVisible, setIsIntroFlashVisible] = useState(true)

  useEffect(() => {
    setPortalEl(document.body)
  }, [])

  useEffect(() => {
    // Gate the intro animation so it only plays once per browser.
    if (typeof window === 'undefined') return
    const hasSeenIntro = window.localStorage.getItem(HOME_INTRO_SEEN_STORAGE_KEY) === 'true'

    if (hasSeenIntro) {
      setShouldRunOverlay(false)
      setIsVisible(false)
      return
    }

    window.localStorage.setItem(HOME_INTRO_SEEN_STORAGE_KEY, 'true')
    setShouldRunOverlay(true)
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!hasMounted || !shouldRunOverlay) return
    const startTimer = window.setTimeout(() => setIsWordVisible(true), 80)
    const introTimer = window.setTimeout(() => setIsIntroFlashVisible(false), 400)
    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(introTimer)
    }
  }, [hasMounted, shouldRunOverlay])

  useEffect(() => {
    if (!hasMounted || !isVisible || !shouldRunOverlay) return
    if (!isWordVisible) return
    const holdTimer = window.setTimeout(() => setIsWordVisible(false), WORD_DISPLAY_DURATION)
    return () => window.clearTimeout(holdTimer)
  }, [hasMounted, isVisible, isWordVisible, shouldRunOverlay, wordIndex])

  useEffect(() => {
    if (!hasMounted || !isVisible || !shouldRunOverlay) return
    if (isWordVisible) return

    if (wordIndex === FINAL_WORD_INDEX) {
      setIsFinale(true)
      const fadeTimer = window.setTimeout(() => setIsFading(true), FINAL_FADE_DELAY)
      const hideTimer = window.setTimeout(() => setIsVisible(false), FINAL_FADE_DELAY + OVERLAY_HIDE_DELAY)
      return () => {
        window.clearTimeout(fadeTimer)
        window.clearTimeout(hideTimer)
      }
    }

    const transitionTimer = window.setTimeout(() => {
      setWordIndex((prev) => prev + 1)
      setIsWordVisible(true)
    }, WORD_TRANSITION_DURATION)

    return () => window.clearTimeout(transitionTimer)
  }, [hasMounted, isVisible, isWordVisible, shouldRunOverlay, wordIndex])

  const portalContent = useMemo(() => {
    if (!shouldRunOverlay || !isVisible) return null

    const nebulaBackdrop =
      'bg-[radial-gradient(circle_at_20%_20%,rgba(199,210,254,0.28),rgba(15,23,42,0))] md:bg-[radial-gradient(circle_at_18%_25%,rgba(199,210,254,0.28),rgba(15,23,42,0)_60%),radial-gradient(circle_at_78%_28%,rgba(167,139,250,0.28),rgba(12,10,36,0)_55%),radial-gradient(circle_at_50%_80%,rgba(32,211,238,0.18),rgba(8,11,26,0)_50%)]'
    const starfieldPattern =
      "bg-[url(\"data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='1' fill='rgba(226,232,240,0.25)'/%3E%3Ccircle cx='120' cy='24' r='0.8' fill='rgba(196,181,253,0.35)'/%3E%3Ccircle cx='48' cy='120' r='0.9' fill='rgba(165,243,252,0.3)'/%3E%3Ccircle cx='132' cy='96' r='0.7' fill='rgba(226,232,240,0.28)'/%3E%3C/svg%3E\")]"
    const isFinalWord = wordIndex === FINAL_WORD_INDEX

    return (
      <div
        aria-hidden
        className={[
          'pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden transition-opacity duration-900 ease-out',
          !hasMounted || isFading ? 'opacity-0' : 'opacity-100'
        ].join(' ')}
      >
        <div
          className={[
            'absolute inset-0 bg-white transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]',
            isIntroFlashVisible ? 'opacity-100' : 'opacity-0'
          ].join(' ')}
        />
        <div className={`absolute inset-0 ${nebulaBackdrop} transition-opacity duration-700 ${isFinale ? 'opacity-0' : 'opacity-100'}`} />
        <div
          className={[
            'absolute inset-0 bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 opacity-90 transition-opacity duration-700',
            isFinale ? 'opacity-0' : 'opacity-90'
          ].join(' ')}
        />
        <div
          className={[
            'absolute inset-0 bg-center bg-cover opacity-65 mix-blend-screen transition-opacity duration-700',
            isFinale ? 'opacity-0' : 'opacity-65'
          ].join(' ')}
          style={{ backgroundImage: `url(${celestialBackground.src})` }}
        />
        <div
          className={`absolute inset-0 ${starfieldPattern} opacity-40 mix-blend-screen transition-opacity duration-700 ${isFinale ? 'opacity-0' : 'opacity-40'}`}
        />
        <div
          className={[
            'absolute inset-0 bg-white transition-opacity duration-700',
            isFinale ? 'opacity-95' : 'opacity-0'
          ].join(' ')}
        />

        <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center">
          <div className="flex min-h-[1.6em] items-center justify-center text-5xl font-bold text-slate-100 drop-shadow-[0_0_24px_rgba(129,140,248,0.55)] md:text-6xl">
            <span
              className={[
                'inline-flex items-center justify-center will-change-transform transition-all duration-950 ease-[cubic-bezier(0.65,0.05,0.36,1);]',
                isWordVisible
                  ? isFinalWord
                    ? 'scale-130 opacity-100'
                    : 'scale-112 opacity-100'
                  : isFinalWord
                    ? isFinale
                      ? 'scale-[2.6] opacity-0'
                      : 'scale-115 opacity-0'
                    : 'scale-96 opacity-0'
              ].join(' ')}
            >
              {WORDS[wordIndex]}
            </span>
          </div>
        </div>
      </div>
    )
  }, [hasMounted, isFading, isFinale, isVisible, isWordVisible, shouldRunOverlay, wordIndex])

  if (!portalEl || !shouldRunOverlay) return null

  return createPortal(portalContent, portalEl)
}
