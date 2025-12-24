'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

type ResetPasswordFormProps = {
  login: string
  resetKey: string
}

export function ResetPasswordForm({ login, resetKey }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const hasResetParams = Boolean(login && resetKey)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!hasResetParams) {
      setStatus('error')
      setMessage('Missing reset link details. Please request a new reset email.')
      return
    }
    setStatus('submitting')
    setMessage(null)

    try {
      const res = await fetch('/api/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login,
          key: resetKey,
          password,
          confirmPassword,
        }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(payload.error || 'Unable to reset password.')
      }

      setStatus('success')
      setMessage('Password reset successful. You can now sign in with your new password.')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to reset password.')
    }
  }

  if (!hasResetParams) {
    return (
      <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 text-sm text-rose-700">
        <p className="font-semibold text-rose-800">Reset link is missing or expired.</p>
        <p>Please request a new reset email to continue.</p>
        <Link href="/forgot-password" className="font-semibold underline">
          Request a new reset link
        </Link>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-sky-900">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          placeholder="Enter a new password"
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-semibold text-sky-900">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          placeholder="Re-enter the new password"
          autoComplete="new-password"
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
        {status === 'submitting' ? 'Resetting password...' : 'Reset password'}
      </button>
      {status === 'success' ? (
        <p className="text-center text-xs text-sky-600">
          Ready to sign in?{' '}
          <Link href="/course-login" className="font-semibold underline">
            Go to Course Login
          </Link>
        </p>
      ) : null}
    </form>
  )
}
