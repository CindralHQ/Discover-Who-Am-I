import { createSign } from 'crypto'

export type SheetTestimonial = {
  name: string
  title?: string
  testimonial: string
  photoUrl?: string
  designation?: string
  country?: string
}

export type CourseFeedbackRow = {
  courseId: number
  lessonId?: number
  lessonTitle?: string
  rating: number
  content: string
  userId?: string
  userEmail?: string
  userName?: string
}

export type DriveVideoTestimonial = {
  id: string
  title: string
  description?: string
  embedUrl: string
  thumbnailUrl?: string
  durationSeconds?: number
}

function hasPermission(value: string | undefined) {
  if (!value) return false
  const normalised = value.trim().toLowerCase()
  return ['yes', 'y', 'true', '1', 'approved', 'permission granted'].includes(normalised)
}

function asString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim()
  }
  if (Array.isArray(value) && value.length > 0) {
    const candidate = value[0]
    if (typeof candidate === 'string') {
      return candidate.trim()
    }
  }
  if (typeof value === 'number') {
    return String(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  return undefined
}

type SheetValuesResponse = {
  values?: Array<string[]>
}

type SheetMetadataResponse = {
  sheets?: Array<{
    properties?: {
      title?: string
      hidden?: boolean
      gridProperties?: {
        columnCount?: number
      }
    }
  }>
}

const DRIVE_THUMBNAIL_SIZE =
  process.env.GOOGLE_SHEETS_DRIVE_THUMBNAIL_SIZE ?? 'w1000'

const driveImageCache = new Map<string, string>()

function quoteSheetTitle(title: string) {
  const escaped = title.replace(/'/g, "''").trim()
  return `'${escaped}'`
}

function columnIndexToLetter(index: number) {
  if (!index || index <= 0) return 'Z'
  let value = index
  let result = ''
  while (value > 0) {
    const remainder = (value - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    value = Math.floor((value - 1) / 26)
  }
  return result
}

function buildUrl(base: string, query: URLSearchParams) {
  const queryString = query.toString()
  return queryString.length > 0 ? `${base}?${queryString}` : base
}

function buildDriveThumbnailUrl(fileId: string, resourceKey?: string | null) {
  const directUrl = new URL('https://drive.google.com/thumbnail')
  directUrl.searchParams.set('id', fileId)
  directUrl.searchParams.set('sz', DRIVE_THUMBNAIL_SIZE)
  if (resourceKey) {
    directUrl.searchParams.set('resourcekey', resourceKey)
  }
  return directUrl.toString()
}

function buildDrivePreviewUrl(fileId: string, resourceKey?: string | null) {
  const previewUrl = new URL(`https://drive.google.com/file/d/${fileId}/preview`)
  if (resourceKey) {
    previewUrl.searchParams.set('resourcekey', resourceKey)
  }
  return previewUrl.toString()
}

async function getServiceAccountAccessToken(email: string, privateKey: string, scopes: string[]) {
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }
  const claimSet = {
    iss: email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3500,
    iat: now
  }

  const base64Url = (input: Buffer | string) => {
    const source = typeof input === 'string' ? Buffer.from(input) : Buffer.from(input)
    return source
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  const headerSegment = base64Url(JSON.stringify(header))
  const claimSegment = base64Url(JSON.stringify(claimSet))
  const unsignedToken = `${headerSegment}.${claimSegment}`

  try {
    const signer = createSign('RSA-SHA256')
    signer.update(unsignedToken)
    signer.end()
    const signature = signer.sign(privateKey)
    const signedToken = `${unsignedToken}.${base64Url(signature)}`

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedToken
      }).toString()
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error(
        '[fetchTestimonials] Failed to exchange service account JWT for an access token',
        response.status,
        response.statusText,
        errorText
      )
      return undefined
    }

    const payload = (await response.json()) as { access_token?: string }
    if (!payload.access_token) {
      console.error('[fetchTestimonials] Service account token response missing access_token field.')
      return undefined
    }

    return payload.access_token
  } catch (error) {
    console.error('[fetchTestimonials] Error while generating service account token', error)
    return undefined
  }
}

function indexForHeader(headers: string[], target: string) {
  const normalisedTarget = target.trim().toLowerCase()
  return headers.findIndex((header) => header.trim().toLowerCase() === normalisedTarget)
}

function findHeaderIndex(headers: string[], ...candidates: Array<string | undefined>) {
  for (const candidate of candidates) {
    if (!candidate) continue
    const index = indexForHeader(headers, candidate)
    if (index !== -1) {
      return index
    }
  }
  return -1
}

async function fetchDriveImageAsDataUrl(fileId: string, resourceKey: string | undefined, accessToken: string) {
  const cacheKey = `${fileId}::${resourceKey ?? ''}`
  const cached = driveImageCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const fileUrl = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`)
  fileUrl.searchParams.set('alt', 'media')
  fileUrl.searchParams.set('supportsAllDrives', 'true')
  if (resourceKey) {
    fileUrl.searchParams.set('resourceKey', resourceKey)
  }

  try {
    const response = await fetch(fileUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      next: { revalidate: 600 }
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.warn(
        '[fetchTestimonials] Unable to download Drive image',
        fileId,
        response.status,
        response.statusText,
        errorText
      )
      return undefined
    }

    const contentType = response.headers.get('content-type') ?? 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${contentType};base64,${base64}`
    driveImageCache.set(cacheKey, dataUrl)
    return dataUrl
  } catch (error) {
    console.error('[fetchTestimonials] Error downloading Drive image', fileId, error)
    return undefined
  }
}

async function resolveRange({
  configuredRange,
  spreadsheetId,
  requestHeaders,
  query
}: {
  configuredRange?: string
  spreadsheetId: string
  requestHeaders: Record<string, string>
  query: URLSearchParams
}) {
  if (configuredRange && configuredRange.trim().length > 0) {
    let range = configuredRange.trim()
    if (range.includes('!')) {
      const separatorIndex = range.indexOf('!')
      const sheetPart = range.slice(0, separatorIndex).trim()
      const cellPart = range.slice(separatorIndex + 1)
      const shouldQuote = /[\s!,:]/.test(sheetPart) && !/^'.*'$/.test(sheetPart)
      const safeSheet = shouldQuote ? quoteSheetTitle(sheetPart) : sheetPart
      range = `${safeSheet}!${cellPart}`
    } else if (/[\s!,:]/.test(range) && !/^'.*'$/.test(range)) {
      range = quoteSheetTitle(range)
    }
    return range
  }

  console.info('[fetchTestimonials] No range provided; deriving range from first visible sheet.')

  try {
    const metadataUrl = buildUrl(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      query
    )
    const response = await fetch(metadataUrl, { headers: requestHeaders })
    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error(
        '[fetchTestimonials] Failed to load sheet metadata',
        response.status,
        response.statusText,
        errorText
      )
      return null
    }
    const metadata = (await response.json()) as SheetMetadataResponse
    const firstVisibleSheet = metadata.sheets?.find(
      (sheet) => sheet?.properties?.hidden !== true
    )
    const title = firstVisibleSheet?.properties?.title
    if (!title) {
      console.error(
        '[fetchTestimonials] Unable to determine a sheet title. Provide GOOGLE_SHEETS_TESTIMONIAL_RANGE explicitly.'
      )
      return null
    }
    const columnCount =
      firstVisibleSheet?.properties?.gridProperties?.columnCount ?? 26
    const columnLetter = columnIndexToLetter(columnCount)
    const derivedRange = `${quoteSheetTitle(title)}!A:${columnLetter}`
    console.info(
      '[fetchTestimonials] Derived range from sheet metadata',
      JSON.stringify({
        sheetTitle: title,
        columnCount,
        derivedRange
      })
    )
    return derivedRange
  } catch (error) {
    console.error('[fetchTestimonials] Error while deriving range from metadata', error)
    return null
  }
}

type NormalisePhotoOptions = {
  accessToken?: string
}

async function normalisePhotoUrl(value: string | undefined, options: NormalisePhotoOptions = {}) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined

  try {
    const url = new URL(trimmed)
    const hostname = url.hostname.toLowerCase()

    if (hostname.includes('drive.google.com')) {
      const resourceKey = url.searchParams.get('resourcekey') ?? undefined
      const fileIdMatch = url.pathname.match(/\/d\/([^/]+)/)
      const fileId = fileIdMatch?.[1] ?? url.searchParams.get('id') ?? undefined
      if (fileId) {
        if (options.accessToken) {
          const dataUrl = await fetchDriveImageAsDataUrl(fileId, resourceKey, options.accessToken)
          if (dataUrl) {
            return dataUrl
          }
        }
        return buildDriveThumbnailUrl(fileId, resourceKey)
      }
    }

    if (hostname === 'drive.googleusercontent.com') {
      const fileId = url.searchParams.get('id')
      const resourceKey = url.searchParams.get('resourcekey')
      if (fileId && options.accessToken) {
        const dataUrl = await fetchDriveImageAsDataUrl(fileId, resourceKey ?? undefined, options.accessToken)
        if (dataUrl) {
          return dataUrl
        }
      }
      if (fileId) {
        return buildDriveThumbnailUrl(fileId, resourceKey ?? undefined)
      }
      return trimmed
    }
  } catch {
    return trimmed
  }

  return trimmed
}

type DriveFileListingResponse = {
  files?: Array<{
    id?: string
    name?: string
    description?: string
    resourceKey?: string
    thumbnailLink?: string
    webViewLink?: string
    videoMediaMetadata?: {
      durationMillis?: string
      width?: number
      height?: number
    }
  }>
}

export async function fetchVideoTestimonials(): Promise<DriveVideoTestimonial[]> {
  const folderId = process.env.GOOGLE_DRIVE_TESTIMONIAL_FOLDER_ID?.trim()
  if (!folderId) {
    console.info('[fetchVideoTestimonials] No Google Drive folder configured; skipping fetch.')
    return []
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawServiceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const serviceAccountKey = rawServiceAccountKey ? rawServiceAccountKey.replace(/\\n/g, '\n') : undefined
  const driveApiKey = process.env.GOOGLE_DRIVE_API_KEY ?? process.env.GOOGLE_SHEETS_API_KEY
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json'
  }
  const query = new URLSearchParams({
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true'
  })

  const sanitizedFolderId = folderId.replace(/['"]/g, '')
  const escapedFolderId = sanitizedFolderId.replace(/'/g, "\\'")
  query.set(
    'q',
    `'${escapedFolderId}' in parents and mimeType contains 'video/' and trashed = false`
  )
  query.set(
    'fields',
    'files(id,name,description,resourceKey,thumbnailLink,webViewLink,videoMediaMetadata(durationMillis,width,height))'
  )

  const orderBy = process.env.GOOGLE_DRIVE_TESTIMONIAL_ORDER ?? 'createdTime desc'
  if (orderBy && orderBy.trim().length > 0) {
    query.set('orderBy', orderBy)
  }

  const rawMaxResults =
    process.env.GOOGLE_DRIVE_TESTIMONIAL_MAX_RESULTS ?? process.env.GOOGLE_DRIVE_TESTIMONIAL_LIMIT
  if (rawMaxResults) {
    const parsed = Number.parseInt(rawMaxResults, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      query.set('pageSize', String(Math.min(parsed, 50)))
    }
  }

  let serviceAccountToken: string | undefined

  if (serviceAccountEmail && serviceAccountKey) {
    const scopes = ['https://www.googleapis.com/auth/drive.readonly']
    serviceAccountToken = await getServiceAccountAccessToken(
      serviceAccountEmail,
      serviceAccountKey,
      scopes
    )
    if (!serviceAccountToken) {
      return []
    }
    requestHeaders.Authorization = `Bearer ${serviceAccountToken}`
  } else if (driveApiKey) {
    query.set('key', driveApiKey)
  } else {
    console.error(
      '[fetchVideoTestimonials] Missing Drive credentials. Provide GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY or GOOGLE_DRIVE_API_KEY (public folders only).'
    )
    return []
  }

  const endpoint = buildUrl('https://www.googleapis.com/drive/v3/files', query)
  const revalidateSeconds = Number.parseInt(
    process.env.GOOGLE_DRIVE_TESTIMONIAL_REVALIDATE ?? '600',
    10
  )

  console.info(
    '[fetchVideoTestimonials] Starting fetch',
    JSON.stringify({
      usingServiceAccount: Boolean(serviceAccountToken),
      folderId: `${sanitizedFolderId.slice(0, 4)}…`,
      orderBy,
      pageSize: query.get('pageSize') ?? 'default'
    })
  )

  try {
    const response = await fetch(endpoint, {
      headers: requestHeaders,
      next: { revalidate: Number.isFinite(revalidateSeconds) ? Math.max(revalidateSeconds, 60) : 600 }
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error(
        '[fetchVideoTestimonials] Google Drive request failed',
        response.status,
        response.statusText,
        errorText
      )
      return []
    }

    const payload = (await response.json()) as DriveFileListingResponse
    const files = Array.isArray(payload.files) ? payload.files : []

    if (files.length === 0) {
      console.warn(
        '[fetchVideoTestimonials] No video files were returned. Check folder permissions and file types.'
      )
      return []
    }

    const mapped = files
      .map((file): DriveVideoTestimonial | null => {
        const id = file.id?.trim()
        if (!id) {
          return null
        }

        const resourceKey = file.resourceKey ?? undefined
        const fallbackThumbnail = buildDriveThumbnailUrl(id, resourceKey)
        const embedUrl = buildDrivePreviewUrl(id, resourceKey)
        const durationMillis = file.videoMediaMetadata?.durationMillis
        let durationSeconds: number | undefined
        if (typeof durationMillis === 'string') {
          const parsedDuration = Number(durationMillis)
          if (Number.isFinite(parsedDuration) && parsedDuration > 0) {
            durationSeconds = Math.round(parsedDuration / 1000)
          }
        }

        return {
          id,
          title: file.name?.trim() ?? 'Video Testimonial',
          description: file.description?.trim() || undefined,
          embedUrl,
          thumbnailUrl: file.thumbnailLink ?? fallbackThumbnail,
          durationSeconds
        }
      })
      .filter((entry): entry is DriveVideoTestimonial => entry !== null)

    console.info(
      '[fetchVideoTestimonials] Loaded videos',
      JSON.stringify({ count: mapped.length })
    )

    return mapped
  } catch (error) {
    console.error('[fetchVideoTestimonials] Unexpected error while querying Google Drive', error)
    return []
  }
}

export async function fetchTestimonials(): Promise<SheetTestimonial[]> {
  let apiKey = process.env.GOOGLE_SHEETS_API_KEY

  if (apiKey && apiKey.includes('PRIVATE KEY')) {
    console.error(
      '[fetchTestimonials] The value in GOOGLE_SHEETS_API_KEY appears to be a service-account private key. Move it to GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY and keep GOOGLE_SHEETS_API_KEY for public API keys only.'
    )
    apiKey = undefined
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_TESTIMONIAL_SPREADSHEET_ID
  const configuredRange = process.env.GOOGLE_SHEETS_TESTIMONIAL_RANGE
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawServiceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const serviceAccountKey = rawServiceAccountKey ? rawServiceAccountKey.replace(/\\n/g, '\n') : undefined
  const useServiceAccount = Boolean(serviceAccountEmail && serviceAccountKey)
  let serviceAccountToken: string | undefined

  if ((!apiKey && !useServiceAccount) || !spreadsheetId) {
    console.error(
      '[fetchTestimonials] Missing spreadsheet ID or credentials. Set GOOGLE_SHEETS_TESTIMONIAL_SPREADSHEET_ID and either GOOGLE_SHEETS_API_KEY (for public sheets) or GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (for private sheets).'
    )
    return []
  }

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json'
  }
  const query = new URLSearchParams()

  if (useServiceAccount && serviceAccountEmail && serviceAccountKey) {
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ]
    serviceAccountToken = await getServiceAccountAccessToken(serviceAccountEmail, serviceAccountKey, scopes)
    if (!serviceAccountToken) {
      return []
    }
    requestHeaders.Authorization = `Bearer ${serviceAccountToken}`
  } else if (apiKey) {
    query.set('key', apiKey)
  }

  const range = await resolveRange({
    configuredRange,
    spreadsheetId,
    requestHeaders,
    query
  })

  if (!range) {
    return []
  }

  console.info(
    '[fetchTestimonials] Starting fetch',
    JSON.stringify({
      hasApiKey: Boolean(apiKey),
      useServiceAccount,
      spreadsheetId: spreadsheetId ? `${spreadsheetId.slice(0, 4)}…` : 'missing',
      range
    })
  )

  const endpoint = buildUrl(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    query
  )

  let payload: SheetValuesResponse

  try {
    const response = await fetch(endpoint, {
      headers: requestHeaders,
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error(
        '[fetchTestimonials] Google Sheets request failed',
        response.status,
        response.statusText,
        errorText
      )
      return []
    }

    payload = (await response.json()) as SheetValuesResponse
  } catch (error) {
    console.error('[fetchTestimonials] Unexpected error while fetching Google Sheets data', error)
    return []
  }

  const values = Array.isArray(payload.values) ? payload.values : []
  if (values.length === 0) {
    console.warn('[fetchTestimonials] Google Sheets returned no values. Check sheet data and filters.')
    return []
  }

  const [rawHeaders, ...rows] = values
  const headers = rawHeaders.map((header) => header.trim())

  const nameHeader = process.env.GOOGLE_SHEETS_NAME_HEADER ?? 'Name'
  const titleHeader = process.env.GOOGLE_SHEETS_TITLE_HEADER ?? 'Title'
  const testimonialHeader = process.env.GOOGLE_SHEETS_TESTIMONIAL_HEADER ?? 'Testimonial'
  const permissionHeader = process.env.GOOGLE_SHEETS_PERMISSION_HEADER ?? 'Permission'
  const adminPermissionHeader = process.env.GOOGLE_SHEETS_ADMIN_PERMISSION_HEADER ?? 'Admin Permission'
  const photoHeader = process.env.GOOGLE_SHEETS_PHOTO_HEADER ?? 'Photo'
  const designationHeader = process.env.GOOGLE_SHEETS_DESIGNATION_HEADER ?? 'Designation'
  const countryHeader = process.env.GOOGLE_SHEETS_COUNTRY_HEADER ?? 'Country'

  const nameIndex = findHeaderIndex(headers, nameHeader, 'Your Name', 'Full Name')
  const titleIndex = findHeaderIndex(headers, titleHeader, 'Story Title', 'Headline')
  const testimonialIndex = findHeaderIndex(
    headers,
    testimonialHeader,
    'Your Testimonial',
    'Feedback',
    'Story'
  )
  const permissionIndex = findHeaderIndex(
    headers,
    permissionHeader,
    'Permission to showcase on website',
    'Permission to showcase on Website',
    'Permission Granted'
  )
  const adminPermissionIndex = findHeaderIndex(
    headers,
    adminPermissionHeader,
    'Admin Permission',
    'Admin Approval'
  )
  const photoIndex = findHeaderIndex(
    headers,
    photoHeader,
    'Upload your profile picture',
    'Profile Picture',
    'Photo URL'
  )
  const designationIndex = findHeaderIndex(
    headers,
    designationHeader,
    'Role',
    titleIndex === -1 ? 'Title' : undefined
  )
  const countryIndex = findHeaderIndex(
    headers,
    countryHeader,
    'Location',
    'Country/Region'
  )

  console.info(
    '[fetchTestimonials] Header indices',
    JSON.stringify({
      nameIndex,
      titleIndex,
      testimonialIndex,
      permissionIndex,
      adminPermissionIndex,
      photoIndex,
      designationIndex,
      countryIndex
    })
  )

  if (testimonialIndex === -1) {
    console.error(
      `[fetchTestimonials] Unable to locate the testimonial header "${testimonialHeader}". Verify the sheet headers or update GOOGLE_SHEETS_TESTIMONIAL_HEADER.`
    )
    return []
  }

  const entries = await Promise.all(
    rows.map(async (row): Promise<SheetTestimonial | null> => {
      const testimonialCell = row[testimonialIndex]
      const testimonial = asString(testimonialCell) ?? ''
      if (!testimonial) {
        return null
      }

      const permissionValue = permissionIndex >= 0 ? asString(row[permissionIndex]) : 'yes'
      const adminPermissionValue =
        adminPermissionIndex >= 0 ? asString(row[adminPermissionIndex]) : 'yes'
      if (!hasPermission(permissionValue) || !hasPermission(adminPermissionValue)) {
        return null
      }

      const nameValue = nameIndex >= 0 ? asString(row[nameIndex]) : undefined
      const titleValue = titleIndex >= 0 ? asString(row[titleIndex]) : undefined
      const photoValue = photoIndex >= 0 ? asString(row[photoIndex]) : undefined
      const designationValue = designationIndex >= 0 ? asString(row[designationIndex]) : undefined
      const countryValue = countryIndex >= 0 ? asString(row[countryIndex]) : undefined

      const photoUrl = await normalisePhotoUrl(photoValue, { accessToken: serviceAccountToken })

      const testimonialEntry: SheetTestimonial = {
        name: nameValue && nameValue.length > 0 ? nameValue : 'Anonymous Seeker',
        title: titleValue && titleValue.length > 0 ? titleValue : undefined,
        testimonial,
        photoUrl,
        designation: designationValue && designationValue.length > 0 ? designationValue : undefined,
        country: countryValue && countryValue.length > 0 ? countryValue : undefined
      }
      return testimonialEntry
    })
  )

  const filtered = entries.filter(
    (entry): entry is SheetTestimonial =>
      entry !== null
  )

  if (filtered.length === 0) {
    console.warn(
      '[fetchTestimonials] No testimonials passed the permission filter. Check the Permission column values.'
    )
  } else {
    console.info(
      '[fetchTestimonials] Loaded testimonials',
      JSON.stringify({ count: filtered.length })
    )
  }

  return filtered
}

export async function appendCourseFeedbackRow(row: CourseFeedbackRow) {
  const spreadsheetId = process.env.COURSE_FEEDBACK_SHEET_ID
  if (!spreadsheetId) {
    throw new Error('COURSE_FEEDBACK_SHEET_ID is not configured.')
  }

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!serviceAccountEmail || !rawKey) {
    throw new Error('Google service-account credentials are required to store course feedback.')
  }
  const serviceAccountKey = rawKey.replace(/\\n/g, '\n')

  const token = await getServiceAccountAccessToken(serviceAccountEmail, serviceAccountKey, [
    'https://www.googleapis.com/auth/spreadsheets'
  ])

  if (!token) {
    throw new Error('Unable to obtain Google Sheets access token.')
  }

  const range = process.env.COURSE_FEEDBACK_SHEET_RANGE ?? 'Sheet1!A1'
  const endpoint = new URL(
    `/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append`,
    'https://sheets.googleapis.com'
  )
  endpoint.searchParams.set('valueInputOption', 'RAW')
  endpoint.searchParams.set('insertDataOption', 'INSERT_ROWS')

  const values = [
    [
      new Date().toISOString(),
      row.courseId ?? '',
      row.lessonId ?? '',
      row.lessonTitle ?? '',
      row.rating ?? '',
      row.content ?? '',
      row.userId ?? '',
      row.userEmail ?? '',
      row.userName ?? '',
    ]
  ]

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  })

  if (!response.ok) {
    const details = await response.text().catch(() => '')
    throw new Error(
      `Failed to append course feedback (${response.status} ${response.statusText}): ${details.slice(0, 200)}`
    )
  }
}
