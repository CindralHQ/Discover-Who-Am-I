export type ThemeName = 'lotus' | 'manipura' | 'twilight' | 'anahata' | 'vishuddha' | 'sahasrara'

type ComponentClassSet = {
  quote: {
    wrapper: string
    accent: string
    author: string
  }
  nav: {
    base: string
    active: string
    focus: string
  }
  button: {
    primary: string
    secondary: string
    subtle: string
  }
  card: {
    wrapper: string
    eyebrow: string
    title: string
    body: string
  }
  surface: string
  text: string
  muted: string
}

export type ThemeDefinition = {
  label: string
  description: string
  classes: ComponentClassSet
}

export const themeLibrary: Record<ThemeName, ThemeDefinition> = {
  lotus: {
    label: 'Lotus Dawn',
    description: 'Soft rose palette inspired by sunrise meditations.',
    classes: {
      surface: 'bg-rose-50',
      text: 'text-rose-950',
      muted: 'text-rose-700',
      quote: {
        wrapper:
          'bg-gradient-to-br from-rose-50 via-white to-rose-100/70 border border-rose-200/70 shadow-lg shadow-black/10 ring-1 ring-rose-100/60',
        accent: 'text-rose-500',
        author: 'text-rose-600'
      },
      nav: {
        base: 'text-rose-700 hover:text-rose-900',
        active: 'bg-rose-100 text-rose-900',
        focus: 'focus-visible:ring-rose-300'
      },
      button: {
        primary: 'bg-rose-600 text-white border-transparent hover:bg-rose-500 focus-visible:ring-rose-500',
        secondary: 'bg-white text-rose-700 border-rose-200 hover:bg-rose-100 focus-visible:ring-rose-300',
        subtle: 'text-rose-700 border-transparent hover:bg-rose-100 focus-visible:ring-rose-200'
      },
      card: {
        wrapper: 'bg-white border border-rose-200 shadow-sm hover:border-rose-300 hover:shadow-md',
        eyebrow: 'text-rose-500',
        title: 'text-rose-900',
        body: 'text-rose-700'
      }
    }
  },
  manipura: {
    label: 'Manipura Radiance',
    description: 'Solar plexus fire rendered in luminous golds and ambers.',
    classes: {
      surface: 'bg-amber-50',
      text: 'text-amber-800',
      muted: 'text-amber-700',
      quote: {
        wrapper:
          'bg-gradient-to-br from-amber-50 via-white to-amber-100/70 border border-amber-200/70 shadow-lg shadow-black/10 ring-1 ring-amber-100/60',
        accent: 'text-amber-600',
        author: 'text-amber-700'
      },
      nav: {
        base: 'text-amber-700 hover:text-amber-900',
        active: 'bg-amber-100 text-amber-900',
        focus: 'focus-visible:ring-amber-300'
      },
      button: {
        primary: 'bg-amber-500 text-white-900 border-transparent hover:bg-amber-400 focus-visible:ring-amber-500',
        secondary: 'bg-white text-amber-700 border-amber-200 hover:bg-amber-100 focus-visible:ring-amber-300',
        subtle: 'text-amber-700 border-transparent hover:bg-amber-100 focus-visible:ring-amber-200'
      },
      card: {
        wrapper: 'bg-white border border-amber-200 shadow-sm hover:border-amber-300 hover:shadow-md',
        eyebrow: 'text-amber-500',
        title: 'text-amber-900',
        body: 'text-amber-700'
      }
    }
  },
  twilight: {
    label: 'Twilight Sky',
    description: 'Deep sky gradients mirroring dusk reflections.',
    classes: {
      surface: 'bg-sky-50',
      text: 'text-sky-900',
      muted: 'text-sky-600',
      quote: {
        wrapper:
          'bg-gradient-to-br from-sky-50 via-white to-sky-100/60 border border-sky-200/70 shadow-lg shadow-black/10 ring-1 ring-sky-100/60',
        accent: 'text-sky-600',
        author: 'text-sky-700'
      },
      nav: {
        base: 'text-sky-700 hover:text-sky-900',
        active: 'bg-sky-100 text-sky-900',
        focus: 'focus-visible:ring-sky-300'
      },
      button: {
        primary:
          'bg-sky-700 text-white border-transparent hover:bg-sky-600 focus-visible:ring-sky-500',
        secondary:
          'bg-white text-sky-700 border-sky-200 hover:bg-sky-100 focus-visible:ring-sky-300',
        subtle: 'text-sky-700 border-transparent hover:bg-sky-100 focus-visible:ring-sky-200'
      },
      card: {
        wrapper: 'bg-white border border-sky-200 shadow-sm hover:border-sky-300 hover:shadow-md',
        eyebrow: 'text-sky-500',
        title: 'text-sky-900',
        body: 'text-sky-700'
      }
    }
  },
  anahata: {
    label: 'Anahata Bloom',
    description: 'Heart-centre greens thriving with gentle vibrancy.',
    classes: {
      surface: 'bg-emerald-50',
      text: 'text-emerald-800',
      muted: 'text-emerald-700',
      quote: {
        wrapper:
          'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 border border-emerald-200/70 shadow-lg shadow-black/10 ring-1 ring-emerald-100/60',
        accent: 'text-emerald-600',
        author: 'text-emerald-700'
      },
      nav: {
        base: 'text-emerald-700 hover:text-emerald-900',
        active: 'bg-emerald-100 text-emerald-900',
        focus: 'focus-visible:ring-emerald-300'
      },
      button: {
        primary:
          'bg-emerald-600 text-white border-transparent hover:bg-emerald-500 focus-visible:ring-emerald-500',
        secondary:
          'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100 focus-visible:ring-emerald-300',
        subtle:
          'text-emerald-700 border-transparent hover:bg-emerald-100 focus-visible:ring-emerald-200'
      },
      card: {
        wrapper: 'bg-white border border-emerald-200 shadow-sm hover:border-emerald-300 hover:shadow-md',
        eyebrow: 'text-emerald-500',
        title: 'text-emerald-900',
        body: 'text-emerald-700'
      }
    }
  },
  vishuddha: {
    label: 'Vishuddha Clarity',
    description: 'Azure resonance tuned to the throat chakra.',
    classes: {
      surface: 'bg-sky-50',
      text: 'text-sky-800',
      muted: 'text-sky-700',
      quote: {
        wrapper:
          'bg-gradient-to-br from-sky-50 via-white to-sky-100/70 border border-sky-200/70 shadow-lg shadow-black/10 ring-1 ring-sky-100/60',
        accent: 'text-sky-600',
        author: 'text-sky-700'
      },
      nav: {
        base: 'text-sky-700 hover:text-sky-900',
        active: 'bg-sky-100 text-sky-900',
        focus: 'focus-visible:ring-sky-300'
      },
      button: {
        primary:
          'bg-sky-600 text-white border-transparent hover:bg-sky-500 focus-visible:ring-sky-500',
        secondary:
          'bg-white text-sky-700 border-sky-200 hover:bg-sky-100 focus-visible:ring-sky-300',
        subtle: 'text-sky-700 border-transparent hover:bg-sky-100 focus-visible:ring-sky-200'
      },
      card: {
        wrapper: 'bg-white border border-sky-200 shadow-sm hover:border-sky-300 hover:shadow-md',
        eyebrow: 'text-sky-500',
        title: 'text-sky-900',
        body: 'text-sky-700'
      }
    }
  },
  sahasrara: {
    label: 'Sahasrara Light',
    description: 'Crown-centre violets illuminated by a golden aura.',
    classes: {
      surface: 'bg-violet-50',
      text: 'text-violet-800',
      muted: 'text-violet-700',
      quote: {
        wrapper:
          'bg-gradient-to-br from-violet-50 via-white to-amber-50/60 border border-violet-200/70 shadow-[0_0_28px_rgba(245,197,53,0.2)] ring-1 ring-amber-100/60',
        accent: 'text-violet-600',
        author: 'text-violet-700'
      },
      nav: {
        base: 'text-violet-700 hover:text-violet-900',
        active: 'bg-violet-100 text-violet-900 shadow-[0_0_18px_rgba(245,197,53,0.25)]',
        focus: 'focus-visible:ring-amber-200'
      },
      button: {
        primary:
          'bg-violet-700 text-white border border-amber-300/60 shadow-[0_0_24px_rgba(245,197,53,0.45)] hover:bg-violet-600 focus-visible:ring-amber-200',
        secondary:
          'bg-white text-violet-700 border-amber-200 hover:bg-violet-50 hover:shadow-[0_0_18px_rgba(245,197,53,0.35)] focus-visible:ring-amber-200',
        subtle:
          'text-violet-700 border-transparent hover:bg-violet-100 focus-visible:ring-amber-200'
      },
      card: {
        wrapper:
          'bg-white border border-violet-200 shadow-sm hover:border-amber-200 hover:shadow-[0_0_26px_rgba(245,197,53,0.25)]',
        eyebrow: 'text-amber-600',
        title: 'text-violet-900',
        body: 'text-violet-700'
      }
    }
  }
}

export const typographyScale = [
  {
    token: 'display',
    label: 'Display / Bold',
    className: 'text-5xl md:text-6xl font-semibold tracking-tight',
    usage: 'Landing hero headlines'
  },
  {
    token: 'headline',
    label: 'Headline / Semibold',
    className: 'text-3xl md:text-4xl font-semibold tracking-tight',
    usage: 'Section intros and key statements'
  },
  {
    token: 'title',
    label: 'Title / Semibold',
    className: 'text-2xl font-semibold',
    usage: 'Cards, feature blocks'
  },
  {
    token: 'body',
    label: 'Body / Regular',
    className: 'text-base leading-7 text-slate-700',
    usage: 'Paragraph copy'
  },
  {
    token: 'caption',
    label: 'Caption / Medium',
    className: 'text-sm font-medium text-slate-500 uppercase tracking-wide',
    usage: 'Meta labels, supporting text'
  }
]

export const spacingScale = [
  { token: 'space-xs', rem: 0.5, usage: 'Dense stacks, captions' },
  { token: 'space-sm', rem: 0.75, usage: 'Default component gaps' },
  { token: 'space-md', rem: 1.0, usage: 'Card padding, button stacks' },
  { token: 'space-lg', rem: 1.5, usage: 'Section breathing room' },
  { token: 'space-xl', rem: 2.0, usage: 'Major layout rhythm' }
]

export const colorTokens = [
  { token: 'brand-50', value: '#eef7ff', usage: 'Soft tinted backgrounds' },
  { token: 'brand-200', value: '#b6d9ff', usage: 'Borders and surfaces' },
  { token: 'brand-400', value: '#60a3ff', usage: 'Secondary accents' },
  { token: 'brand-600', value: '#2b69d1', usage: 'Primary buttons' },
  { token: 'brand-800', value: '#1f4689', usage: 'Headlines and emphasis' }
]

export type ButtonVariant = 'primary' | 'secondary' | 'subtle'

export const buttonSizes = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base'
} as const

export const buttonBase =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border font-semibold tracking-tight shadow-sm shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60'

export const cardBase =
  'group relative flex flex-col gap-4 rounded-3xl p-6 transition-all duration-300'

export const quoteBase =
  'relative overflow-hidden rounded-3xl p-8 md:p-10 transition-colors'
