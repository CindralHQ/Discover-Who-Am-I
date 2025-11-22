'use client'

import { useState } from 'react'

type LessonFeedbackFormProps = {
  courseId: number
  lessonId: number
  lessonTitle: string
}

export function LessonFeedbackForm({ courseId, lessonId, lessonTitle }: LessonFeedbackFormProps) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    try {
      const response = await fetch('/api/course-api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonId,
          rating,
          content,
          title: `Feedback for ${lessonTitle || `Lesson ${lessonId}`}`,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? 'Unable to submit feedback right now.')
      }

      setStatus('success')
      setContent('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit feedback.')
    }
  }

  return (
    <section id="lesson-feedback" className="space-y-4 rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Share Your Experience</p>
        <h3 className="text-2xl font-semibold text-indigo-900">Testimonials & Reviews</h3>
        <p className="text-sm text-indigo-700">
          Offer a reflection on <span className="font-semibold">{lessonTitle || `Lesson ${lessonId}`}</span>. Reviews are
          shared with the teaching team so they can highlight your experience.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-indigo-900">
            Rating
            <select
              className="w-full rounded-2xl border border-indigo-200 px-3 py-2 text-indigo-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} – {value === 5 ? 'Transcendent' : value === 1 ? 'Needs support' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm font-semibold text-indigo-900">
          Your words
          <textarea
            className="h-32 w-full rounded-2xl border border-indigo-200 px-4 py-3 text-indigo-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Describe how this video shifted your practice..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </label>

        {status === 'error' && errorMessage ? (
          <p className="text-sm font-semibold text-rose-600">{errorMessage}</p>
        ) : null}
        {status === 'success' ? (
          <p className="text-sm font-semibold text-emerald-600">
            Thank you. Your reflection has been sent to the team.
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-70"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending…' : 'Submit testimonial'}
        </button>
      </form>
    </section>
  )
}
