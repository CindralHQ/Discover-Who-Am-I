import Link from 'next/link'

import { ForgotPasswordForm } from './ForgotPasswordForm'

const LP_BASE_URL =
  process.env.NEXT_PUBLIC_LP_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://wordpress.discoverwhoami.com'
const FORGOT_PASSWORD_URL = `${LP_BASE_URL.replace(/\/+$/, '')}/wp-login.php?action=lostpassword`

export const metadata = {
  title: 'Forgot Password'
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-gradient-to-b from-white via-sky-50 to-white px-4 py-12">
      <div className="container flex min-h-[70vh] flex-col items-center justify-center">
        <div className="w-full max-w-xl space-y-8 rounded-3xl border border-sky-100 bg-white/95 p-8 text-sky-900 shadow-xl">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">Password reset</p>
            <h1 className="text-3xl font-semibold tracking-tight text-sky-900">Forgot your password?</h1>
            <p className="text-base leading-7 text-sky-700">
              Reset your Discover Who Am I credentials using our secure reset portal. You&apos;ll get an email with a
              link to choose a new password.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm text-sky-800">
            <p className="font-semibold text-sky-900">Quick steps</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Enter the email you use for courses.</li>
              <li>Check your inbox (and spam) for the reset link.</li>
              <li>Set a new password, then sign in on the Course Login page.</li>
            </ol>
          </div>

          <ForgotPasswordForm fallbackResetUrl={FORGOT_PASSWORD_URL} />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-sky-700">
            <Link href="/course-login" className="font-semibold underline">
              Back to Course Login
            </Link>
            <Link href="/contact" className="font-semibold underline">
              Need help? Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
