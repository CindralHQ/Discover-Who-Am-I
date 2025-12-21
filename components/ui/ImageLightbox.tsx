'use client'

import Image, { type StaticImageData } from 'next/image'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'

type LightboxContent = {
  src: StaticImageData | string
  alt: string
}

type LightboxContextValue = {
  open: (content: LightboxContent) => void
  close: () => void
}

const ImageLightboxContext = createContext<LightboxContextValue | null>(null)

export function ImageLightboxProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<LightboxContent | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hideTimeoutRef = useRef<number | null>(null)

  const open = useCallback((nextContent: LightboxContent) => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setContent(nextContent)
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const close = useCallback(() => {
    setIsVisible(false)
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current)
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      setContent(null)
      hideTimeoutRef.current = null
    }, 220)
  }, [])

  useEffect(() => {
    if (!content) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    const focusTimeout = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true })
    }, 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      body.style.overflow = previousOverflow
      window.clearTimeout(focusTimeout)
    }
  }, [content, close])

  const contextValue = useMemo(
    () => ({
      open,
      close
    }),
    [open, close]
  )

  return (
    <ImageLightboxContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' && content
        ? createPortal(
            <div
              className={`fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/80 px-4 py-10 transition-opacity duration-300 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={close}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={content.alt}
                className={`relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ease-out ${
                  isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-3 opacity-0'
                }`}
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  aria-label="Close image"
                >
                  X
                </button>
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  <Image
                    src={content.src}
                    alt={content.alt}
                    fill
                    className="object-contain bg-black/5"
                    sizes="(min-width: 1024px) 640px, 100vw"
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </ImageLightboxContext.Provider>
  )
}

export function useImageLightbox() {
  const context = useContext(ImageLightboxContext)
  if (!context) {
    throw new Error('useImageLightbox must be used within an ImageLightboxProvider')
  }
  return context
}
