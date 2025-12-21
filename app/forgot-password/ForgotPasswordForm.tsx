'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

type ForgotPasswordFormProps = {
  fallbackResetUrl: string
}

export function ForgotPasswordForm({ fallbackResetUrl }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage(null)
    try {
      const res = await fetch('/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(payload.error || 'Unable to start reset.')
      }
      setStatus('success')
      setMessage('Check your email for the reset link. If you do not see it, check spam or try again.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to start reset.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-sky-900">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          placeholder="you@example.com"
        />
      </div>
      {message ? (
        <p
          className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
            status === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending reset link…' : 'Send reset link'}
      </button>
      <p className="text-center text-xs text-sky-600">
        If this form is blocked, you can also use our WordPress reset page:
        <br />
        <Link href={fallbackResetUrl} target="_blank" rel="noreferrer" className="font-semibold underline">
          Open WordPress reset
        </Link>
      </p>
    </form>
  )
}
