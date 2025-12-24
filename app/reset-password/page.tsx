import Link from 'next/link'

import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata = {
  title: 'Reset Password',
}

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

function getParam(searchParams: PageProps['searchParams'], key: string) {
  const value = searchParams?.[key]
  if (Array.isArray(value)) {
    return value[0] || ''
  }
  return value || ''
}

export default function ResetPasswordPage({ searchParams }: PageProps) {
  const login = getParam(searchParams, 'login')
  const resetKey = getParam(searchParams, 'key')

  return (
    <div className="bg-gradient-to-b from-white via-sky-50 to-white px-4 py-12">
      <div className="container flex min-h-[70vh] flex-col items-center justify-center">
        <div className="w-full max-w-xl space-y-8 rounded-3xl border border-sky-100 bg-white/95 p-8 text-sky-900 shadow-xl">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">Password reset</p>
            <h1 className="text-3xl font-semibold tracking-tight text-sky-900">Set a new password</h1>
            <p className="text-base leading-7 text-sky-700">
              Choose a new password for your Discover Who Am I account. After resetting, sign in on the Course Login
              page.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm text-sky-800">
            <p className="font-semibold text-sky-900">Tips</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Use at least 8 characters with a mix of letters and numbers.</li>
              <li>Make sure both password fields match exactly.</li>
              <li>If the link is expired, request a new reset email.</li>
            </ol>
          </div>

          <ResetPasswordForm login={login} resetKey={resetKey} />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-sky-700">
            <Link href="/course-login" className="font-semibold underline">
              Back to Course Login
            </Link>
            <Link href="/forgot-password" className="font-semibold underline">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
