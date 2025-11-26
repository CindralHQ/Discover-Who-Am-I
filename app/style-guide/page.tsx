import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Quote } from '@/components/ui/Quote'
import {
  colorTokens,
  spacingScale,
  themeLibrary,
  ThemeName,
  typographyScale
} from '@/lib/designSystem'

const sampleQuotes: Record<ThemeName, string> = {
  lotus: 'Clarity arrives when the heart is soothed-design becomes a quiet invitation inward.',
  manipura: 'Solar warmth flows with generous spacing and gentle contrast. Let the interface breathe.',
  twilight: 'Depth emerges in the twilight tones; this palette holds the mystery with steadiness.',
  anahata: 'Soft verdant rhythm tends to the heart; align components to breathe with compassion.',
  vishuddha: 'Clear communication sings when the layout grants airy space for thoughtful pacing.',
  sahasrara: 'Crown-light gradients inspire reverence; let the interface glow with mindful intention.'
}

export const metadata = {
  title: 'Design System - Discover Who Am I'
}

export default function StyleGuidePage() {
  return (
    <div className="container space-y-16 pb-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Discover Who Am I - Style Guide
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Every page should compose its styling from the tokens and components catalogued here. Extend the
          system by updating this reference first.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Color Tokens</h2>
          <p className="text-sm text-slate-600">
            Use these brand hues for surfaces, accents, and interactions. Reference by token name in design
            documentation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {colorTokens.map((color) => (
            <div
              key={color.token}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-4">
                <span
                  className="h-12 w-12 rounded-xl border border-slate-200 shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <div>
                  <div className="text-base font-semibold text-slate-900">{color.token}</div>
                  <div className="text-sm text-slate-500">{color.usage}</div>
                </div>
              </div>
              <code className="text-xs font-mono text-slate-500">{color.value}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Typography Scale</h2>
          <p className="text-sm text-slate-600">
            Apply semantic tokens to maintain hierarchy. The scale adapts fluidly on larger breakpoints.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {typographyScale.map((type) => (
            <div
              key={type.token}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                {type.token}
              </div>
              <div className={`${type.className} mt-3`}>
                Sacred design reminds the viewer of their own stillness.
              </div>
              <div className="mt-3 text-sm text-slate-500">{type.usage}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Spacing Rhythm</h2>
          <p className="text-sm text-slate-600">
            Scale spacing consistently. Combine with Tailwind's responsive modifiers for layout nuance.
          </p>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {spacingScale.map((space) => (
            <div key={space.token} className="flex items-center gap-4">
              <div className="min-w-[140px]">
                <div className="text-sm font-semibold text-slate-800">{space.token}</div>
                <div className="text-xs text-slate-500">{space.usage}</div>
              </div>
              <div className="relative h-3 flex-1 rounded-full bg-slate-100">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-slate-400"
                  style={{ width: `${space.rem * 4}rem` }}
                />
              </div>
              <div className="w-16 text-right text-xs text-slate-500">{space.rem} rem</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Components &amp; Themes</h2>
          <p className="text-sm text-slate-600">
            Each theme adjusts component tones. Choose the palette that resonates with the page narrative.
          </p>
        </div>

        {(Object.entries(themeLibrary) as Array<[ThemeName, (typeof themeLibrary)[ThemeName]]>).map(
          ([themeName, themeDef]) => (
            <div
              key={themeName}
              className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <header className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                  {themeName}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{themeDef.label}</h3>
                <p className="text-sm text-slate-500">{themeDef.description}</p>
              </header>
              <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
                <Quote theme={themeName} text={sampleQuotes[themeName]} author="Style Guide" role="System Note" />
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Button theme={themeName}>Primary Action</Button>
                    <Button theme={themeName} variant="secondary">
                      Secondary
                    </Button>
                    <Button theme={themeName} variant="subtle">
                      Subtle
                    </Button>
                  </div>
                  <Card
                    theme={themeName}
                    eyebrow="Component"
                    title="Card Title"
                    description="Cards host short summaries or announcements. Keep the copy within three short sentences."
                  >
                    <Button theme={themeName} variant="subtle">
                      Learn more
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          )
        )}
      </section>
    </div>
  )
}
