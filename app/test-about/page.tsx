import Link from 'next/link'

import homeLogo from '@/assets/Logo.png'
import { WaiIntroOverlay } from '@/components/ui/WaiIntroOverlay'
import { themeLibrary, ThemeName } from '@/lib/designSystem'
import { fetchGoogleDocContent } from '@/lib/googleDocs'

type ParsedDocImage = {
  src: string
  alt: string
}

type ParsedDocSection = {
  id: string
  html: string
  images: ParsedDocImage[]
  eyebrow?: string
  title?: string
  subtitle?: string
  bodyParagraphs: string[]
}

type DocSectionCopy = Pick<ParsedDocSection, 'eyebrow' | 'title' | 'subtitle' | 'bodyParagraphs'>

const TEST_ABOUT_THEME: ThemeName = 'twilight'

export const metadata = { title: 'About (Google Doc Test)' }

export default async function TestAboutPage() {
  const palette = themeLibrary[TEST_ABOUT_THEME].classes
  const headingClass = palette.card.title
  const doc = await fetchGoogleDocContent()
  const docSections = doc && doc.format === 'html' ? parseGoogleDocSections(doc.content) : []

  const paragraphs =
    doc && doc.format === 'txt'
      ? doc.content
          .split(/\r?\n\s*\r?\n/)
          .map((paragraph) => paragraph.replace(/\r?\n/g, ' ').trim())
          .filter(Boolean)
      : []

  return (
    <div className="space-y-12">
      <WaiIntroOverlay
        theme={TEST_ABOUT_THEME}
        icon={homeLogo}
        label="Google Doc Sync"
        size="hero"
        applyBodyTint={false}
      />

      <section className="space-y-4 rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">Live Draft</p>
          <h1 className={`text-3xl font-semibold tracking-tight ${headingClass}`}>About Copy via Google Doc</h1>
          <p className={`text-base leading-7 ${palette.muted}`}>
            The content below mirrors the latest text from the connected Google Doc. Refreshes occur automatically
            whenever the cache revalidates.
          </p>
        </header>

        {doc ? (
          doc.format === 'html' ? (
            docSections.length > 0 ? (
              <div className="space-y-8">
                {docSections.map((section, index) => (
                  <DocSectionBlock key={section.id} section={section} index={index} />
                ))}
              </div>
            ) : (
              <article className="doc-article">
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: sanitizeGoogleDocHtml(doc.content) }} />
              </article>
            )
          ) : (
            <article className="space-y-4 text-lg leading-8 text-indigo-800">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-6 text-indigo-700">
            <p className="font-semibold">No Google Doc configured yet.</p>
            <p className="mt-1 text-sm leading-6">
              Set <code className="font-mono text-indigo-900">GOOGLE_DOCS_ABOUT_ID</code> (and optional format/revalidate
              vars) to stream content directly from your document.
            </p>
          </div>
        )}

        <footer className="rounded-2xl bg-indigo-50/50 p-4 text-sm text-indigo-600 ring-1 ring-indigo-100/70">
          {doc ? (
            <span>
              Content is synced from{' '}
              <Link href={doc.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                this Google Doc
              </Link>
              . Updates appear after the configured revalidation window.
            </span>
          ) : (
            <span>
              Provide a Google Doc ID to preview remote copy here without redeploying the site.
            </span>
          )}
        </footer>
      </section>
    </div>
  )
}

function DocSectionBlock({ section, index }: { section: ParsedDocSection; index: number }) {
  const hasImages = section.images.length > 0
  const reverseLayout = hasImages && index % 2 === 1
  const hasStructuredCopy =
    Boolean(section.title || section.subtitle || section.eyebrow) || section.bodyParagraphs.length > 0

  const copyContent = hasStructuredCopy ? (
    <div className="space-y-4">
      {section.eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">{section.eyebrow}</p>
      ) : null}
      {section.title ? (
        <h2 className="text-3xl font-semibold tracking-tight text-indigo-900">{section.title}</h2>
      ) : null}
      {section.subtitle ? <p className="text-lg font-medium text-indigo-600">{section.subtitle}</p> : null}
      {section.bodyParagraphs.length > 0 ? (
        <div className="space-y-4 text-base leading-7 text-indigo-800">
          {section.bodyParagraphs.map((paragraph, paragraphIndex) => (
            <p key={`${section.id}-paragraph-${paragraphIndex}`}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </div>
  ) : (
    <article className="doc-article">
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: section.html }} />
    </article>
  )

  if (!hasImages) {
    return (
      <section className="rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm">
        {copyContent}
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm md:p-10">
      <div
        className={`flex flex-col gap-8 md:items-center ${
          reverseLayout ? 'md:flex-row-reverse' : 'md:flex-row'
        }`}
      >
        <div className="flex-1">
          {copyContent}
        </div>
        <div className="flex flex-1 flex-col gap-5">
          {section.images.map((image, imageIndex) => (
            <figure
              key={`${section.id}-image-${imageIndex}`}
              className="overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-auto w-full object-contain"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function parseGoogleDocSections(rawHtml: string): ParsedDocSection[] {
  const sanitized = sanitizeGoogleDocHtml(rawHtml)
  const rawSections = sanitized.split(/<hr[^>]*>/i)

  return rawSections
    .map((fragment, index) => {
      let workingHtml = fragment.trim()
      if (!workingHtml) return null

      const imageRegex = /<img[^>]*src="([^"]+)"[^>]*>/gi
      const images: ParsedDocImage[] = []
      const matches = [...workingHtml.matchAll(imageRegex)]

      matches.forEach((match, imageIndex) => {
        const src = decodeHtmlEntities(match[1])
        if (!src) return
        const altMatch = match[0].match(/alt="([^"]*)"/i)
        const altText = decodeHtmlEntities(altMatch?.[1] ?? '').trim()
        images.push({
          src,
          alt: altText && altText.length > 0 ? altText : `Section visual ${index + 1}-${imageIndex + 1}`
        })
        workingHtml = workingHtml.replace(match[0], '')
      })

      workingHtml = workingHtml
        .replace(/<span[^>]*>\s*<\/span>/gi, '')
        .replace(/<p[^>]*>(?:\s|&nbsp;)*<\/p>/gi, '')
        .replace(/&nbsp;/gi, ' ')
        .trim()

      if (!workingHtml && images.length === 0) return null

      const copy = extractSectionCopy(workingHtml)

      return {
        id: `doc-section-${index}`,
        html: workingHtml,
        images,
        ...copy
      }
    })
    .filter((section): section is ParsedDocSection => Boolean(section))
}

function sanitizeGoogleDocHtml(html: string) {
  return html
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<\/?(html|body)[^>]*>/gi, '')
    .trim()
}

function extractSectionCopy(html: string): DocSectionCopy {
  const blockRegex = /<(p|li)[^>]*>([\s\S]*?)<\/(p|li)>/gi
  const paragraphs: string[] = []
  let match: RegExpExecArray | null = null
  while ((match = blockRegex.exec(html)) !== null) {
    const blockType = match[1]?.toLowerCase()
    let text = decodeHtmlEntities(stripHtmlTags(match[2] ?? ''))
    text = normalizeSentenceSpacing(text)
    if (!text) continue
    if (blockType === 'li' && !text.startsWith('•')) {
      text = `• ${text}`
    }
    paragraphs.push(text)
  }

  const headingLines: string[] = []
  const bodyParagraphs: string[] = []
  let headingPhase = true
  for (const paragraph of paragraphs) {
    if (headingPhase && isHeadingCandidate(paragraph, headingLines.length)) {
      headingLines.push(paragraph)
      continue
    }
    headingPhase = false
    bodyParagraphs.push(paragraph)
  }

  if (headingLines.length === 0 && bodyParagraphs.length > 0) {
    headingLines.push(bodyParagraphs.shift() ?? '')
  }

  const headingMeta = classifyHeadingLines(headingLines.filter(Boolean))

  const normalizedBody = normalizeBodyParagraphs(bodyParagraphs)

  return {
    bodyParagraphs: normalizedBody,
    ...headingMeta
  }
}

function stripHtmlTags(input: string) {
  return input.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')
}

const NAMED_ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&bull;': '•'
}

function decodeHtmlEntities(input: string) {
  if (!input) return ''
  return input
    .replace(/&#(\d+);/g, (_, code) => {
      const parsed = Number.parseInt(code, 10)
      return Number.isFinite(parsed) ? String.fromCharCode(parsed) : _
    })
    .replace(/&#x([\da-f]+);/gi, (_, code) => {
      const parsed = Number.parseInt(code, 16)
      return Number.isFinite(parsed) ? String.fromCharCode(parsed) : _
    })
    .replace(/&[a-z]+;/gi, (entity) => NAMED_ENTITY_MAP[entity.toLowerCase()] ?? entity)
}

function normalizeSentenceSpacing(input: string) {
  return input
    .replace(/\s+/g, ' ')
    .replace(/\s+([,;:!?])/g, '$1')
    .replace(/([([])\s+/g, '$1')
    .replace(/\s+([)\]])/g, '$1')
    .trim()
}

function isHeadingCandidate(text: string, headingCount: number) {
  if (headingCount >= 3) return false
  if (text.length > 120) return false
  if (text.startsWith('•')) return false
  if (/^\d/.test(text)) return false
  return true
}

function classifyHeadingLines(lines: string[]): Pick<ParsedDocSection, 'eyebrow' | 'title' | 'subtitle'> {
  if (lines.length === 0) {
    return {}
  }
  const [first, second, ...rest] = lines
  const firstIsEyebrow = Boolean(second) && isEyebrowCandidate(first)

  if (firstIsEyebrow && second) {
    return {
      eyebrow: first,
      title: second,
      subtitle: rest.length > 0 ? rest.join(' • ') : undefined
    }
  }

  return {
    title: first,
    subtitle: [second, ...rest].filter(Boolean).join(' • ') || undefined
  }
}

function isEyebrowCandidate(value: string) {
  const trimmed = value.replace(/\s+/g, ' ').trim()
  const letters = trimmed.replace(/[^A-Za-z]/g, '')
  if (!letters) return false
  return trimmed === trimmed.toUpperCase()
}

function normalizeBodyParagraphs(paragraphs: string[]) {
  const result: string[] = []
  let buffer = ''

  const flushBuffer = () => {
    if (!buffer.trim()) {
      buffer = ''
      return
    }
    result.push(buffer.trim())
    buffer = ''
  }

  for (const paragraph of paragraphs) {
    const text = paragraph.trim()
    if (!text) {
      flushBuffer()
      continue
    }

    const isListItem = text.startsWith('•')
    if (isListItem) {
      flushBuffer()
      result.push(text)
      continue
    }

    buffer = buffer ? `${buffer} ${text}` : text
    if (shouldFlushParagraph(text)) {
      flushBuffer()
    }
  }

  flushBuffer()
  return result
}

function shouldFlushParagraph(text: string) {
  return /[.!?…]['")\]]?$/.test(text) || text.length > 200
}
