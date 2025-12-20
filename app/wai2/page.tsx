import Image, { type StaticImageData } from 'next/image'
import { cookies } from 'next/headers'

import { ButtonLink } from '@/components/ui/Button'
import { Quote } from '@/components/ui/Quote'
import { ThemeName, themeLibrary } from '@/lib/designSystem'
import { buildWooCheckoutUrl } from '@/lib/woocommerce'
import { LEARNPRESS_TOKEN_COOKIE, userHasCourseAccess } from '@/lib/learnpress'
import { ChakraNav } from '@/components/ui/ChakraNav'
import { EnrollBlock } from '@/components/ui/EnrollBlock'
import { WaiIntroOverlay } from '@/components/ui/WaiIntroOverlay'
import { LightboxImage } from '@/components/ui/LightboxImage'
import anahataIcon from '@/assets/icons/Anahata.png'
import heroVisual from '@/assets/visuals/Blue-Guru-Blessings.png'
import ascentVisual from '@/assets/visuals/All-Chakras-Aligned.png'
import journeyVisual from '@/assets/visuals/Body-On-Fire-2.jpg'
import heartMechanicsVisual from '@/assets/visuals/Gurus-Blessings-2.png'
import courseVisual from '@/assets/visuals/Freeing-Manipura-Blocks.png'
import uniquenessVisual from '@/assets/visuals/Receiving-Giving-Through-Ajna-Chakra.jpg'
import whyWatchVisual from '@/assets/visuals/Sitting-on-Lotus.jpg'
import quoteVisual from '@/assets/visuals/pink_lotus.png'

const THEME: ThemeName = 'anahata'
const WAI_TWO_PRODUCT_ID = 2464
const ENROLL_URL = buildWooCheckoutUrl(WAI_TWO_PRODUCT_ID)

type VisualAsset = { src: StaticImageData; alt: string }

const aboutHighlights: Array<{
  title: string
  description: string
  visual: VisualAsset
}> = [
  {
    title: 'Sacred Ascent Revealed',
    description:
      'It is perhaps for the first time in the history of spiritual literature that the sacred ascent of consciousness and the awakening of the Spiritual Heart has been revealed with such vivid clarity.',
    visual: {
      src: ascentVisual,
      alt: 'Chakra alignment artwork symbolising sacred ascent'
    }
  },
  {
    title: 'Journey to the Anahat Chakra',
    description:
      "Who Am I – Part 2 is a rare transmission from Santosh Ma that traces the soul’s journey from creation to its sacred reunion with the Self at the Anahat Chakra — the spiritual heart centre.",
    visual: {
      src: journeyVisual,
      alt: 'Blue lotus artwork representing the spiritual heart opening'
    }
  },
  {
    title: 'Living Mechanics of the Heart',
    description:
      'Through her own profound awakening, Santosh Ma reveals the deep inner mechanics of human evolution and the blossoming of divine love and wisdom within the heart.',
    visual: {
      src: heartMechanicsVisual,
      alt: 'Teacher bestowing blessings as light radiates through the heart'
    }
  }
]

const courseContent = [
  'How creation begins - the original impulse behind existence.',
  'Manifestation of the Atma - the divine spark within us.',
  "Birth of the Jeev-Atma - the soul's journey into duality.",
  'The ascent of consciousness - from lower chakras to heart awakening.',
  'The sacred meeting at the Anahat Chakra - where the soul reunites with the Self.',
  'The blossoming of the Spiritual Heart - divine love and awareness become one.'
]

const uniqueness = [
  'Direct insight from a living experience: Santosh Ma shares the visions received during deep meditation.',
  'Illustrated by the inner eye: sacred visuals are transmitted from realms where human will and divine will merge.',
  'An empirical lens on subtle-body studies rarely found in contemporary literature or academia.',
  'Each session is a living transmission - a visual shaktipat that awakens inner knowing.'
]

const whyWatch = [
  'Feel the spiritual heart awaken through Santosh Ma’s lived transmissions.',
  'Receive practical guidance on kundalini, consciousness, and mystic physiology.',
  'Deepen yoga and meditation practice with precise subtle-body wisdom.',
  'Witness the sacred ascent to the Anahat Chakra and blossoming of divine love.',
  'Anchor your path with compassionate mentorship for seekers, teachers, and researchers alike.'
]

const uniqueCallout =
  "This is not a course - it is a living transmission. Each session carries energetic resonance that awakens the heart's own remembering."

const uniqueCardStyles = {
  wrapper:
    'rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-white/95 via-emerald-50/90 to-emerald-100/70 p-6 shadow-[0_18px_40px_rgba(16,185,129,0.12)]',
  icon:
    'inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/90 text-emerald-600 shadow-inner shadow-emerald-500/20',
  text: 'text-base leading-7 text-emerald-800'
} as const

export const metadata = { title: 'Who Am I - Part 2' }

export default async function WaiTwoPage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  const hasCourseAccess = authToken
    ? await userHasCourseAccess(
        ['wai part 2', 'who am i - part ii', 'part ii', 'part 2', 'wai2'],
        authToken
      )
    : false
  const primaryCtaHref = hasCourseAccess ? '/my-courses' : ENROLL_URL
  const primaryCtaLabel = hasCourseAccess ? 'Continue Learning' : 'Enroll Now'
  const palette = themeLibrary[THEME].classes
  const headingClass = palette.card.title

  return (
    <>
      <WaiIntroOverlay theme={THEME} icon={anahataIcon} label="Anahata" />
      <div
        className={[
          'container',
          palette.surface,
          'min-h-screen rounded-[24px] px-3 py-8 shadow-inner shadow-black/5 sm:rounded-[32px] sm:px-6 sm:py-10 md:rounded-[36px] md:px-10'
        ].join(' ')}
      >
        <div className="space-y-16 md:space-y-20">
      <section className="space-y-8 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 p-6 text-white shadow-lg ring-1 ring-emerald-300/40 sm:p-7 md:p-9">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:items-center">
          <LightboxImage
            src={heroVisual}
            alt="Blessing visual symbolising the opening of the spiritual heart"
            title="Spiritual Heart Blessing"
            description="A blessing visual illustrating the opening of the spiritual heart as the seeker moves into Part 2."
            className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-emerald-200/40 bg-white/10 text-left shadow-xl md:aspect-square"
            imageClassName="object-cover"
            sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
            priority
          />
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-white/70">Who Am I Series</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Part II - Blossoming</h1>
              <p className="text-xl font-semibold text-white">Shaktipat & Blossoming of the Spiritual Heart</p>
            </div>
            <p className="text-lg leading-8 text-white/90">
              This course is a visual, energetic, and philosophical breakthrough for every sincere seeker on
              the spiritual path.
            </p>
            <ChakraNav active="wai2" />
            <div className="flex flex-wrap gap-3">
              <ButtonLink theme={THEME} size="lg" href={primaryCtaHref}>
                {primaryCtaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row md:items-center">
        <Quote
          theme={THEME}
          text="To the right of the chest lies the spiritual heart where the Creator dwells."
          author="Santosh Ma"
          role="Kundalini Diary"
          className="mb-8 flex-1 min-w-0 md:mb-0 md:mr-10"
        />
        <div className="relative h-48 w-48 shrink-0 mx-auto md:mx-0 md:h-64 md:w-64 lg:h-96 lg:w-96">
          <Image
            src={quoteVisual}
            alt="Blue lotus artwork representing the awakened spiritual heart"
            fill
            className="object-contain drop-shadow-xl"
            sizes="(min-width: 1280px) 24rem, (min-width: 768px) 16rem, 14rem"
          />
        </div>
      </div>

      <section className="space-y-8">
        <header className="space-y-2 text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            About the Who Am I - Part 2 Series
          </h2>
          <p className={`text-base leading-7 ${palette.muted}`}>
            A rare transmission that illuminates the sacred expansion of the spiritual heart.
          </p>
          <p className={`text-base leading-7 ${palette.muted}`}>
            Santosh Ma shares her direct inner experience of the culminating phases of spiritual evolution.
            Sacred visuals &mdash; downloaded from the Empyrean realms &mdash; guide seekers through the final stages of
            the soul&rsquo;s return.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {aboutHighlights.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6"
            >

              <LightboxImage
                src={item.visual.src}
                alt={item.visual.alt}
                title={item.title}
                description={item.description}
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 text-left"
                imageClassName="object-cover"
                sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
              />
              <h3 className={`text-lg font-semibold ${headingClass}`}>{item.title}</h3>
              <p className="text-base leading-7 text-emerald-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:items-center">
        <LightboxImage
          src={courseVisual}
          alt="Portrait of Santosh Ma channeling heart-centered wisdom"
          title="Heart-Centered Guidance"
          description="Santosh Ma channeling heart-centered wisdom that anchors the teachings within Part 2."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-emerald-200/50 bg-emerald-100/40 text-left shadow-md"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
        />
        <div className="space-y-4">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>Course Content</h2>
          <h3 className={`text-lg font-semibold ${headingClass}`}>What You Will Learn</h3>
          <ul className="space-y-2 text-base leading-7 text-emerald-800">
            {courseContent.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:items-center">
        <div className="space-y-4">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            What Makes This Series Unique?
          </h2>
          <ul className="space-y-3 text-base leading-7 text-emerald-800">
            {uniqueness.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className={uniqueCardStyles.wrapper}>
            <div className="flex items-start gap-4">
              <p className={uniqueCardStyles.text}>{uniqueCallout}</p>
            </div>
          </div>
        </div>
        <LightboxImage
          src={uniquenessVisual}
          alt="Energy exchange illustration representing heart transmission"
          title="Heart Transmission Visual"
          description="An energetic exchange depicting the heart transmission that makes Part 2 a living, breathing experience."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-emerald-200 bg-white text-left shadow-lg"
          imageClassName="object-top cover"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
        />
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:items-center">
        <LightboxImage
          src={whyWatchVisual}
          alt="Meditative figure seated on a lotus bathed in emerald light"
          title="Emerald Lotus Meditation"
          description="A meditative lotus visual that anchors the compassionate, heart-forward focus of the Part 2 teachings."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-100/50 text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw"
        />
        <div className="space-y-4 rounded-3xl sm:p-8">
          <h3 className={`text-2xl font-semibold ${headingClass}`}>Why You Must Watch It</h3>
          <ul className="space-y-2 text-base leading-7 text-emerald-800">
            {whyWatch.map((entry) => (
              <li key={entry} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        </div>
        
      </section>

      <EnrollBlock
        theme={THEME}
        price="INR 12,000"
        description="Embark on a sacred journey inward. Allow hidden wisdom to awaken, let the heart open, and feel the light of the soul rise."
        buttonHref={primaryCtaHref}
        buttonLabel={primaryCtaLabel}
      />
        </div>
      </div>
    </>
  )
}
