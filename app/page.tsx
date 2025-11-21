import Image, { type StaticImageData } from 'next/image'

import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { HomeIntroOverlay } from '@/components/ui/HomeIntroOverlay'
import { LightboxImage } from '@/components/ui/LightboxImage'
import { JourneyPricingTable, type JourneyScheduleEntry } from '@/components/ui/JourneyPricingTable'
import { themeLibrary, ThemeName } from '@/lib/designSystem'
import { courses } from '@/data/courses'
import mastheadBackground from '@/assets/masthead.png'
import manipuraIcon from '@/assets/icons/Manipura.png'
import anahataIcon from '@/assets/icons/Anahata.png'
import vishuddhaIcon from '@/assets/icons/Vishuddha.png'
import sahasraraIcon from '@/assets/icons/Sahasrara.png'
import heroVisual from '@/assets/visuals/AllChakras.png'
import seriesVisual from '@/assets/visuals/Blue-Guru-Blessings.png'
import quotePortrait from '@/assets/visuals/Body-On-Fire-2.jpg'
import journeyVisual from '@/assets/visuals/Sahasrar-Blossoming.png'
import signatureVisual from '@/assets/visuals/AllChakras.png'
import callToActionVisual from '@/assets/visuals/Kundalini-Serpant.png'
import steadyingSelfVisual from '@/assets/visuals/Pathway-To-Light.png'
import livingTransmissionVisual from '@/assets/visuals/Sahasrara-Blossoming-2.jpeg'
import guidanceTodayVisual from '@/assets/visuals/Light-Emitting-Through-Body.png'
import roadmapVisual from '@/assets/visuals/ShivLingam.png'
import ancientKnowledgeVisual from '@/assets/visuals/Ajna-Chakra-Concentration.png'
import clarityVisual from '@/assets/visuals/Receiving-Giving-Through-Ajna-Chakra.jpg'

const HOME_THEME: ThemeName = 'twilight'
const SUPPORT_THEME: ThemeName = 'manipura'

const courseIconMap: Record<
  string,
  { icon: StaticImageData; iconBg: string; ring: string; cardClass: string }
> = {
  wai1: {
    icon: manipuraIcon,
    iconBg: 'bg-amber-100',
    ring: 'ring-amber-200/60',
    cardClass:
      '!bg-amber-50 !border-amber-200 !shadow-none text-amber-900 hover:!border-amber-300 hover:!shadow-none'
  },
  wai2: {
    icon: anahataIcon,
    iconBg: 'bg-emerald-100',
    ring: 'ring-emerald-200/60',
    cardClass:
      '!bg-emerald-50 !border-emerald-200 !shadow-none text-emerald-900 hover:!border-emerald-300 hover:!shadow-none'
  },
  wai3: {
    icon: vishuddhaIcon,
    iconBg: 'bg-sky-100',
    ring: 'ring-sky-200/60',
    cardClass:
      '!bg-sky-50 !border-sky-200 !shadow-none text-sky-900 hover:!border-sky-300 hover:!shadow-none'
  },
  wai4: {
    icon: sahasraraIcon,
    iconBg: 'bg-violet-100',
    ring: 'ring-violet-200/60',
    cardClass:
      '!bg-violet-50 !border-violet-200 !shadow-none text-violet-900 hover:!border-violet-300 hover:!shadow-none'
  }
}

const aboutBulletPoints: Array<string | { text: string; subPoints: string[] }> = [
  "The 'Who Am I Series' consisting of four parts shares pristine sacred knowledge of human evolution from the Mooladhar chakra to the Sahasrar.",
  {
    text: 'The series unfolds through four distinct parts that guide the seeker step by step:',
    subPoints: [
      'Part 1: Understanding the Role of Chakras and Kundalini Shakti',
      'Part 2: Shaktipat and Blossoming of The Spiritual Heart',
      'Part 3: Journey of the Atman From the Spiritual Heart to the Sahasrar',
      'Part 4: Beyond The Veil : The Secret of The 3 Granthis, The Shiva-Lingam & The Body of Gold'
    ]
  },
  'For the first time in human history, the deepest layers of yogic evolution traditionally reserved for advanced seekers have been decoded and presented with clarity.',
  'Supported by 250+ sacred, vibrant visuals illustrating the full spectrum of human evolution.'
]

const needOfHour = [
  {
    title: 'Steadying The Self',
    body: 'This body of work arrives as human consciousness awakens rapidly. It keeps seekers rooted in spirit amid fast-paced, material distractions.',
    visual: {
      src: steadyingSelfVisual,
      alt: 'Manipura chakra artwork representing steadying inner fire'
    }
  },
  {
    title: 'Living Transmission',
    body: 'The series is accessible yet profoundly transformative. Each visual lands like a mini shaktipat, awakening deeper self-realisation.',
    visual: {
      src: livingTransmissionVisual,
      alt: 'Light radiating through the subtle body'
    }
  },
  {
    title: 'Guidance For Today',
    body: 'A rare, immersive four-part experience that meets humanity at a pivotal moment, answering the timeless question: Who Am I?',
    visual: {
      src: guidanceTodayVisual,
      alt: 'Ajna chakra receiving and transmitting divine energy'
    }
  }
]

const journeySchedule = [
  {
    part: 'Part 1',
    title: 'Understanding the Role of Chakras and Kundalini Shakti',
    videos: 12,
    weeks: 12
  },
  {
    part: 'Part 2',
    title: 'Shaktipat and Blossoming of The Spiritual Heart',
    videos: 4,
    weeks: 4
  },
  {
    part: 'Part 3',
    title: 'Journey of the Atman From the Spiritual Heart to the Sahasrar',
    videos: 3,
    weeks: 3
  },
  {
    part: 'Part 4',
    title: 'Beyond The Veil: The Secret of The 3 Granthis, The Shiva-Lingam & The Body of Gold',
    videos: 4,
    weeks: 4
  },
  {
    part: 'Total',
    title: 'Complete Journey Totals',
    videos: 23,
    weeks: 23,
    isTotal: true
  }
] as const satisfies readonly JourneyScheduleEntry[]

const journeyPacing = ['1 month break between each series', 'Total minimum time needed: 26 weeks or 7 months']

const journeyReminders = [
  'Students are urged to move methodically and give Part 1 their complete focus—it lays the foundation for everything that follows.',
  'After completing the series, revisit the teachings. Many seekers return to the sessions multiple times at a small repeater token fee and discover fresh insights with each viewing.',
  'The sadhak’s subtle body recognises this knowledge; the unfolding energy continues to support your evolution as the series is watched year after year.'
]

const awakenTruth = [
  {
    title: 'A Roadmap Of Evolution',
    body: 'Twelve parts chart the journey from the causal body through the awakening of Ajna and beyond.',
    visual: {
      src: roadmapVisual,
      alt: 'Ajna chakra concentration visual'
    }
  },
  {
    title: 'Ancient Knowledge, Structured',
    body: 'Meticulously organises ancient teachings on consciousness and subtle anatomy into an experiential curriculum.',
    visual: {
      src: ancientKnowledgeVisual,
      alt: 'Sahasrara blossoming artwork'
    }
  },
  {
    title: 'Clarity On Subtle Systems',
    body: 'Offers unmatched insight into chakras, subtle bodies, and the phases of human evolution.',
    visual: {
      src: clarityVisual,
      alt: 'Kundalini serpent rising illustration'
    }
  }
]

const whySeries = [
  'First-person experience of a true yogic awakening.',
  'Sacred knowledge rarely shared outside master-disciple relationships.',
  'Not intellectual; this work is energetic, embodied, and alive.',
  'Each visual carries the energy of a silent shaktipat, awakening inner knowing.',
  'Lived experience, not theory.'
]

const whyNow = [
  'Deepen yogic understanding beyond the surface.',
  'Integrate this wisdom into teaching and personal practice.',
  'Align with your true path in a fast-changing world.',
  'Receive deep insights into the subtle body.',
  'Engage with real experience, not abstract concepts.',
  'Perfect for every yoga seeker and teacher.',
  'Clear, accessible guidance.',
  'Spiritually catalytic.',
  'Feels like a visual shaktipat.'
]

type AudienceIconKey = 'seekers' | 'teachers' | 'scholars' | 'faculties'

const audienceIconMap: Record<AudienceIconKey, string> = {
  seekers: 'self_improvement',
  teachers: 'school',
  scholars: 'menu_book',
  faculties: 'diversity_3'
}

type AudienceDefinition = {
  key: AudienceIconKey
  label: string
  copy: string
}

const audiences: AudienceDefinition[] = [
  { key: 'seekers', label: 'Seekers', copy: 'Individuals asking the essential question: Who Am I?' },
  {
    key: 'teachers',
    label: 'Yoga Teachers & Students',
    copy: 'Those seeking an authentic, advanced understanding of subtle body science.'
  },
  {
    key: 'scholars',
    label: 'Scholars & Researchers',
    copy: 'Explorers of consciousness, kundalini dynamics, and meditative physiology.'
  },
  {
    key: 'faculties',
    label: 'Interdisciplinary Faculties',
    copy: 'Learners connecting mysticism, neurobiology, and human evolution.'
  }
]

export default function HomePage() {
  const palette = themeLibrary[HOME_THEME].classes
  const headingClass = palette.card.title

  return (
    <>
      <div className="space-y-16">
        <HomeIntroOverlay />
        <section
          className="relative isolate -mt-6 full-bleed overflow-hidden py-24 text-white"
          style={{
            backgroundImage: `url(${mastheadBackground.src})`,
            backgroundPosition: '40% 20%',
            backgroundSize: 'cover'
          }}
        >
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 text-center md:min-h-[540px] md:flex-row md:items-end md:justify-between md:px-12 md:text-left lg:px-16">
            <div className="relative flex w-full flex-col items-center gap-6 md:max-w-xl md:items-start">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.45em] text-sky-100/90">
                  About The Series
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow md:text-5xl">
                  Who Am I
                </h1>
                <p className="text-xl font-medium text-sky-50/95 drop-shadow">
                  Journey of Jeev Atma to the Blossoming of Consciousness
                </p>
              </div>
              <p className="max-w-2xl text-base leading-7 text-white/85">
                The 'Who Am I Series' is a gift for humanity. A must-watch journey for every seeker, yoga teacher,
                yoga practitioner, and meditator - no matter the path.
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <ButtonLink
                  href="/wai1"
                  theme={SUPPORT_THEME}
                  size="lg"
                  className="!bg-amber-500/90 !text-white !border-white/40 !shadow-[0_18px_40px_rgba(255,176,0,0.25)] hover:!bg-amber-400 focus-visible:!outline-white"
                >
                  Explore the Course
                </ButtonLink>
              </div>
            </div>
            <LightboxImage
              src={heroVisual}
              alt="Radiant illustration of all chakras aligned through the subtle body"
              title="Who Am I - Visual Journey"
              description="This artwork captures the complete chakra alignment shared throughout the Who Am I series, symbolising the ascent of human consciousness."
              className="aspect-[4/5] w-full max-w-xl overflow-hidden rounded-3xl text-left focus-visible:outline-sky-500 md:ml-auto md:max-w-lg md:self-start lg:max-w-none"
              imageClassName="object-cover object-top md:object-[75%_0%]"
              sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </section>
        <div className="container space-y-20">
          <section className="rounded-3xl bg-gradient-to-br from-sky-900/80 via-sky-600 to-sky-400 p-6 text-slate-900 shadow-2xl sm:p-10">
            <div className="grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-center">
              <div className="relative aspect-[3/4] w-full overflow-hidden ring-1 ring-sky-100 ring-opacity-55 rounded-2xl shadow-xl md:max-w-sm">
                <Image
                  src={quotePortrait}
                  alt="Santosh Ma in meditative reflection"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1280px) 320px, (min-width: 768px) 260px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-sky-800/20" />
              </div>
              <figure className="space-y-6">
                <blockquote className="relative overflow-hidden rounded-2xl bg-slate-100 bg-opacity-25 ring-1 ring-sky-100 ring-opacity-55 p-6 pl-14 text-lg font-medium leading-relaxed text-white shadow-lg backdrop-blur md:text-xl">
                  <span className="absolute left-5 top-5 text-5xl font-serif text-white/70">“</span>
                  <p className="text-white drop-shadow">
                    Today, I realise that my life has been touched by a love and a gentleness to a depth which no
                    individual can possibly match - as is given to me, in the course of the daily meditation by the
                    Kundalini force residing within my own being. I am aware that this feeling of being cherished must
                    emanate from the very Source itself.
                  </p>
                </blockquote>
                <figcaption className="pl-14">
                  <div className="text-lg font-semibold text-sky-200">Santosh Ma</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-300/90">Kundalini Diary</div>
                </figcaption>
              </figure>
            </div>
          </section>

        <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
          <LightboxImage
            src={seriesVisual}
            alt="Blue-hued guru guiding seeker with radiant blessings"
            title="Series Blessing Visual"
            description="A blessing visual introducing the Who Am I series, showing the guiding presence that supports seekers through each part of the journey."
            className="aspect-[4/4] overflow-hidden rounded-3xl border border-sky-200/60 text-left shadow-md hover:shadow-lg"
            imageClassName="object-cover object-bottom"
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 50vw, 100vw"
          />
          <div className="space-y-6">
            <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
              About The 'Who Am I' Series
            </h2>
            <ul className={`space-y-3 text-base leading-7 ${palette.muted}`}>
              {aboutBulletPoints.map((point, index) => {
                const isStringPoint = typeof point === 'string'
                return (
                  <li key={index} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-400" />
                    <div className="space-y-2">
                      <span className="text-sky-800">{isStringPoint ? point : point.text}</span>
                      {!isStringPoint && (
                        <ul className="ml-5 list-disc space-y-1 text-sky-700 font-bold">
                          {point.subPoints.map((subPoint, subIndex) => (
                            <li key={subIndex} className="leading-6">
                              {subPoint}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>



        <section className="space-y-8">
          <header className="space-y-2 text-center">
            <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
              Need of the Hour: Rapid Evolution of Human Consciousness
            </h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {needOfHour.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-white p-6 text-left shadow-sm"
              >
                <LightboxImage
                  src={item.visual.src}
                  alt={item.visual.alt}
                  title={item.title}
                  description={item.body}
                  className="aspect-[4/4] overflow-hidden rounded-2xl border border-sky-100/70 bg-sky-50 text-left hover:border-sky-200 hover:shadow-md"
                  imageClassName="object-cover"
                  sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
                />
                <div className="space-y-2">
                  <h3 className={`text-lg font-semibold ${headingClass}`}>{item.title}</h3>
                  <p className="text-base leading-7 text-sky-700">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-4">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            Dive Deep Into The Sacred Journey of <br /> Who Am I?
          </h2>
          <div className={`space-y-4 text-base leading-7 ${palette.muted}`}>
            <p>
              This is not another spiritual documentary - it's a rare transmission of profound inner truth,
              revealed through vivid, divinely inspired visuals and direct personal experiences.
            </p>
            <p>
              These visions received in deep meditation over five years, helps guide a seeker through the
              journey of spiritual evolution; a process never before shared in yogic literature with such
              clarity.
            </p>
            <p>
              These teachings awaken your inner knowledge. They depict how kundalini shakti purifies and
              activates the subtle body, transforming the human body, mind, and intellect for daily living.
            </p>
          </div>
        </div>
        <LightboxImage
          src={journeyVisual}
          alt="Blue guru guiding a seeker through inner light"
          title="Guided Inner Journey Visual"
          description="The journey visual illustrates how guidance from awakened masters supports seekers through layers of inner light."
          className="aspect-[2/2] w-full overflow-hidden rounded-3xl text-left"
          imageClassName="object-cover object-center"
          sizes="(min-width: 1280px) 640px, (min-width: 768px) 60vw, 100vw"
        />
      </section>

      <section className="space-y-8">
        <header className="text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            Awaken to the Truth Within
          </h2>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {awakenTruth.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <LightboxImage
                src={item.visual.src}
                alt={item.visual.alt}
                title={item.title}
                description={item.body}
                className="aspect-[4/4] overflow-hidden rounded-2xl border border-sky-100/80 bg-sky-50 text-left hover:border-sky-200 hover:shadow-md"
                imageClassName="object-cover"
                sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 100vw"
              />
              <h3 className={`text-lg font-semibold ${headingClass}`}>{item.title}</h3>
              <p className="text-base leading-7 text-sky-700">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 rounded-3xl bg-gradient-to-br from-blue-500 via-sky-700 to-sky-900 p-10 text-white shadow-lg">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
          <LightboxImage
            src={signatureVisual}
            alt="Radiant illustration of all chakras aligned through the subtle body"
            title="Signature Chakra Alignment"
            description="A signature artwork of all chakras illuminated, encapsulating the transformative energy held within the Who Am I transmission."
            className="aspect-[7/8] overflow-hidden rounded-3xl text-left"
            imageClassName="object-cover"
            sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
          />
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Why This Series is Unlike Anything You've Seen Before
            </h2>
            <ul className="space-y-3 text-base leading-7 text-blue-100">
              {whySeries.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-blue-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
        <div className="">
          <h2 className="text-2xl font-semibold text-amber-900 mb-4">Why You Must Watch This Now</h2>
          <ul className="space-y-2 text-base leading-7 text-amber-800">
            {whyNow.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <LightboxImage
          src={callToActionVisual}
          alt="Blue lotus inviting viewers into contemplative practice"
          title="Invitation to Contemplative Practice"
          description="A luminous lotus inviting seekers into stillness, mirroring the call to engage deeply with the wisdom of the series."
          className="aspect-[3/3] overflow-hidden rounded-3xl border border-amber-200 bg-amber-100/40 text-left shadow-lg hover:shadow-xl"
          imageClassName="object-cover"
          sizes="(min-width: 1280px) 440px, (min-width: 768px) 40vw, 100vw"
        />
      </section>

      <section className="space-y-8">
        <header className="text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            For Whom Is This Series?
          </h2>
          <p className={`text-base leading-7 ${palette.muted}`}>The course resonates most with:</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {audiences.map((audience) => {
            const iconName = audienceIconMap[audience.key]
            return (
              <div
                key={audience.key}
                className="flex items-start gap-4 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-100 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-sky-100 text-sky-600 shadow-inner">
                  <span className="material-symbols-rounded text-4xl scale-150">{iconName}</span>
                </div>
                <div className="space-y-1.5">
                  <h3
                    className={`text-base font-semibold uppercase tracking-[0.3em] ${headingClass}`}
                  >
                    {audience.label}
                  </h3>
                  <p className="text-sm leading-6 text-sky-600">{audience.copy}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-6">
        <header className="text-center">
          <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
            Who Am I Course Details
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {courses.map((course, index) => {
            const iconConfig = courseIconMap[course.slug]
            return (
            <Card
              key={course.slug}
              theme={course.slug === 'wai4' ? 'sahasrara' : ((course.theme as ThemeName) ?? HOME_THEME)}
              className={iconConfig?.cardClass}
              eyebrow={`Part ${String(index + 1).padStart(2, '0')}`}
              title={course.title}
              description={course.subtitle}
              leadingVisual={
                iconConfig ? (
                  <div
                    className={[
                      'inline-flex h-20 w-20 items-center justify-center rounded-2xl ring-4 ring-inset shadow-sm',
                      iconConfig.iconBg,
                      iconConfig.ring
                    ].join(' ')}
                  >
                    <Image
                      src={iconConfig.icon}
                      alt={`${course.title} icon`}
                      width={48}
                      height={48}
                      className="h-12 w-12"
                    />
                  </div>
                ) : undefined
              }
            >
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <ButtonLink href={`/${course.slug}`} theme={(course.theme as ThemeName) ?? HOME_THEME} size="sm">
                  Learn more
                </ButtonLink>
                {course.videoCount ? (
                  <span className="text-slate-500">{course.videoCount.toString().padStart(2, '0')} videos</span>
                ) : null}
              </div>
            </Card>
            )
          })}
        </div>
      </section>
        <section className="space-y-0 rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
          <header className="space-y-2">
            <h2 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>
              Your Journey of Discover Who Am I ; Liberation Through Seeing
            </h2>
            <p className={`text-base leading-7 text-sky-500`}>
              Move through each part with the spaciousness it deserves while staying rooted in consistent practice.
            </p>
          </header>
          <JourneyPricingTable
            schedule={journeySchedule}
            pacing={journeyPacing}
            reminders={journeyReminders}
          />
        </section>

      <section className="space-y-4 rounded-3xl bg-sky-50 p-8 text-base leading-7 text-slate-700 ring-1 ring-sky-100/80">
        <h3 className={`text-center text-2xl font-semibold ${headingClass}`}>Disclaimer</h3>
        <div className="space-y-4 text-sky-600">
          <p>
            The information contained in 'the books by the author' and the 'Who Am I' are not intended to serve as a
            replacement for professional medical advice. Any use of the information in the books and the courses is at
            the participants discretion. Author specifically disclaims any implied warranties of merchantability and
            fitness for a particular purpose and all liability arising directly or indirectly from the use or application
            of any information contained in the book or the various courses.
          </p>
          <p>
            The author does not recommend the self-management of health or mental health problems. You should never
            disregard medical advice, or delay in seeking it, because of something you have learned in this book or
            these courses. 'The Who Am I' are a structured self-study and self-development programme that shouldn't be
            taken lightly.
          </p>
        </div>
      </section>
      </div>
    </div>
    </>
  )
}
