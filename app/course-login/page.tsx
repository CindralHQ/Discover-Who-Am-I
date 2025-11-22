'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CourseLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/course-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to sign in right now.')
      }

      router.push('/course-api-test')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 rounded-3xl border border-indigo-100 bg-white/95 p-8 shadow-sm">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Course API Login</p>
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-900">Sign in with your course credentials</h1>
        <p className="text-base leading-7 text-indigo-800">
          Enter the LMS username and password (or application password) that the dashboard should use to fetch course
          data. This stores a short-lived JWT token in a secure cookie so the{' '}
          <Link href="/course-api-test" className="text-indigo-600 underline">
            /course-api-test
          </Link>{' '}
          page can load courses for the signed-in profile.
        </p>
        <ul className="text-sm leading-6 text-indigo-700">
          <li>• Create a dedicated instructor/API user for safety.</li>
          <li>• Prefer application passwords so you never share your real login secret.</li>
          <li>• Tokens expire after about an hour; sign in again to refresh.</li>
        </ul>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-semibold text-indigo-900">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-2xl border border-indigo-200 px-4 py-3 text-base text-indigo-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-indigo-900">
            Password or application password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-indigo-200 px-4 py-3 text-base text-indigo-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
          <Link
            href="/course-api-test"
            className="text-sm font-semibold text-indigo-600 underline decoration-dotted underline-offset-4"
          >
            Back to test page
          </Link>
        </div>
      </form>
    </div>
  )
}
