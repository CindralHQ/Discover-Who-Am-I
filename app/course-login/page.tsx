'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import homeLogo from '@/assets/Logo.png'

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

      router.push('/my-courses')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-white via-sky-50 to-white px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white/95 p-8 text-sky-900 shadow-xl">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl border border-sky-100 p-3 shadow-sm transition hover:border-sky-200">
            <Image src={homeLogo} alt="Discover Who Am I logo" className="h-14 w-14 object-contain" priority />
          </Link>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">Learner Portal</p>
            <h1 className="text-3xl font-semibold tracking-tight text-sky-900">Access Your Courses</h1>
            <p className="text-base leading-7 text-sky-700">
              Sign in with your Discover Who Am I credentials to continue your journey.
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold text-sky-900">
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
              className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="your.username"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-sky-900">
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
              className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              placeholder="Enter your secure key"
            />
          </div>
          {error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">{error}</p>
          ) : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-sky-500">
          Your credentials are encrypted and stored securely to power your private library.
        </p>
      </div>
    </div>
  )
}
