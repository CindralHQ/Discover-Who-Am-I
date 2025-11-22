import { ReactNode } from 'react'

import { Button, ButtonLink } from '@/components/ui/Button'
import { ThemeName } from '@/lib/designSystem'

type EnrollBlockProps = {
  theme: ThemeName
  description: ReactNode | string
  price: string
  buttonLabel?: string
  buttonHref?: string
  className?: string
}

const gradientByTheme: Record<ThemeName, string> = {
  lotus: 'from-rose-500 via-rose-600 to-rose-700',
  manipura: 'from-orange-500 via-orange-600 to-amber-600',
  twilight: 'from-sky-500 via-sky-600 to-slate-700',
  anahata: 'from-emerald-500 via-emerald-600 to-emerald-700',
  vishuddha: 'from-sky-500 via-sky-500 to-blue-600',
  sahasrara: 'from-violet-600 via-violet-700 to-purple-900 shadow-[0_0_32px_rgba(245,197,53,0.45)]'
}

export function EnrollBlock({
  theme,
  description,
  price,
  buttonLabel = 'Enroll Now',
  buttonHref,
  className
}: EnrollBlockProps) {
  const background = gradientByTheme[theme] ?? gradientByTheme.manipura

  return (
    <div
      className={[
        'rounded-3xl bg-gradient-to-br p-8 text-white shadow-xl shadow-black/20 md:p-10',
        background,
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 text-lg leading-8 text-white/90">
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <div className="text-xl font-semibold text-white">{price}</div>
          {buttonHref ? (
            <ButtonLink theme={theme} size="lg" href={buttonHref}>
              {buttonLabel}
            </ButtonLink>
          ) : (
            <Button theme={theme} size="lg">
              {buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
