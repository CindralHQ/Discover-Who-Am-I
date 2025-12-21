import Image, { type StaticImageData } from 'next/image'
import { cookies } from 'next/headers'

import { ButtonLink } from '@/components/ui/Button'
import { Quote } from '@/components/ui/Quote'
import { ThemeName, themeLibrary } from '@/lib/designSystem'
import { buildWooCheckoutUrl, fetchWooProduct } from '@/lib/woocommerce'
import { LEARNPRESS_TOKEN_COOKIE, userHasCourseAccess } from '@/lib/learnpress'
import { ChakraNav } from '@/components/ui/ChakraNav'
import { EnrollBlock } from '@/components/ui/EnrollBlock'
import { WaiIntroOverlay } from '@/components/ui/WaiIntroOverlay'
import { LightboxImage } from '@/components/ui/LightboxImage'
import { getLocalizedCoursePrice } from '@/lib/pricing'
import vishuddhaIcon from '@/assets/icons/Vishuddha.png'
import heroVisual from '@/assets/visuals/Sahasrar-Blossoming.png'
import crownRoadmapVisual from '@/assets/visuals/Ajna-Chakra-Concentration.png'
import ascentPathVisual from '@/assets/visuals/Pathway-To-Light.png'
import resonanceVisual from '@/assets/visuals/OM.png'
import courseVisual from '@/assets/visuals/Sahasrara-Blossoming-2.jpeg'
import uniquenessVisual from '@/assets/visuals/Blue-Guru-Blessings.png'
import whyWatchVisual from '@/assets/visuals/Gurus-Blessings-2.png'
import quoteVisual from '@/assets/visuals/Sahasrar-Blossoming.png'

const THEME: ThemeName = 'vishuddha'
const WAI_THREE_PRODUCT_ID = 2466
const ENROLL_URL = buildWooCheckoutUrl(WAI_THREE_PRODUCT_ID)

type VisualAsset = { src: StaticImageData; alt: string }

const ascentHighlights: Array<{
  title: string
  description: string
  visual: VisualAsset
}> = [
  {
    title: 'Crown of Awakening',
    description:
      'For the first time, the ascent of consciousness to the Sahasrar - the crown of awakening - is mapped with precise visuals.',
    visual: {
      src: crownRoadmapVisual,
      alt: 'Ajna chakra concentration artwork guiding the ascent toward the crown'
    }
  },
  {
    title: 'Inner Witness Accounts',
    description:
      "This is the sacred culmination of every seeker's path - the rise of consciousness to its divine summit. Through rare visuals and timeless wisdom, experience the revelation of the highest truth with.",
    visual: {
      src: ascentPathVisual,
      alt: 'A luminous pathway ascending toward the sahasrar'
    }
  },
  {
    title: 'Initiation Through Vision',
    description:
      'These luminous images transmit not just knowledge but a resonance that invites seekers into direct experience.',
    visual: {
      src: resonanceVisual,
      alt: 'Sacred Om symbol representing pure resonance'
    }
  }
]

const luminousResonance = [
  'Unfolding of the higher Self through grace-filled ascent.',
  'Teaching that transcends concept - it is initiation through vision.',
  'Direct energetic resonance with the crown centre.'
]

const courseReveals = [
  'The Spiritual Ladder - the ascent beyond effort into grace.',
  'The Spiritual Hand - a symbol of divine intervention and upliftment.',
  'The Celestial Bird - the liberated soul taking flight.',
  'Shaktipat - the act of grace transmitted from Guru to disciple.',
  'The Region of Om - the eternal vibration at the crown of creation.'
]

const audience = [
  'Seekers devoted to the path of inner transformation.',
  'Practitioners of yoga, meditation, or subtle energy work.',
  'Students of kundalini and subtle-body knowledge.',
  'Disciples who have received, or are called to receive, shaktipat.',
  'Anyone who has journeyed through Who Am I Parts 1 and 2.'
]

const sacredOffering = [
  'A rare and precious gift to seekers walking the yogic path.',
  'Shared experience that deepens understanding of subtle energy and the inner body.',
  'Practical wisdom that helps seekers live with balance, devotion, and awareness.'
]

const uniqueness = [
  'Direct insights grounded in lived mystical experience.',
  'Illustrations downloaded in deep meditation, carrying the imprint of higher realms.',
  'An empirical lens on subtle-body transformation seldom documented.',
  'Each session is a living transmission - an energetic invitation into grace.'
]

const uniquePoints = [...luminousResonance, ...uniqueness]
const whyWatch = [...audience, ...sacredOffering]

const uniqueCallout =
  'If you are ready to step into a deeper experience of consciousness and recognise your true self, this is your invitation.'

const uniqueCardStyles = {
  wrapper:
    'rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white/95 via-sky-50/90 to-sky-100/70 p-6 shadow-[0_18px_40px_rgba(14,165,233,0.12)]',
  icon:
    'inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/90 text-sky-600 shadow-inner shadow-sky-500/20',
  text: 'text-base leading-7 text-sky-800'
} as const

export const metadata = { title: 'Who Am I - Part 3' }

export default async function WaiThreePage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  const hasCourseAccess = authToken
    ? await userHasCourseAccess(
        ['wai part 3', 'who am i - part iii', 'part iii', 'part 3', 'wai3'],
        authToken
      )
    : false
  const primaryCtaHref = hasCourseAccess ? '/my-courses' : ENROLL_URL
  const primaryCtaLabel = hasCourseAccess ? 'Continue Learning' : 'Enroll Now'
  const localizedPrice = getLocalizedCoursePrice('wai3')
  const sanitizePrice = (value?: string | null) => {
    if (!value) return null
    const withoutTags = value.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
    return withoutTags.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)))
  }
  let dynamicPrice: string | null = null
  try {
    const product = await fetchWooProduct(WAI_THREE_PRODUCT_ID)
    dynamicPrice = sanitizePrice(product.price_html) ?? sanitizePrice(product.price)
  } catch (error) {
    console.error('[wai3] Unable to fetch WooCommerce price', error)
  }
  const displayedPrice = dynamicPrice ?? localizedPrice
  const palette = themeLibrary[THEME].classes
  const headingClass = palette.card.title

  return (
    <>
      <WaiIntroOverlay theme={THEME} icon={vishuddhaIcon} label="Vishuddha" />
      <div
        className={[
          'container',
          palette.surface,
          'min-h-screen rounded-[24px] px-3 py-8 shadow-inner shadow-black/5 sm:rounded-[32px] sm:px-6 sm:py-10 md:rounded-[36px] md:px-10'
        ].join(' ')}
      >
        <div className="space-y-16 md:space-y-20">
      <section className="space-y-8 rounded-3xl bg-gradient-to-br from-sky-500 via-sky-500 to-blue-600 p-6 text-white shadow-lg ring-1 ring-sky-300/40 sm:p-7 md:p-9">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:items-center">
          <LightboxImage
            src={heroVisual}
            alt="Sahasrara blossoming with radiant light"
            title="Sahasrar Blossoming"
            description="A luminous sahasrar visual charting the radiant blossoming explored throughout Part 3."
            className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-sky-200/40 bg-white/10 text-left shadow-xl md:aspect-square"
            imageClassName="object-cover"
            sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
            priority
          />
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-white/70">Who Am I Series</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Part III - Ascent</h1>
              <p className="text-xl font-semibold text-white">Journey to Sahasrar: The Final Ascent of Consciousness</p>
            </div>
            <p className="text-lg leading-8 text-white/90">
              Experience the final ascent of consciousness — a living transmission that awakens your inner awareness. This journey dissolves boundaries between self and silence, revealing the truth of Kundalini and the subtle body.
            </p>
            <ChakraNav active="wai3" />
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
          text="There comes a moment in the soul’s long journey where the ascent is no longer an effort, but an act of Grace."
          author="Santosh Ma"
          role="Kundalini Diary"
          className="mb-8 flex-1 min-w-0 md:mb-0 md:mr-10"
        />
        <div className="relative h-48 w-48 shrink-0 mx-auto md:mx-0 md:h-64 md:w-64 lg:h-96 lg:w-96">
          <Image
            src={quoteVisual}
            alt="Sahasrara blossoming into cascades of light"
            fill
            className="object-contain drop-shadow-xl"
            sizes="(min-width: 1280px) 24rem, (min-width: 768px) 16rem, 14rem"
          />
        </div>
      </div>

      <section className="space-y-8">
        <header className="space-y-3 text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            About the Who Am I - Part 3 Series
          </h2>
          <p className="text-base leading-7 text-sky-800">
            There comes a moment in the soul&rsquo;s long journey where the ascent is no longer an effort, but an act of
            grace. Part 3 documents this luminous threshold with startling clarity and devotion.
          </p>
          <p className="text-base leading-7 text-sky-800">
            Santosh Ma shares her direct inner experience of the culminating phases of spiritual evolution.
            Sacred visuals &mdash; downloaded from the Empyrean realms &mdash; guide seekers through the final stages of
            the soul&rsquo;s return.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {ascentHighlights.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-3xl border border-sky-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <LightboxImage
                src={item.visual.src}
                alt={item.visual.alt}
                title={item.title}
                description={item.description}
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 text-left"
                imageClassName="object-cover"
                sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
              />
              <h3 className={`text-lg font-semibold ${headingClass}`}>{item.title}</h3>
              <p className="text-base leading-7 text-sky-800">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:items-center">
        <LightboxImage
          src={courseVisual}
          alt="Guru's blessing transmitted through luminous light"
          title="Guru's Luminous Blessing"
          description="A luminous blessing visual that anchors the teachings delivered throughout Part 3."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-sky-200/60 bg-white text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
        />
        <div className="space-y-4 rounded-3xl bg-sky-50 p-6 shadow-sm sm:p-8">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>Course Content</h2>
          <ul className="space-y-2 text-base leading-7 text-sky-800">
            {courseReveals.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-base leading-7 text-sky-700">
            Each element is explained with inner precision, guiding seekers through the mystical anatomy of
            the soul's final ascent.
          </p>
        </div>
        
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:items-center">
        <div className="space-y-4">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            What Makes This Series Unique?
          </h2>
          <ul className="space-y-3 text-base leading-7 text-sky-800">
            {uniquePoints.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
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
          alt="Sahasrara blossoming with cascades of light"
          title="Cascades of Sahasrar Light"
          description="A sahasrar blossoming visual conveying the cascades of light described in Part 3."
          className="aspect-[4/4] overflow-hidden rounded-3xl border border-sky-200 bg-white text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
        />
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:items-center">
         <LightboxImage
          src={whyWatchVisual}
          alt="Guru enveloped in blue light symbolising sahasrara grace"
          title="Sahasrar Grace"
          description="A blue-lit guru visual embodying the sahasrar grace that permeates Part 3."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-sky-200 bg-sky-100/40 text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw"
        />
        <div className="space-y-4 rounded-3xl sm:p-8">
          <h3 className={`text-2xl font-semibold ${headingClass}`}>Why You Must Watch It</h3>
          <ul className="space-y-2 text-base leading-7 text-sky-800">
            {whyWatch.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
       
      </section>

      <EnrollBlock
        theme={THEME}
        price={displayedPrice}
        description={
          <>
            <p>
              A journey beyond the mind. Let this sacred unfolding illuminate your inner ascent. Let the
              Sahasrar blossom.
            </p>
            <p className="font-semibold text-white">
              Grace does not descend. Grace is revealed when the seeker is ready.
            </p>
          </>
        }
        buttonHref={primaryCtaHref}
        buttonLabel={primaryCtaLabel}
      />
        </div>
      </div>
    </>
  )
}
