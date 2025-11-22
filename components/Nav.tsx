'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { themeLibrary, ThemeName } from '@/lib/designSystem'
import type { LearnPressUserPayload } from '@/lib/learnpress'
import { useRouter } from 'next/navigation'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/wai1', label: 'WAI Part 1' },
  { href: '/wai2', label: 'WAI Part 2' },
  { href: '/wai3', label: 'WAI Part 3' },
  { href: '/wai4', label: 'WAI Part 4' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: 'https://santoshsachdeva.com/books/', label: 'Books' }
]

type NavProps = {
  theme?: ThemeName
  user?: LearnPressUserPayload | null
}

export function Nav({ theme = 'twilight', user }: NavProps) {
  const pathname = usePathname()
  const palette = themeLibrary[theme].classes
  const [open, setOpen] = useState(false)

  return (
    <>

      <button
        type="button"
        className={cx(
          'flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-semibold shadow-sm transition md:hidden',
          palette.surface,
          palette.text
        )}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">Toggle navigation</span>
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'} />
        </svg>
      </button>
      <nav
        className={cx(
          'absolute left-4 right-4 top-20 z-40 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl transition-all duration-300 ease-out md:static md:flex md:flex-row md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:text-sm md:font-medium',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-4 scale-95 opacity-0',
          'md:pointer-events-auto md:translate-y-0 md:scale-100 md:opacity-100'
        )}
      >
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                'rounded-full px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:py-1',
                palette.nav.focus,
                isActive ? palette.nav.active : palette.nav.base
              )}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          )
        })}
        <UserMenu user={user} />
      </nav>
    </>
  )
}

function UserMenu({ user }: { user?: LearnPressUserPayload | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    await fetch('/api/course-api/logout', { method: 'POST' })
    setIsLoggingOut(false)
    setOpen(false)
    router.refresh()
  }

  if (!user) {
    return (
      <Link
        href="/course-login"
        className="rounded-full border border-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-900 transition hover:bg-white md:ml-2"
        onClick={() => setOpen(false)}
      >
        Log In
      </Link>
    )
  }

  return (
    <div className="relative md:ml-2">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-900 transition hover:bg-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="rounded-full bg-indigo-600/10 px-2 py-1 text-xs uppercase tracking-[0.4em] text-indigo-600">
          {user.displayName?.slice(0, 1) ?? user.login?.slice(0, 1) ?? 'U'}
        </span>
        <span>{user.displayName ?? user.login ?? 'My Courses'}</span>
      </button>
      <div
        className={cx(
          'absolute right-0 mt-2 w-48 rounded-2xl border border-indigo-100 bg-white/95 p-2 text-sm text-indigo-900 shadow-lg transition md:origin-top-right',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        <Link
          href="/my-courses"
          className="block rounded-xl px-3 py-2 font-semibold hover:bg-indigo-50"
          onClick={() => setOpen(false)}
        >
          My Courses
        </Link>
        <button
          type="button"
          className="w-full rounded-xl px-3 py-2 text-left font-semibold text-rose-600 hover:bg-rose-50"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out…' : 'Log Out'}
        </button>
      </div>
    </div>
  )
}
