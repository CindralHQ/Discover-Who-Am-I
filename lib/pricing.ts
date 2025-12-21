import { headers } from 'next/headers'

type CourseKey = 'wai1' | 'wai2' | 'wai3' | 'wai4'
type SupportedCurrency = 'USD' | 'INR' | 'EUR'

const EU_LANG_TAGS = [
  'de',
  'fr',
  'es',
  'it',
  'pt',
  'nl',
  'be',
  'lu',
  'at',
  'ie',
  'fi',
  'se',
  'dk',
  'pl',
  'cz',
  'sk',
  'si',
  'gr',
  'hu',
  'ro',
  'bg',
  'hr',
  'lt',
  'lv',
  'ee'
] as const

const COURSE_PRICES: Record<CourseKey, Partial<Record<SupportedCurrency, number>>> = {
  wai1: { USD: 140, INR: 12000, EUR: 130 },
  wai2: { USD: 140, INR: 12000, EUR: 130 },
  wai3: { USD: 175, INR: 15000, EUR: 160 },
  wai4: { USD: 175, INR: 15000, EUR: 160 }
}

const FALLBACK_RATE: Record<SupportedCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83
}

function normalizeAcceptLanguage(langHeader?: string | null) {
  if (!langHeader) return ''
  return langHeader.split(',')[0]?.toLowerCase() ?? ''
}

function deriveCurrencyFromAcceptLanguage(langHeader?: string | null): SupportedCurrency {
  const primary = normalizeAcceptLanguage(langHeader)
  if (primary.includes('-in')) return 'INR'
  if (primary.includes('-us')) return 'USD'

  const matchedEu = EU_LANG_TAGS.some((code) => primary === code || primary.startsWith(`${code}-`))
  if (matchedEu) return 'EUR'

  return 'USD'
}

function formatAmount(amount: number, currency: SupportedCurrency) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'INR' ? 0 : 2,
    maximumFractionDigits: currency === 'INR' ? 0 : 2
  }).format(amount)
}

export function getLocalizedCoursePrice(courseKey: CourseKey): string {
  const currency = deriveCurrencyFromAcceptLanguage(headers().get('accept-language')) as SupportedCurrency
  const coursePrices = COURSE_PRICES[courseKey]
  const amount =
    coursePrices[currency] ??
    (coursePrices.USD ? Math.round(coursePrices.USD * FALLBACK_RATE[currency]) : 0)

  return formatAmount(amount, currency)
}
