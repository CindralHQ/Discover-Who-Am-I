'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'dw-cookie-consent'
const DISMISSED_KEY = 'dw-cookie-dismissed'

function hasConsentStored() {
  if (typeof window === 'undefined') return false
  if (window.localStorage.getItem(CONSENT_KEY) === 'accepted') return true
  if (window.localStorage.getItem(DISMISSED_KEY) === 'dismissed') return true
  return document.cookie
    .split(';')
    .map((chunk) => chunk.trim())
    .some((value) => value.startsWith(`${CONSENT_KEY}=`) || value.startsWith(`${DISMISSED_KEY}=`))
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!hasConsentStored())
  }, [])

  function acceptConsent() {
    if (typeof window === 'undefined') return
    document.cookie = `${CONSENT_KEY}=accepted; path=/; max-age=31536000`
    window.localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  function dismissBanner() {
    if (typeof window === 'undefined') return
    document.cookie = `${DISMISSED_KEY}=dismissed; path=/; max-age=604800`
    window.localStorage.setItem(DISMISSED_KEY, 'dismissed')
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-[36px] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50/70 p-6 text-sky-900 shadow-[0_20px_40px_rgba(15,23,42,0.15)] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-base leading-7">
          <p className="text-lg font-semibold text-sky-900">Cookies help the testimonial videos play</p>
          <p className="text-sky-700">
            We use essential cookies so embeds from Google Drive—like the testimonial videos—can load properly. By
            accepting, you allow those cookies to be set.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <button
            type="button"
            onClick={acceptConsent}
            className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 whitespace-nowrap"
          >
            Accept Cookies
          </button>
          <button
            type="button"
            onClick={dismissBanner}
            className="inline-flex w-full items-center justify-center rounded-3xl border border-sky-200 px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-white"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
