'use client'

import { useEffect, useState } from 'react'

type Locale = 'en' | 'hi' | 'fr' | 'es' | 'coming-soon'

const LOCALE_STORAGE_KEY = 'dwai-locale'

const LOCALE_OPTIONS: Array<{
  code: Locale
  label: string
  flag: string
  available: boolean
}> = [
  { code: 'en', label: 'English', flag: '🇺🇸', available: true },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', available: false },
  { code: 'fr', label: 'Français', flag: '🇫🇷', available: false },
  { code: 'es', label: 'Español', flag: '🇪🇸', available: false },
  { code: 'coming-soon', label: 'More languages…', flag: '🌐', available: false }
]

const AVAILABLE_LOCALES = new Set(LOCALE_OPTIONS.filter((item) => item.available).map((item) => item.code))

export function LanguageSwitcher({ className }: { className?: string }) {
  const [locale, setLocale] = useState<Locale>('en')
  const [modalMounted, setModalMounted] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [requestedLanguage, setRequestedLanguage] = useState('')
  const [volunteerName, setVolunteerName] = useState('')
  const [volunteerEmail, setVolunteerEmail] = useState('')
  const [volunteerMessage, setVolunteerMessage] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (stored && AVAILABLE_LOCALES.has(stored)) {
      setLocale(stored)
      document.documentElement.lang = stored
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (AVAILABLE_LOCALES.has(locale)) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
      document.documentElement.lang = locale
    }
  }, [locale])

  const openModal = (label: string) => {
    setRequestedLanguage(label)
    setModalMounted(true)
    requestAnimationFrame(() => setModalVisible(true))
  }

  const closeModal = () => {
    setModalVisible(false)
    setTimeout(() => setModalMounted(false), 200)
  }

  const handleChange = (next: Locale) => {
    const option = LOCALE_OPTIONS.find((item) => item.code === next)
    if (!option) return
    if (!option.available) {
      openModal(option.label)
      return
    }
    setLocale(next)
  }

  const activeOption = LOCALE_OPTIONS.find((item) => item.code === locale) ?? LOCALE_OPTIONS[0]

  const handleVolunteerSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const subject = 'Language volunteer interest'
    const body = [
      `Name: ${volunteerName}`,
      `Email: ${volunteerEmail}`,
      `Language: ${requestedLanguage || 'Not specified'}`,
      '',
      'Message:',
      volunteerMessage
    ].join('\n')

    const mailtoUrl = `mailto:admin@discoverwhoami.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    if (typeof window !== 'undefined') {
      window.location.href = mailtoUrl
    }

    closeModal()
    setVolunteerName('')
    setVolunteerEmail('')
    setVolunteerMessage('')
  }

  return (
    <>
      <div
        className={[
          'flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-md',
          className
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="text-lg" aria-hidden>
          {activeOption.flag}
        </span>
        <select
          aria-label="Select language"
          value={locale}
          onChange={(event) => handleChange(event.target.value as Locale)}
          className="bg-transparent text-sm font-semibold text-slate-700 outline-none cursor-pointer"
        >
          {LOCALE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {modalMounted ? (
        <div
          className={`fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 px-4 transition-opacity duration-300 ease-out ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeModal}
        >
          <div
            className={`w-full max-w-lg transform rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out ${
              modalVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-3 opacity-0'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Coming Soon</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {requestedLanguage || 'More languages…'} is coming soon
                </h2>
                <p className="mt-2 text-sm text-slate-700">
                  Want to help us translate? Share your details and we&apos;ll reach out when we add this language.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleVolunteerSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-800" htmlFor="volunteer-name">
                  Name
                </label>
                <input
                  id="volunteer-name"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-800" htmlFor="volunteer-email">
                  Email
                </label>
                <input
                  id="volunteer-email"
                  type="email"
                  value={volunteerEmail}
                  onChange={(e) => setVolunteerEmail(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-800" htmlFor="volunteer-message">
                  How can you help?
                </label>
                <textarea
                  id="volunteer-message"
                  value={volunteerMessage}
                  onChange={(e) => setVolunteerMessage(e.target.value)}
                  className="min-h-[96px] rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="Share your experience with translations or languages you know."
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
              >
                Submit interest
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
