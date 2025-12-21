import Image, { type StaticImageData } from 'next/image'

import { Card } from '@/components/ui/Card'
import { themeLibrary, ThemeName } from '@/lib/designSystem'
import {
  fetchTestimonials,
  fetchVideoTestimonials,
  type SheetTestimonial,
  type DriveVideoTestimonial
} from '@/lib/googleSheets'
import featuredPortrait from '@/assets/visuals/Sahasrara-Blossoming-2.jpeg'
import pathwayToLightVisual from '@/assets/visuals/Pathway-To-Light.png'
import chakrasVisual from '@/assets/visuals/AllChakras.png'
import australiaFlag from '@/assets/australia-flag.webp'
import placeholderPortrait from '@/assets/visuals/Blue-Guru-Blessings.png'

const TESTIMONIALS_THEME: ThemeName = 'twilight'

const FALLBACK_TESTIMONIALS: SheetTestimonial[] = [
  {
    name: 'Ananya',
    title: 'Energy That Travels',
    designation: 'Yoga Practitioner',
    country: 'India',
    testimonial:
      '“The transmissions felt personal even through the screen. I could sense the current working in real-time.”'
  },
  {
    name: 'Lucas',
    title: 'Held and Understood',
    designation: 'Retreat Guest',
    country: 'Australia',
    testimonial:
      '“These teachings gave me language for sensations I have carried for decades. I felt held and understood.”'
  },
  {
    name: 'Maya',
    title: 'Grounded Practices',
    designation: 'Meditation Student',
    country: 'USA',
    testimonial: '“The practices are precise and grounded. My meditation unfolded with new steadiness.”'
  },
  {
    name: 'Asha',
    title: 'Guidance Through Change',
    designation: 'Seeker',
    country: 'United Kingdom',
    testimonial: '“I revisit these sessions weekly. The energy remains alive, guiding me through major life shifts.”'
  }
]

export const metadata = { title: 'Testimonials' }

type FeaturedVoiceCard = {
  title: string
  quote: string
  image: StaticImageData
  imageAlt: string
}

const FEATURED_VOICE_AUTHOR = {
  name: 'Eleanor Gwynn',
  designation: 'Seeker',
  country: 'Australia'
}

const FEATURED_VOICE_CARDS: FeaturedVoiceCard[] = [
  {
    title: 'An Education for Every Human',
    quote:
      "The 'Who Am I' series is the education that every human should be given from birth so that they can learn, apply, understand and embody the fullness of what's possible in a human life.",
    image: featuredPortrait,
    imageAlt: 'Visionary artwork from the Who Am I series'
  },
  {
    title: 'A Living Map of Humanity',
    quote:
      "The Who am I series encapsulates the evolutionary potential of what humanity can become. A new, never before articulated  way of seeing what it is to be human. A new way of embodying the highest and most authentic expression of existence in human form. The power of these series to transform humanity can’t be overstated.",
    image: chakrasVisual,
    imageAlt: 'Chakra visual symbolising the Who Am I map'
  },
  {
    title: 'Instruction Manual for Now',
    quote:
      "\"Who Am I - Part 1\" is the instruction manual for life that every human being should have been given in school and early life.\n\nIn a world where we train for everything except how to live as a human, this series offers rare, accessible wisdom on the Chakras, Kundalini Shakti, and the true purpose of our existence.\n\nIf ever there was a teaching humanity needs right now, this is it.",
    image: pathwayToLightVisual,
    imageAlt: 'Pathway to Light artwork symbolising guidance and clarity'
  }
]

export default async function Testimonials() {
  const [primaryFeaturedVoice, ...otherFeaturedVoiceCards] = FEATURED_VOICE_CARDS
  const palette = themeLibrary[TESTIMONIALS_THEME].classes
  const headingClass = palette.card.title
  const videoTestimonials: DriveVideoTestimonial[] = await fetchVideoTestimonials()
  const remoteTestimonials = await fetchTestimonials()
  const prioritizedVideoTitles = [
    'Initiation Through Ignition by Sacred Visuals',
    'the secret to the meaning of life delivered',
    'Observe the experience'
  ]
  const normalizeTitle = (title?: string) => title?.toLowerCase().replace(/\s+/g, ' ').trim() ?? ''
  const prioritizedTitleLookup = new Map(
    prioritizedVideoTitles.map((title, index) => [normalizeTitle(title), index])
  )
  const prioritizedVideoTestimonials = videoTestimonials
    .map((video, index) => ({
      video,
      rank:
        prioritizedTitleLookup.get(normalizeTitle(video.title)) ??
        prioritizedVideoTitles.length + index
    }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ video }) => video)
  const testimonials: SheetTestimonial[] =
    remoteTestimonials.length > 0 ? remoteTestimonials : FALLBACK_TESTIMONIALS
  const usingFallback = remoteTestimonials.length === 0

  return (
    <div className="container space-y-12">
 

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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex h-full flex-col gap-4">
                <article className="flex h-full flex-col gap-4 rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/60">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-[22px] border border-sky-100 bg-sky-50">
                      <Image
                        src={primaryFeaturedVoice.image}
                        alt={primaryFeaturedVoice.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 64px, 64px"
                        priority
                      />
                    </div>
                    <p className="text-base font-semibold text-sky-800">{primaryFeaturedVoice.title}</p>
                  </div>
                  <p className="text-base leading-7 text-sky-900">{primaryFeaturedVoice.quote}</p>
                </article>

                <article className="flex h-full flex-col justify-between gap-4 rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/60">
                  <div className="flex items-center gap-3">
                    <Image
                      src={australiaFlag}
                      alt="Australian flag"
                      width={88}
                      height={56}
                      className="h-14 w-auto rounded-md border border-sky-100 shadow"
                      priority
                    />
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                        Featured Voice
                      </span>
                      <p className="text-lg font-semibold text-sky-900">{FEATURED_VOICE_AUTHOR.name}</p>
                      {[FEATURED_VOICE_AUTHOR.designation, FEATURED_VOICE_AUTHOR.country].filter(Boolean).length > 0 ? (
                        <p className="text-sm font-medium text-sky-500">
                          {[FEATURED_VOICE_AUTHOR.designation, FEATURED_VOICE_AUTHOR.country].filter(Boolean).join(' • ')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>

              {otherFeaturedVoiceCards.map((card, index) => (
                <article
                  key={`featured-voice-${index + 1}`}
                  className="flex h-full flex-col gap-4 rounded-[28px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-[22px] border border-sky-100 bg-sky-50">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 64px, 64px"
                      />
                    </div>
                    <p className="text-base font-semibold text-sky-800">{card.title}</p>
                  </div>
                  <p className="text-base leading-7 text-sky-900">{card.quote}</p>
                </article>
              ))}
            </div>
          </div>



    {prioritizedVideoTestimonials.length > 0 ? (
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
            {prioritizedVideoTestimonials.map((video) => (
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
                        <div className="space-y-1.5">
                          {testimonial.title ? (
                            <p className="text-base font-semibold text-sky-700">{testimonial.title}</p>
                          ) : null}
                          <span className="text-sm font-semibold uppercase tracking-[0.1em] text-sky-500">
                            Testimonial By
                          </span>
                          <p className="!mt-0 text-sm font-semibold text-sky-800">{testimonial.name}</p>
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
