import { themeLibrary, ThemeName } from '@/lib/designSystem'

type LegalSection = {
  heading: string
  body: string[]
}

type LegalPageProps = {
  theme?: ThemeName
  title: string
  intro: string
  sections: LegalSection[]
}

export function LegalPage({
  theme = 'twilight',
  title,
  intro,
  sections
}: LegalPageProps) {
  const palette = themeLibrary[theme].classes
  const headingClass = palette.card.title

  return (
    <div className="container space-y-12">
      <section className={`rounded-3xl border border-white/70 ${palette.surface} p-8 shadow-sm`}>
        <div className="space-y-3">
          <h1 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>{title}</h1>
          <p className={`text-base leading-7 ${palette.muted}`}>{intro}</p>
        </div>
      </section>

      <article className="space-y-10">
        {sections.map((section, index) => (
          <section key={index} className="space-y-3">
            <h2 className={`text-xl font-semibold ${headingClass}`}>{section.heading}</h2>
            {section.body.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className={`text-base leading-7 ${palette.muted}`}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}
