import Image, { type StaticImageData } from 'next/image'

import { Card } from '@/components/ui/Card'
import { Quote } from '@/components/ui/Quote'
import { themeLibrary, ThemeName } from '@/lib/designSystem'
import {
  fetchTestimonials,
  fetchVideoTestimonials,
  type SheetTestimonial,
  type DriveVideoTestimonial
} from '@/lib/googleSheets'
import featuredPortrait from '@/assets/visuals/Sahasrara-Blossoming-2.jpeg'
import placeholderPortrait from '@/assets/visuals/Blue-Guru-Blessings.png'

const TESTIMONIALS_THEME: ThemeName = 'twilight'

const FALLBACK_TESTIMONIALS: SheetTestimonial[] = [
  {
    name: 'Ananya',
    designation: 'Yoga Practitioner',
    country: 'India',
    testimonial:
      '“The transmissions felt personal even through the screen. I could sense the current working in real-time.”'
  },
  {
    name: 'Lucas',
    designation: 'Retreat Guest',
    country: 'Australia',
    testimonial:
      '“These teachings gave me language for sensations I have carried for decades. I felt held and understood.”'
  },
  {
    name: 'Maya',
    designation: 'Meditation Student',
    country: 'USA',
    testimonial: '“The practices are precise and grounded. My meditation unfolded with new steadiness.”'
  },
  {
    name: 'Asha',
    designation: 'Seeker',
    country: 'United Kingdom',
    testimonial: '“I revisit these sessions weekly. The energy remains alive, guiding me through major life shifts.”'
  }
]

export const metadata = { title: 'Testimonials' }

const FEATURED_TESTIMONIAL = {
  name: 'Seeker, Canada',
  role: 'Featured Reflection',
  designation: 'Energy Medicine Practitioner',
  country: 'Canada',
  testimonial:
    '“During Who Am I, I felt the current holding me steady. Every session was like sitting with Santosh Ma in person.”',
  image: featuredPortrait
}

export default async function Testimonials() {
  const palette = themeLibrary[TESTIMONIALS_THEME].classes
  const headingClass = palette.card.title
  const videoTestimonials: DriveVideoTestimonial[] = await fetchVideoTestimonials()
  const remoteTestimonials = await fetchTestimonials()
  const testimonials: SheetTestimonial[] =
    remoteTestimonials.length > 0 ? remoteTestimonials : FALLBACK_TESTIMONIALS
  const usingFallback = remoteTestimonials.length === 0

  return (
    <div className="space-y-12">
 

      <section className="space-y-5">
        <header className="space-y-2">
          <h1 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            What Our Students Share
          </h1>
          <p className={`text-base leading-7 ${palette.muted}`}>
            {usingFallback
              ? 'Live testimonials will appear here once Google Sheets access is configured. Meanwhile, a curated selection is shown below.'
              : 'These reflections are streamed directly from the community submissions we have permission to share.'}
          </p>
        </header>

        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-100/80 p-6 shadow-lg shadow-sky-200/40 ring-1 ring-sky-200/60 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-[28px] border border-white/70 shadow-inner shadow-sky-300/40 md:h-48 md:w-48">
                <Image
                  src={FEATURED_TESTIMONIAL.image}
                  alt={`Portrait of ${FEATURED_TESTIMONIAL.name}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 768px) 128px, 112px"
                />
              </div>
              <div className="space-y-3">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                  Featured Voice
                </span>
                <p className="text-lg leading-7 text-sky-900 whitespace-pre-line">
                  {FEATURED_TESTIMONIAL.testimonial}
                </p>
                <div className="text-sm font-semibold text-sky-700">
                  {FEATURED_TESTIMONIAL.name}
                  {FEATURED_TESTIMONIAL.role ? (
                    <span className="mt-0.5 block text-sky-500/80">{FEATURED_TESTIMONIAL.role}</span>
                  ) : null}
                  {[FEATURED_TESTIMONIAL.designation, FEATURED_TESTIMONIAL.country].filter(Boolean).length > 0 ? (
                    <span className="mt-0.5 block text-sky-400">
                      {[FEATURED_TESTIMONIAL.designation, FEATURED_TESTIMONIAL.country]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>



{videoTestimonials.length > 0 ? (
        <section className="space-y-5 mt-5">
          <header className="space-y-2">
            <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
              Expressions from the Heart - The Voice of Experience
            </h2>
            <p className={`text-base leading-7 ${palette.muted}`}>
              Each voice carries the imprint of a unique journey — a shift in awareness, a deepening in presence, a quiet remembrance of truth.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videoTestimonials.map((video) => (
              <Card
                key={video.id}
                theme={TESTIMONIALS_THEME}
                className="flex h-full flex-col gap-4 rounded-3xl bg-white/80 p-6 shadow-sm shadow-sky-200/30 md:p-7"
                title={video.title}
                description={video.description}
                leadingVisual={
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                }
              />
            ))}
          </div>
        </section>
      ) : null}




          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => {
              const photoSrc: string | StaticImageData = testimonial.photoUrl ?? placeholderPortrait
              const isRemoteImage = typeof photoSrc === 'string'

              return (
                <Card
                  key={`${testimonial.name}-${index}`}
                  theme={TESTIMONIALS_THEME}
                  className="flex h-full flex-col gap-5 rounded-3xl bg-white/80 p-6 shadow-sm shadow-sky-200/30 md:p-7"
                  leadingVisual={
                    <div className="flex flex-col gap-4">
                      <p className="text-base leading-7 text-sky-700 whitespace-pre-line">
                        {testimonial.testimonial}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="relative h-[5.75rem] w-[5.75rem] overflow-hidden rounded-[24px] border border-white/70 bg-white/70 shadow-inner shadow-sky-200/60 md:h-[6.5rem] md:w-[6.5rem]">
                          <Image
                            src={photoSrc}
                            alt={`Portrait of ${testimonial.name}`}
                            fill
                            className="object-cover"
                            unoptimized={isRemoteImage}
                            sizes="(min-width: 768px) 104px, 92px"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                            Testimonial
                          </span>
                          <p className="text-base font-semibold text-sky-800">{testimonial.name}</p>
                          {[testimonial.designation, testimonial.country].filter(Boolean).length > 0 ? (
                            <p className="text-sm font-medium text-sky-500">
                              {[testimonial.designation, testimonial.country].filter(Boolean).join(' • ')}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  }
                />
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
