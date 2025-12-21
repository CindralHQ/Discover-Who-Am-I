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
import sahasraraIcon from '@/assets/icons/Sahasrara.png'
import heroVisual from '@/assets/visuals/Sahasrara-Blossoming-2.jpeg'
import granthiVisual from '@/assets/visuals/All-Chakras-Aligned.png'
import shivLingaVisual from '@/assets/visuals/ShivLingam.png'
import bodyOfGoldVisual from '@/assets/visuals/Sahasrar-Blossoming.png'
import courseVisual from '@/assets/visuals/OM.png'
import uniquenessVisual from '@/assets/visuals/Light-Emitting-Through-Body.png'
import whyWatchVisual from '@/assets/visuals/Pathway-To-Light.png'
import quoteVisual from '@/assets/visuals/Sahasrar-Blossoming.png'

const THEME: ThemeName = 'sahasrara'
const WAI_FOUR_PRODUCT_ID = 2466
const ENROLL_URL = buildWooCheckoutUrl(WAI_FOUR_PRODUCT_ID)

type VisualAsset = { src: StaticImageData; alt: string }

const seriesOverview: Array<{
  title: string
  description: string
  visual: VisualAsset
}> = [
  {
    title: 'Teachings on the Three Granthis',
    description:
      'Detailed revelations on the Brahma, Vishnu, and Rudra Granthis - the energetic knots guarding the highest ascent.',
    visual: {
      src: granthiVisual,
      alt: 'Chakra alignment artwork representing the three granthis'
    }
  },
  {
    title: 'Inner Shiva-Linga',
    description:
      'A direct transmission of the inner Shiva-Linga and its energetic counterpart experienced through deep meditation.',
    visual: {
      src: shivLingaVisual,
      alt: 'Sacred Shiva Linga bathed in golden light'
    }
  },
  {
    title: 'The Body of Gold',
    description:
      'Guidance into the final emergence of the golden body - the awakened, luminous human vessel.',
    visual: {
      src: bodyOfGoldVisual,
      alt: 'Sahasrara blossoming into the golden body'
    }
  }
]

const depthHighlights = [
  'Over 150 sacred visuals downloaded in deep meditation, mapping each transmutation step by step.',
  "Insights born from Santosh Ma's lived process of spiritual transmutation, guided by higher intelligence.",
  'Experiential truth, sacred imagery, and timeless yogic wisdom blended for the modern seeker.'
]

const courseContent = [
  'The Brahma Granthi',
  'The Vishnu Granthi',
  'The Rudra Granthi',
  'The Secret of the Linga',
  'The Body of Gold'
]

const uniqueness = [
  'Direct mystical revelations - not borrowed theory.',
  'Sacred illustrations carrying subtle energetic resonance that lifts awareness.',
  'A multidimensional map of the human being that advances ancient yogic understanding.',
  'Helps seekers make a quantum leap in self-knowledge and self-discovery.',
  'Explains advanced inner mechanisms in a way that remains accessible.'
]

const uniquePoints = [...depthHighlights, ...uniqueness]

const whyWatch = [
  'Seekers devoted to the question "Who Am I".',
  'Yoga teachers and students ready to deepen subtle-body mastery.',
  'Scholars and researchers exploring kundalini, consciousness, and mysticism.',
  'Interdisciplinary faculties synthesising ancient wisdom with neurobiology and human evolution.'
]

const uniqueCallout =
  'Part 4 lifts the final veil—inviting you to embody the golden body and live from the light of Sahasrara each day.'

const uniqueCardStyles = {
  wrapper:
    'rounded-3xl border border-violet-200/70 bg-gradient-to-br from-white/95 via-violet-50/90 to-amber-100/70 p-6 shadow-[0_18px_40px_rgba(109,40,217,0.16)]',
  icon:
    'inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/90 text-violet-600 shadow-inner shadow-amber-500/20',
  text: 'text-base leading-7 text-violet-800'
} as const

export const metadata = { title: 'Who Am I - Part 4' }

export default async function WaiFourPage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  const hasCourseAccess = authToken
    ? await userHasCourseAccess(
        ['wai part 4', 'who am i - part iv', 'part iv', 'part 4', 'wai4'],
        authToken
      )
    : false
  const primaryCtaHref = hasCourseAccess ? '/my-courses' : ENROLL_URL
  const primaryCtaLabel = hasCourseAccess ? 'Continue Learning' : 'Enroll Now'
  const localizedPrice = getLocalizedCoursePrice('wai4')
  const sanitizePrice = (value?: string | null) => {
    if (!value) return null
    const withoutTags = value.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
    return withoutTags.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 10)))
  }
  let dynamicPrice: string | null = null
  try {
    const product = await fetchWooProduct(WAI_FOUR_PRODUCT_ID)
    dynamicPrice = sanitizePrice(product.price_html) ?? sanitizePrice(product.price)
  } catch (error) {
    console.error('[wai4] Unable to fetch WooCommerce price', error)
  }
  const displayedPrice = dynamicPrice ?? localizedPrice
  const palette = themeLibrary[THEME].classes
  const headingClass = palette.card.title

  return (
    <>
      <WaiIntroOverlay theme={THEME} icon={sahasraraIcon} label="Sahasrara" />
      <div
        className={[
          'container',
          palette.surface,
          'min-h-screen rounded-[24px] px-3 py-8 shadow-inner shadow-black/5 sm:rounded-[32px] sm:px-6 sm:py-10 md:rounded-[36px] md:px-10'
        ].join(' ')}
      >
        <div className="space-y-16 md:space-y-20">
      <section className="space-y-8 rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-purple-900 p-6 text-white shadow-lg shadow-[0_0_45px_rgba(245,197,53,0.28)] ring-1 ring-amber-200/40 sm:p-7 md:p-9">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:items-center">
          <LightboxImage
            src={heroVisual}
            alt="Sahasrara blossoming into the body of gold"
            title="Body of Gold Awakening"
            description="The Part 4 hero visual representing the sahasrara blossoming into the luminous body of gold."
            className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-violet-200/40 bg-white/10 text-left shadow-xl md:aspect-square"
            imageClassName="object-cover"
            sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
            priority
          />
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-white/70">Who Am I Series</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Part IV - Beyond The Veil</h1>
              <p className="text-xl font-semibold text-white">
                Beyond the Veil: The Body of Gold 
              </p>
            </div>
            <div className="space-y-2 text-lg leading-8 text-white/90">
              <p>
                Based not on philosophy but on lived transformation, Part 4 reveals the deepest layers of
                yogic evolution - teachings historically reserved for seekers guided by a realised master.
              </p>
            </div>
            <ChakraNav active="wai4" />
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
          text="At the summit of the ascent, the seeker realises that the body of gold is nothing but the light of the Self revealing itself."
          author="Santosh Ma"
          role="Kundalini Diary"
          className="mb-8 flex-1 min-w-0 md:mb-0 md:mr-10"
        />
        <div className="relative h-48 w-48 shrink-0 mx-auto md:mx-0 md:h-64 md:w-64 lg:h-96 lg:w-96">
          <Image
            src={quoteVisual}
            alt="Sahasrara blossoming into the body of gold"
            fill
            className="object-contain drop-shadow-xl"
            sizes="(min-width: 1280px) 24rem, (min-width: 768px) 16rem, 14rem"
          />
        </div>
      </div>

      <section className="space-y-8">
        <header className="space-y-2 text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            About the Series
          </h2>
          <p className={`text-base leading-7 ${palette.muted}`}>
            Secret of Secrets explores the most esoteric dimensions of human evolution - long considered
            inaccessible.
          </p>
          <p className={`text-base leading-7 ${palette.muted}`}>
            Santosh Ma shares her direct inner experience of the culminating phases of spiritual evolution.
            Sacred visuals &mdash; downloaded from the Empyrean realms &mdash; guide seekers through the final stages of
            the soul&rsquo;s return.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {seriesOverview.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-3xl border border-violet-200 bg-white p-6 shadow-sm"
            >
              <LightboxImage
                src={item.visual.src}
                alt={item.visual.alt}
                title={item.title}
                description={item.description}
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/60 text-left"
                imageClassName="object-cover"
                sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
              />
              <h3 className={`text-lg font-semibold ${headingClass}`}>{item.title}</h3>
              <p className="text-base leading-7 text-violet-800">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <header className="space-y-2 text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            Course Content
          </h2>
        </header>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
        <LightboxImage
          src={courseVisual}
          alt="Sacred Om symbol emanating cosmic vibration"
          title="Sacred Om Resonance"
          description="The sacred Om symbol emanating cosmic vibration, anchoring the teachings explored in Part 4."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-violet-200/60 bg-white text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
        />
          <div className="space-y-4 rounded-3xl sm:p-8">
            <h3 className={`text-lg font-semibold ${headingClass}`}>The series will discuss:</h3>
            <ul className="space-y-2 text-base leading-7 text-violet-800">
              {courseContent.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10 md:items-center">
        <div className="space-y-4">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            What Makes This Series Unique
          </h2>
          <ul className="space-y-2 text-base leading-7 text-violet-800">
            {uniquePoints.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
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
          alt="Radiant light flowing through the subtle body"
          title="Radiant Subtle Body"
          description="Radiant light flowing through the subtle body, mirroring the transmissions held within Part 4."
          className="aspect-[4/4] overflow-hidden rounded-3xl border border-violet-200 bg-white text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
        />
      </section>

      <section className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:items-center">
        <LightboxImage
          src={whyWatchVisual}
          alt="Golden pathway representing the soul's return to source"
          title="Pathway Back to Source"
          description="A golden pathway illustration representing the soul's return to source, encapsulating the Part 4 journey."
          className="aspect-[4/3] overflow-hidden rounded-3xl border border-violet-200 bg-violet-100/40 text-left shadow-lg"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw"
        />
        <div className="space-y-4 rounded-3xl sm:p-8">
          <h3 className={`text-2xl font-semibold ${headingClass}`}>Why You Must Watch It</h3>
          <ul className="space-y-2 text-base leading-7 text-violet-800">
            {whyWatch.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
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
            <p>This is not just a course - it is a sacred transmission.</p>
            <p className="text-white/90">
              "When the three knots dissolve, the river meets the ocean. The body becomes gold, the spirit
              becomes light, and silence becomes the highest teaching."
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
