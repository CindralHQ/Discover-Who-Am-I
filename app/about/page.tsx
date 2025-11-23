import Image from 'next/image'

import homeLogo from '@/assets/Logo.png'
import portraitVisual from '@/assets/visuals/Santosh-Ma-Shivratri-1.png'
import liberationVisual from '@/assets/visuals/Ajna-Chakra-Concentration.png'
import sacredVisual from '@/assets/visuals/Body-On-Fire-2.jpg'
import pathPortrait from '@/assets/visuals/Pathway-To-Light.png'
import subtleBodyVisual from '@/assets/visuals/All-Chakras-Aligned.png'
import trilogyVisual from '@/assets/visuals/Blue-Guru-Blessings.png'
import unveiledVisual from '@/assets/visuals/Light-Emitting-Through-Body.png'
import breathsVisual from '@/assets/visuals/Kundalini-Serpant.png'
import { LightboxImage } from '@/components/ui/LightboxImage'
import { WaiIntroOverlay } from '@/components/ui/WaiIntroOverlay'
import { themeLibrary, ThemeName } from '@/lib/designSystem'

const ABOUT_THEME: ThemeName = 'twilight'

export const metadata = { title: 'About - Who Am I' }

const awakeningHighlights = [
  'Almost immediately, Santosh Ma found herself on a spiritual journey with visions emerging during daily meditation.',
  'These visions were illustrated by her, mapping each phase the human body and mind traverses through awakening.',
  'Documented with rare detail, this visual journal shares a process of evolution seldom captured in spiritual literature.'
]

const thongdrolVisual = {
  src: liberationVisual,
  alt: 'Light emitting through the body representing the Thongdrol transmission'
}

const sacredVisualCopy = [
  'In deep meditation, spontaneous visions bloomed—an intricate map of the entire spiritual journey pouring forth in light.',
  'These visuals, filled with symbols across cultures and timeless traditions, form a universal language that requires no translation.',
  'They are not illustrations; they are keys that ignite remembrance, awaken dormant wisdom, and lift the seeker into subtler states of awareness.'
]

const subtleBodyCopy = [
  'For centuries, seekers have worked with the outer practices of yoga: the body, the breath, the mind.',
  'Santosh Ma’s work enters a deeper terrain—the subtle body, the original matrix of human existence.',
  'Her teachings illuminate the inner anatomy of the chakras, nadis, and Kundalini Shakti not as concepts, but as living forces that a seeker can recognise, feel, and evolve with.',
  'She traces the soul’s divine journey: from its emergence as the Jeev-Atma, to the long and most often unattained state - the flowering of the Spiritual Heart; while illuminating the sacred workings of Grace. In this sacred unveiling, the mysteries of the Granthis, the Body of Gold, and the Shiva-Lingam are revealed in their full glory.'
]

const trilogyCopy = [
  'Her now-renowned books—collectively called The Kundalini Trilogy—are a journal of her inner ascension.',
  'Each page carries the authenticity of lived experience, the exactitude of vision, and the gentleness of a teacher who has walked the path herself.',
  'These works later blossomed into the Who Am I Series, a four-part visual map of the soul’s ascent to the Sahasrara, offering seekers a clarity rarely found in modern spiritual literature.'
]

const unveiledCopy = [
  'Her visuals and explanations offer what mystics have rarely articulated openly—a detailed map of the ascent to the Sahasrar, the citadel of consciousness.',
  'It is here that the seeker realises the unity of the Creator and creation, the merging of the Atma into the Infinite.',
  'Her work opens this sacred pathway with tenderness, precision, and grace.'
]

const breathsCopy = [
  'Whilst studying Brahma Vidya under Justice M. L. Dudhat, Santosh Ma discovered the transformative power of the Eight Spiritual Breaths.',
  'Through deep practice, she realised that these breaths activate the subtle meridians and chakras—making the ascent of Kundalini more accessible and safe for aspirants.',
  'This led her to expand the Brahma Vidya teachings into a course book called The Eight Spiritual Breaths, detailing each breath’s purpose and its impact on the subtle body.'
]

export default function AboutPage() {
  const palette = themeLibrary[ABOUT_THEME].classes
  const headingClass = palette.card.title

  return (
    <div className="space-y-12 md:space-y-14">
      <WaiIntroOverlay theme={ABOUT_THEME} icon={homeLogo} label="Discover Who Am I" size="hero" applyBodyTint={false} />
      <section className="text-sky-800">
        <p className="text-sm font-medium uppercase tracking-[0.4em] text-sky-400">About</p>
        <h1 className={`mt-2 mb-3 text-4xl font-semibold tracking-tight ${headingClass} md:text-5xl`}>
          Discover Who Am I
        </h1>
        <p className="max-w-3xl text-base leading-7 text-sky-500">
          Discover Who Am I is a four-part series — a rare visual revelation of Kundalini awakening that illuminates the inner anatomy of the chakras, nadis, and the unfolding of consciousness. It culminates in a profound gift to humanity: the sacred insights on the Three Granthis, the Shiva-Lingam, and the Body of Gold — knowledge never before shared in such depth and clarity.
        </p>
      </section>

      <section className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <div className="space-y-6 rounded-3xl border border-sky-100 bg-white p-8 shadow-sm">
          <header className="space-y-2">
            <h3 className={`text-2xl font-semibold ${headingClass}`}>
              About Santosh Ma
            </h3>
            <h4 className={`text-1xl font-semibold ${headingClass}`}>
              A Seer of the Inner Worlds  
              <br />    
              A Master Guide of the Subtle Body & Kundalini Wisdom
            </h4>
            <p className={`text-base leading-7 ${palette.muted}`}>
              There are beings who study spirituality,
              and there are rare ones through whom 
              spirituality reveals itself.
              <br />  
              Santosh Ma belongs to the latter.
              Her work is not constructed from books, 
              doctrine, or borrowed wisdom;
              it is directly downloaded from the inner universe,
              received through years of meditation and grace.
              <br />  
              She is a contemporary mystic whose life has 
              unfolded as a sacred experiment in consciousness.
              <br />  
              Her writings, courses, and visuals are not teachings 
              they are transmissions; doorways into the unseen 
              realms of the human awakening.

            </p>
          </header>
        </div>
        <LightboxImage
          src={portraitVisual}
          alt="Portrait of Santosh Ma during her spiritual practice"
          title="Santosh Ma's Awakening"
          description="Santosh Ma in deep spiritual practice, reflecting the inner inquiry that sparked the Who Am I series' detailed awakening account."
          className="aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl md:mr-auto"
          imageClassName="object-cover object-top"
          sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 100vw"
        />
      </section>

      <section className="space-y-8 rounded-3xl border border-sky-100 bg-white/95 p-8 shadow-sm">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-center">
          <figure className="mx-auto w-full max-w-lg md:mr-auto">
            <Image
              src={thongdrolVisual.src}
              alt={thongdrolVisual.alt}
              className="h-auto w-full rounded-2xl object-cover"
              sizes="(min-width: 768px) 35vw, 100vw"
            />
          </figure>
          <article className="space-y-4 text-base leading-7 text-sky-800">
            <h3 className="text-3xl font-semibold tracking-tight text-sky-900">Thongdrol : Liberation Through Seeing</h3>
            <h3 className="text-1xl font-semibold tracking-tight text-sky-900">Composed by Padmasambhava</h3>
            <p>
              Thongdrol :Liberation Through Seeing was composed by Padmasambhava.  The concept of Thongdrol rests on the belief that certain visuals  when seen help initiate the seer into a higher level of consciousness. The mere viewing of the unfurled thongdrol is said to cleanse the viewer of negative karma and initiate a realization.
            </p>
            <p>
             Thodol, known as The Tibetan Book of the Dead, one of the most famous works of Buddhist literature is also composed by the Tibetan, Indian master <a href="https://en.wikipedia.org/wiki/Padmasambhava" target="_blank" rel="noreferrer" className="font-semibold text-sky-700 underline">
                Padmasambhava
              </a>
              .
            </p>
          </article>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-sky-100 bg-white p-8 shadow-sm md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10">
        <div className="space-y-4">
          <h2 className={`text-2xl font-semibold tracking-tight ${headingClass}`}>
           A Contemporary Terma: The Hidden Treasure of <br /> ‘Discover Who Am I’
          </h2>
          <p className={`text-base leading-7 ${palette.muted}`}>
            In Vajrayana Buddhism, a terma is a “hidden treasure”
            a wisdom teaching concealed by enlightened masters
            until humanity becomes ready to receive it.
          </p>
          <p className={`text-base leading-7 ${palette.muted}`}>
           Many seekers feel that the Discover Who Am I series 
            carries this quality : a revelation arriving at 
            precisely the moment when the world stands 
            on the threshold of transformation.
          </p>
          <p className={`text-base leading-7 ${palette.muted}`}>
            As artificial intelligence rises in the outer world,
the ‘Discover Who Am I’ series  opens the inner intelligence, the luminous 
architecture of consciousness itself.

          </p>
        </div>
        <figure className="flex justify-center md:justify-end">
          <Image
            src={pathPortrait}
            alt="Illustration symbolising Santosh Ma's journey"
            className="h-auto w-full max-w-xs rounded-3xl object-cover md:max-w-sm"
            sizes="(min-width: 768px) 25vw, 70vw"
          />
        </figure>
      </section>


      <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white/95 p-8 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center">
        
        <figure className="mx-auto w-full max-w-lg md:ml-auto">
          <Image src={subtleBodyVisual} alt="Illustration of the subtle body mapped through glowing chakras" className="h-auto w-full rounded-2xl object-contain" />
        </figure>

        <article className="space-y-4 text-base leading-7 text-sky-800">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-400">A New Paradigm for the 21st Century</p>
          <h3 className="text-2xl font-semibold tracking-tight text-sky-900">The Subtle Body as the Key to Human Evolution</h3>
          {subtleBodyCopy.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
        
      </section>

      <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white/95 p-8 shadow-sm md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center">
        <figure className="mx-auto w-full max-w-lg md:mr-auto">
          <Image src={trilogyVisual} alt="Cover art referencing The Kundalini Trilogy" className="h-auto w-full rounded-2xl object-cover" />
        </figure>
        <article className="space-y-4 text-base leading-7 text-sky-800">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-400">Key Contributions</p>
          <h3 className="text-3xl font-semibold tracking-tight text-sky-900">The Kundalini Trilogy: A Chronicle of Awakening</h3>
          {trilogyCopy.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </section>

      <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white/95 p-8 shadow-sm md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
        <article className="space-y-4 text-base leading-7 text-sky-800">
          <h3 className="text-3xl font-semibold tracking-tight text-sky-900">Unveiled : The Holy Grail of the Inner Journey</h3>
          {unveiledCopy.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
        <figure className="mx-auto w-full max-w-lg md:ml-auto">
          <Image src={unveiledVisual} alt="Artwork showing the luminous pathway toward Sahasrar" className="h-auto w-full rounded-2xl object-cover" />
        </figure>
      </section>

      <section className="grid gap-8 rounded-3xl border border-sky-100 bg-white/95 p-8 shadow-sm md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        <figure className="mx-auto w-full max-w-lg md:mr-auto">
          <Image src={breathsVisual} alt="Sacred depiction of kundalini energy winding upward" className="h-auto w-full rounded-2xl object-contain" />
        </figure>
        <article className="space-y-4 text-base leading-7 text-sky-800">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-400">The Eight Spiritual Breaths</p>
          <h3 className="text-3xl font-semibold tracking-tight text-sky-900">The Beginning of a Sacred Download</h3>
          {breathsCopy.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </section>

      <section className="rounded-3xl bg-sky-50 p-8 text-base leading-7 text-sky-800 ring-1 ring-sky-100/70">
        <h2 className={`text-2xl font-semibold ${headingClass}`}>Stay Connected</h2>
        <p className="mt-3 text-sky-800">
          Santosh Ma hosts ongoing mentoring circles where questions on meditation, chakras, and Kundalini are met with
          warmth and clarity. Learn more about The Eight Spiritual Breaths at{' '}
          <a
            href="https://www.eightspiritualbreaths.com"
            rel="noopener noreferrer"
            target="_blank"
            className="font-semibold text-sky-600 underline decoration-sky-400 hover:text-sky-700"
          >
            eightspiritualbreaths.com
          </a>
          .
        </p>
      </section>
    </div>
  )
}
