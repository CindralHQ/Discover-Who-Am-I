'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { themeLibrary, ThemeName } from '@/lib/designSystem'
import type { LearnPressUserPayload } from '@/lib/learnpress'
import { Nav } from '@/components/Nav'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type HeaderProps = {
  theme?: ThemeName
  className?: string
  sticky?: boolean
  user?: LearnPressUserPayload | null
}

export function Header({ theme = 'twilight', className, sticky = true, user }: HeaderProps) {
  const { text, surface } = themeLibrary[theme].classes
  const pathname = usePathname()
  const isHome = pathname === '/'
  return (
    <header
      className={cx(
        'relative border-b backdrop-blur supports-[backdrop-filter]:bg-white/70',
        surface,
        sticky ? 'sticky top-0 z-50' : '',
        isHome ? '' : 'mb-10',
        className
      )}
    >
      <div className="flex h-16 w-full items-center justify-between px-6 md:px-10">
        <Link href="/" className={cx('text-lg font-semibold tracking-tight', text)}>
          Discover Who Am I
        </Link>
        <Nav theme={theme} user={user} />
      </div>
    </header>
  )
}
