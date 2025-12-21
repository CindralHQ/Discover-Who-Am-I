'use client'

import { useCallback, useEffect, useState } from 'react'

const FONT_SCALE_MIN = 0.9
const FONT_SCALE_MAX = 1.15
const FONT_SCALE_STEP = 0.1
const FONT_SCALE_STORAGE_KEY = 'dwai-font-scale'

type FontScalerProps = {
  className?: string
}

export function FontScaler({ className }: FontScalerProps) {
  const [fontScale, setFontScale] = useState(FONT_SCALE_MAX)
  const [fontScaleInitialized, setFontScaleInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(FONT_SCALE_STORAGE_KEY)
    if (stored) {
      const parsed = Number(stored)
      if (!Number.isNaN(parsed)) {
        const clamped = Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, parsed))
        document.documentElement.style.fontSize = `${(clamped * 100).toFixed(2)}%`
        setFontScale(clamped)
        setFontScaleInitialized(true)
        return
      }
    }
    document.documentElement.style.fontSize = `${(FONT_SCALE_MAX * 100).toFixed(2)}%`
    setFontScale(FONT_SCALE_MAX)
    setFontScaleInitialized(true)
  }, [])

  useEffect(() => {
    if (!fontScaleInitialized || typeof window === 'undefined') return
    document.documentElement.style.fontSize = `${(fontScale * 100).toFixed(2)}%`
    window.localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(fontScale))
  }, [fontScale, fontScaleInitialized])

  const adjustFontScale = useCallback((delta: number) => {
    setFontScale((current) => {
      const next = Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Number((current + delta).toFixed(2))))
      return next
    })
  }, [])

  const resetFontScale = useCallback(() => {
    setFontScale(1)
  }, [])

  const handleIncreaseFont = useCallback(() => {
    adjustFontScale(FONT_SCALE_STEP)
  }, [adjustFontScale])

  const handleDecreaseFont = useCallback(() => {
    adjustFontScale(-FONT_SCALE_STEP)
  }, [adjustFontScale])

  useEffect(() => {
    const handleFontResetHotkey = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase() ?? ''
      const code = event.code ? event.code.toLowerCase() : ''
      const modifierHeld = event.metaKey || event.ctrlKey
      const isModifierReset = modifierHeld && key === '0'
      const isFunctionReset = key === 'f10' || key === 'f0' || code === 'f10'

      if (isModifierReset || isFunctionReset) {
        event.preventDefault()
        resetFontScale()
      }
    }

    window.addEventListener('keydown', handleFontResetHotkey)
    return () => window.removeEventListener('keydown', handleFontResetHotkey)
  }, [resetFontScale])

  return (
    <div
      className={[
        'flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur-md',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="font-semibold text-slate-500">Aa</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDecreaseFont}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease font size"
          title="Decrease font size"
          disabled={fontScale <= FONT_SCALE_MIN + 0.01}
        >
          -
        </button>
        <button
          type="button"
          onClick={handleIncreaseFont}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase font size"
          title="Increase font size"
          disabled={fontScale >= FONT_SCALE_MAX - 0.01}
        >
          +
        </button>
      </div>
    </div>
  )
}
