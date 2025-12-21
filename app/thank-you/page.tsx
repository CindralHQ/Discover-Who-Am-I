import Link from 'next/link'

import { themeLibrary, ThemeName } from '@/lib/designSystem'

const THEME: ThemeName = 'twilight'

export const metadata = {
  title: 'Thank You'
}

type ThankYouPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

function toText(value?: string | string[]) {
  if (Array.isArray(value)) return value[0]
  return value
}

export default function ThankYouPage({ searchParams = {} }: ThankYouPageProps) {
  const orderRef =
    toText(searchParams.order) ||
    toText(searchParams.orderId) ||
    toText(searchParams.order_id) ||
    toText(searchParams.orderKey) ||
    toText(searchParams.key)
  const email = toText(searchParams.email) || toText(searchParams.e)

  const palette = themeLibrary[THEME].classes
  const headingClass = palette.card.title

  const nextSteps = [
    email
      ? `We sent your receipt and login steps to ${email}. If it is missing, check spam or promotions.`
      : 'We sent your receipt and login steps to your email. If it is missing, check spam or promotions.',
    'If you already have credentials, go to My Courses to open your library.',
    'If you are new, visit Course Login to set your password and sign in.',
    'Once signed in, your purchase will unlock automatically. Refresh My Courses if you just completed payment.'
  ]

  return (
    <div className="container space-y-10">
      <section className="space-y-5 rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 p-7 text-white shadow-lg ring-1 ring-sky-300/40 sm:p-9">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-100">
            Payment confirmed
          </span>
          {orderRef ? (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-sky-100">
              Order reference: {orderRef}
            </span>
          ) : null}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Thank you for your purchase</h1>
          <p className="text-base leading-7 text-sky-100">
            Your payment was processed successfully. The course is now linked to your account inside this site.
            Use the buttons below to continue learning right away.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/my-courses"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-sky-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Go to My Courses
          </Link>
          <Link
            href="/course-login"
            className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Course Login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Return Home
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-3xl border border-sky-100 bg-white/95 p-7 shadow-sm">
          <div className="space-y-2">
            <h2 className={`text-2xl font-semibold tracking-tight ${headingClass}`}>What happens next</h2>
            <p className="text-base leading-7 text-sky-800">
              Follow these steps to access your course without leaving the main site.
            </p>
          </div>
          <ul className="space-y-3 text-base leading-7 text-sky-800">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500" aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-3xl border border-sky-100 bg-white/95 p-7 shadow-sm">
          <h3 className={`text-xl font-semibold tracking-tight ${headingClass}`}>Need help?</h3>
          <p className="text-base leading-7 text-sky-800">
            Stay on this site—your order is already linked to the email used at checkout. If you don&apos;t see your
            course after signing in, refresh My Courses, or set your password via Course Login. Still stuck? Reach out
            and we will align your access manually.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
            >
              Contact support
            </Link>
            <Link
              href="/my-courses"
              className="inline-flex items-center justify-center rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
            >
              Open My Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
