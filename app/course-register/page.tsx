'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function CourseRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams?.get('next') || '/my-courses'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords must match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/wp-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const payload = await res.json()
      if (!res.ok) {
        throw new Error(payload.error ?? 'Unable to create your account right now.')
      }
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account right now.')
      setSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6 rounded-2xl border border-sky-100 bg-white p-8 text-sky-900 shadow-lg">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">Register</p>
          <h1 className="text-3xl font-semibold tracking-tight text-sky-900">Create your learning account</h1>
          <p className="text-sm text-sky-700">
            You&apos;ll use this account to access your courses and continue checkout.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-sky-900">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-sky-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-sky-900">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 pr-24 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Choose a secure password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:border-sky-200 hover:bg-sky-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-sky-900">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 pr-24 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Re-enter password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:border-sky-200 hover:bg-sky-50"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-70"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account & continue'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link href={`/course-login?next=${encodeURIComponent(next)}`} className="font-semibold text-sky-700 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
