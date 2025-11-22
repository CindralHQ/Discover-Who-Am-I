import homeLogo from '@/assets/Logo.png'
import { WaiIntroOverlay } from '@/components/ui/WaiIntroOverlay'
import { ThemeName } from '@/lib/designSystem'
import { fetchGoogleDocContent } from '@/lib/googleDocs'

type ParsedDocImage = {
  src: string
  alt: string
}

type DocBodyParagraph = {
  id: string
  html: string
  isListItem?: boolean
}

type ParsedDocSection = {
  id: string
  html: string
  images: ParsedDocImage[]
  eyebrow?: string
  title?: string
  subtitle?: string
  bodyParagraphs: DocBodyParagraph[]
}

type DocSectionCopy = Pick<ParsedDocSection, 'eyebrow' | 'title' | 'subtitle' | 'bodyParagraphs'>

const ABOUT_THEME: ThemeName = 'twilight'

export const metadata = { title: 'About - Who Am I' }

export default async function AboutPage() {
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
        theme={ABOUT_THEME}
        icon={homeLogo}
        label="Discover Who Am I"
        size="hero"
        applyBodyTint={false}
      />

      <section className="space-y-4 rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm">

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
    <div className="space-y-3">
      {section.eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">{section.eyebrow}</p>
      ) : null}
      {section.title ? (
        <h2 className="text-3xl font-semibold tracking-tight text-indigo-900">{section.title}</h2>
      ) : null}
      {section.subtitle ? (
        <div
          className="text-xl font-semibold leading-tight text-indigo-900"
          dangerouslySetInnerHTML={{ __html: section.subtitle }}
        />
      ) : null}
      {section.bodyParagraphs.length > 0 ? (
        <div className="space-y-2 text-base leading-6 text-indigo-800">
          {section.bodyParagraphs.map((paragraph) =>
            paragraph.isListItem ? (
              <div key={`${section.id}-${paragraph.id}`} className="flex gap-2 text-base leading-6">
                <span className="mt-2 h-2 w-2 rounded-full bg-indigo-400" />
                <p className="leading-6" dangerouslySetInnerHTML={{ __html: paragraph.html }} />
              </div>
            ) : (
              <p
                key={`${section.id}-${paragraph.id}`}
                className="leading-6"
                dangerouslySetInnerHTML={{ __html: paragraph.html }}
              />
            )
          )}
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
                className="h-auto w-full max-h-64 object-contain md:max-h-72 lg:max-h-80"
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

type ParagraphContent = {
  text: string
  html: string
  isListItem: boolean
  tagName: string
}

function extractSectionCopy(html: string): DocSectionCopy {
  const blockRegex = /<(p|li|h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi
  const paragraphs: ParagraphContent[] = []
  let match: RegExpExecArray | null = null
  while ((match = blockRegex.exec(html)) !== null) {
    const blockType = match[1]?.toLowerCase() ?? ''
    const inlineHtml = sanitizeInlineHtml(match[2] ?? '')
    let text = decodeHtmlEntities(stripHtmlTags(inlineHtml))
    text = normalizeSentenceSpacing(text)
    if (!text) continue
    const isListItem = blockType === 'li'
    paragraphs.push({
      text,
      html: inlineHtml,
      isListItem,
      tagName: blockType
    })
  }

  const headingLines: ParagraphContent[] = []
  const bodyParagraphs: ParagraphContent[] = []
  let headingPhase = true
  for (const paragraph of paragraphs) {
    if (headingPhase && isHeadingCandidate(paragraph, headingLines)) {
      headingLines.push(paragraph)
      continue
    }
    headingPhase = false
    bodyParagraphs.push(paragraph)
  }

  if (headingLines.length === 0 && bodyParagraphs.length > 0) {
    headingLines.push(
      bodyParagraphs.shift() ?? { text: '', html: '', isListItem: false, tagName: 'p' }
    )
  }

  const headingMeta = classifyHeadingLines(headingLines.filter((line) => Boolean(line.text)))

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

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

function isHeadingCandidate(paragraph: ParagraphContent, headingLines: ParagraphContent[]) {
  const headingCount = headingLines.length
  if (headingCount >= 3) return false
  const headingTagCount = headingLines.filter((line) => HEADING_TAGS.has(line.tagName)).length
  const hasHeadingTag = headingTagCount > 0
  const isHeadingTag = HEADING_TAGS.has(paragraph.tagName)

  if (isHeadingTag) return true

  if (hasHeadingTag) {
    return false
  }

  const text = paragraph.text
  if (text.length > 120) return false
  if (text.startsWith('•')) return false
  if (/^\d/.test(text)) return false
  return true
}

function classifyHeadingLines(lines: ParagraphContent[]): Pick<ParsedDocSection, 'eyebrow' | 'title' | 'subtitle'> {
  if (lines.length === 0) {
    return {}
  }
  const [first, second, ...rest] = lines
  const firstIsEyebrow = Boolean(second) && isEyebrowCandidate(first.text)

  if (firstIsEyebrow && second) {
    return {
      eyebrow: first.text,
      title: second.text,
      subtitle: rest.length > 0 ? rest.map((line) => line.html).join('<br />') : undefined
    }
  }

  return {
    title: first.text,
    subtitle:
      [second, ...rest]
        .map((line) => line?.html ?? '')
        .filter(Boolean)
        .join('<br />') || undefined
  }
}

function isEyebrowCandidate(value: string) {
  const trimmed = value.replace(/\s+/g, ' ').trim()
  const letters = trimmed.replace(/[^A-Za-z]/g, '')
  if (!letters) return false
  return trimmed === trimmed.toUpperCase()
}

function normalizeBodyParagraphs(paragraphs: ParagraphContent[]): DocBodyParagraph[] {
  return paragraphs.map((paragraph, index) => ({
    id: `body-paragraph-${index}`,
    html: paragraph.html,
    isListItem: paragraph.isListItem
  }))
}

function sanitizeInlineHtml(input: string, allowLinks = true): string {
  if (!input) return ''
  let output = input
  output = output.replace(/<br\s*\/?>/gi, '<br />')
  output = output.replace(/<\/?(span|font|div|section|article|style)[^>]*>/gi, '')

  if (allowLinks) {
    output = output.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_, attrs, inner) => {
      const hrefMatch = attrs.match(/href=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)
      const href = hrefMatch ? hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '' : ''
      const safeHref = sanitizeUrl(decodeHtmlEntities(href))
      const sanitizedInner = sanitizeInlineHtml(inner, false)
      if (!safeHref) {
        return sanitizedInner
      }
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${sanitizedInner}</a>`
    })
  }

  output = output.replace(/<(strong|b|em|i|u|sub|sup|code)\b[^>]*>/gi, '<$1>')
  output = output.replace(/<\/(strong|b|em|i|u|sub|sup|code)>/gi, '</$1>')
  output = output.replace(/<\/?(?!strong|b|em|i|u|sub|sup|code|br|a\b)[a-z][^>]*>/gi, '')

  return output.trim()
}

function sanitizeUrl(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^(https?:|mailto:)/i.test(trimmed)) {
    return trimmed
  }
  return ''
}
