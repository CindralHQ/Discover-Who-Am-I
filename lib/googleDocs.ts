type GoogleDocFormat = 'txt' | 'html'

export type GoogleDocContent = {
  content: string
  format: GoogleDocFormat
  sourceUrl: string
}

type FetchGoogleDocOptions = {
  documentId?: string | null
  format?: GoogleDocFormat
  revalidateSeconds?: number
}

function parseRevalidateSeconds(value: number | string | undefined) {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.floor(value)
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }
  return undefined
}

export async function fetchGoogleDocContent(options: FetchGoogleDocOptions = {}): Promise<GoogleDocContent | null> {
  const envDocumentId = process.env.GOOGLE_DOCS_ABOUT_ID?.trim()
  const documentId = options.documentId?.trim() ?? envDocumentId

  if (!documentId) {
    console.warn('[fetchGoogleDocContent] No Google Doc ID provided. Set GOOGLE_DOCS_ABOUT_ID or pass documentId.')
    return null
  }

  const envFormat = process.env.GOOGLE_DOCS_ABOUT_FORMAT === 'html' ? 'html' : 'txt'
  const format: GoogleDocFormat = options.format ?? envFormat

  const envRevalidate = parseRevalidateSeconds(process.env.GOOGLE_DOCS_ABOUT_REVALIDATE)
  const revalidateSeconds = parseRevalidateSeconds(options.revalidateSeconds) ?? envRevalidate ?? 900

  const exportUrl = new URL(`https://docs.google.com/document/d/${documentId}/export`)
  exportUrl.searchParams.set('format', format)

  try {
    const response = await fetch(exportUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: format === 'html' ? 'text/html' : 'text/plain; charset=utf-8'
      },
      next: {
        revalidate: revalidateSeconds
      }
    })

    if (!response.ok) {
      console.error(
        '[fetchGoogleDocContent] Failed to fetch Google Doc export.',
        response.status,
        response.statusText
      )
      return null
    }

    const content = await response.text()
    return {
      content: content.trim(),
      format,
      sourceUrl: `https://docs.google.com/document/d/${documentId}/view`
    }
  } catch (error) {
    console.error('[fetchGoogleDocContent] Unexpected error while fetching Google Doc content', error)
    return null
  }
}
