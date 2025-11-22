'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LearnPressLogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      await fetch('/api/course-api/logout', { method: 'POST' })
    } finally {
      setIsLoading(false)
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50 disabled:opacity-70"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out…' : 'Log out'}
    </button>
  )
}
