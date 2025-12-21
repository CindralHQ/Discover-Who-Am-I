'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import homeLogo from '@/assets/Logo.png'

const LP_BASE_URL =
  process.env.NEXT_PUBLIC_LP_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://wordpress.discoverwhoami.com'
const FORGOT_PASSWORD_URL = `${LP_BASE_URL.replace(/\/+$/, '')}/wp-login.php?action=lostpassword`

export default function CourseLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [otpPhone, setOtpPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone'>('email')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  const switchMode = (next: 'password' | 'otp') => {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)

    if (mode === 'otp') {
      setIsSubmitting(true)
      try {
        // Placeholder for OTP verify hook-up.
        setInfo('OTP verification will be enabled once the server endpoint is connected.')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to verify OTP right now.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/course-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email.trim(), password }),
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

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    const targetValue = otpMethod === 'email' ? otpEmail.trim() : otpPhone.trim()
    if (!targetValue) {
      setError(`Enter a ${otpMethod} to receive the OTP.`)
      return
    }
    setIsSendingOtp(true)
    try {
      // Placeholder for OTP send hook-up.
      setInfo(`OTP sent to ${otpMethod === 'email' ? 'email' : 'phone'} (placeholder). Connect the send-OTP API to enable.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send OTP right now.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-white via-sky-50 to-white px-4 py-12">
      <div className="container flex min-h-[80vh] flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-sky-100 bg-white/95 p-8 text-sky-900 shadow-xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-sky-100 p-3 shadow-sm transition hover:border-sky-200"
            >
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

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => switchMode('password')}
              className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                mode === 'password'
                  ? 'border-sky-500 bg-sky-50 text-sky-800'
                  : 'border-sky-100 bg-white text-sky-600 hover:border-sky-200'
              }`}
            >
              Password login
            </button>
            <button
              type="button"
              onClick={() => switchMode('otp')}
              className={`flex-1 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                mode === 'otp'
                  ? 'border-sky-500 bg-sky-50 text-sky-800'
                  : 'border-sky-100 bg-white text-sky-600 hover:border-sky-200'
              }`}
            >
              Login with OTP
            </button>
          </div>

          {mode === 'password' ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-sky-900">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  placeholder="you@example.com"
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 pr-24 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="Enter your password"
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
          ) : (
            <div className="space-y-6">
              <form className="space-y-4" onSubmit={handleSendOtp}>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpMethod('email')}
                    className={`flex-1 rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                      otpMethod === 'email'
                        ? 'border-sky-500 bg-sky-50 text-sky-800'
                        : 'border-sky-100 bg-white text-sky-600 hover:border-sky-200'
                    }`}
                  >
                    Use Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpMethod('phone')}
                    className={`flex-1 rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                      otpMethod === 'phone'
                        ? 'border-sky-500 bg-sky-50 text-sky-800'
                        : 'border-sky-100 bg-white text-sky-600 hover:border-sky-200'
                    }`}
                  >
                    Use Phone
                  </button>
                </div>
                {otpMethod === 'email' ? (
                  <div className="space-y-2">
                    <label htmlFor="otpEmail" className="text-sm font-semibold text-sky-900">
                      Email (for OTP)
                    </label>
                    <input
                      id="otpEmail"
                      type="email"
                      value={otpEmail}
                      onChange={(event) => setOtpEmail(event.target.value)}
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      placeholder="you@example.com"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="otpPhone" className="text-sm font-semibold text-sky-900">
                      Phone (for OTP)
                    </label>
                    <input
                      id="otpPhone"
                      type="tel"
                      value={otpPhone}
                      onChange={(event) => setOtpPhone(event.target.value)}
                      className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-sky-200 bg-white px-6 py-3 text-sm font-semibold text-sky-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 disabled:opacity-70"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="otpCode" className="text-sm font-semibold text-sky-900">
                    Enter OTP
                  </label>
                  <input
                    id="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value)}
                    className="w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-base text-sky-900 shadow-sm transition placeholder:text-sky-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                    placeholder="6-digit code"
                  />
                </div>
                {error ? (
                  <p className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">{error}</p>
                ) : null}
                {info ? (
                  <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{info}</p>
                ) : null}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying…' : 'Verify & Sign In'}
                </button>
              </form>
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-sky-600">
            <Link href="/forgot-password" className="font-semibold underline">
              Forgot password?
            </Link>
            <Link href="/contact" className="font-semibold underline">
              Contact support
            </Link>
          </div>
          <p className="text-center text-sm text-sky-500">
            Your credentials are encrypted and stored securely to power your private library.
          </p>
        </div>
      </div>
    </div>
  )
}
