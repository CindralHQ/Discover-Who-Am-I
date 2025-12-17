'use client'

import { useState } from 'react'
import { themeLibrary } from '@/lib/designSystem'
import { HomeIntroOverlay } from '@/components/ui/HomeIntroOverlay'

const THEME = 'twilight'

export default function ContactPage() {
    const palette = themeLibrary[THEME].classes
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error('Failed to send message')
            }

            setSuccess(true)
            e.currentTarget.reset()
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pb-20 pt-32">
            <HomeIntroOverlay />
            <div className="container max-w-2xl">
                <div className="space-y-2 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
                        Get in Touch
                    </p>
                    <h1 className={`text-3xl font-bold tracking-tight ${palette.text} sm:text-4xl`}>
                        Contact Us
                    </h1>
                    <p className="text-lg text-slate-600">
                        We'd love to hear from you. Please fill out this form.
                    </p>
                </div>

                <div className={`mt-10 overflow-hidden rounded-3xl bg-white p-6 shadow-xl ring-1 ring-sky-100 sm:p-10 ${palette.surface}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="mt-2 block w-full rounded-full border-2 border-sky-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-sm"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="number" className="block text-sm font-medium text-slate-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="number"
                                    id="number"
                                    className="mt-2 block w-full rounded-full border-2 border-sky-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-sm"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    className="mt-2 block w-full rounded-full border-2 border-sky-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    id="country"
                                    className="mt-2 block w-full rounded-full border-2 border-sky-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-sm"
                                    placeholder="Available Country"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                required
                                className="mt-2 block w-full rounded-full border-2 border-sky-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-sm"
                                placeholder="What is this about?"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                                Message
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                required
                                className="mt-2 block w-full rounded-2xl border-2 border-sky-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 sm:text-sm"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${palette.button.primary}`}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>

                        {success && (
                            <div className="rounded-2xl bg-green-50 p-4 text-center text-sm font-medium text-green-800">
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-800">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
