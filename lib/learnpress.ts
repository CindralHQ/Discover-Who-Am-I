type LearnPressEnvConfig = {
  siteUrl: string
  username?: string
  password?: string
}

export type LearnPressTokenResponse = {
  token?: string
  user_id?: string
  user_login?: string
  user_email?: string
  user_display_name?: string
  exp?: number
}

export type LearnPressCourse = {
  id: number
  name?: string
  title?: {
    rendered?: string
  }
  slug?: string
  status?: string
  link?: string
  content?: {
    rendered?: string
  }
  excerpt?: {
    rendered?: string
  }
  featured_image?: string | { full?: string; large?: string; thumbnail?: string }
  image?: { url?: string }
  price?: string
  regular_price?: string
  sale_price?: string
  _lp_price?: string
  _lp_sale_price?: string
  _lp_regular_price?: string
  curriculum?: LearnPressCurriculumSection[]
  _lp_curriculum?: LearnPressCurriculumSection[]
}

export type LearnPressCurriculumSection = {
  id: number | string
  title?: string
  items?: LearnPressCurriculumItem[]
}

export type LearnPressCurriculumItem = {
  id?: number | string
  item_id?: number | string
  title?: string
  name?: string
  type?: string
  item_type?: string
}

export type FetchLearnPressCoursesOptions = {
  perPage?: number
  page?: number
  search?: string
  learned?: boolean
  courseFilter?: 'in-progress' | 'passed' | 'failed'
  authToken?: string
}

export type FetchLearnPressCourseOptions = {
  authToken?: string
}

export type LearnPressLesson = {
  id: number
  title?: {
    rendered?: string
  }
  content?: {
    rendered?: string
  }
  status?: string
  type?: string
  duration?: string
}

export type LearnPressUserPayload = {
  id?: string
  login?: string
  email?: string
  displayName?: string
}

const TOKEN_CACHE_TTL_MS = 5 * 60 * 1000
export const LEARNPRESS_TOKEN_COOKIE = 'lp_token'
export const LEARNPRESS_USER_COOKIE = 'lp_user'

let cachedEnvToken: { token: string; expiresAt: number } | null = null

function normalizeBaseUrl(rawUrl: string) {
  return rawUrl.replace(/\/+$/, '')
}

function resolveLearnPressSiteUrl() {
  return (
    process.env.LP_SITE_URL?.trim() ??
    process.env.WC_STORE_URL?.trim() ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wordpress.discoverwhoami.com')
  )
}

export function getLearnPressEnvConfig(): Required<LearnPressEnvConfig> {
  const siteUrl = normalizeBaseUrl(resolveLearnPressSiteUrl())
  const username = process.env.LP_API_USERNAME?.trim()
  const password = process.env.LP_API_PASSWORD?.trim()

  if (!username || !password) {
    throw new Error('Missing LearnPress env variables: LP_API_USERNAME, LP_API_PASSWORD.')
  }

  return {
    siteUrl,
    username,
    password,
  }
}

export function getLearnPressSiteUrl() {
  const siteUrl = resolveLearnPressSiteUrl()
  return normalizeBaseUrl(siteUrl)
}

export function parseLearnPressUserCookie(value?: string | null): LearnPressUserPayload | null {
  if (!value) return null
  try {
    return JSON.parse(decodeURIComponent(value)) as LearnPressUserPayload
  } catch {
    return null
  }
}

async function requestLearnPressTokenRaw({
  siteUrl,
  username,
  password,
}: {
  siteUrl: string
  username: string
  password: string
}) {
  const url = new URL('/wp-json/learnpress/v1/token', `${siteUrl}/`)
  const body = new URLSearchParams({ username, password })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    const raw = await response.text()
    let parsedMessage: string | null = null
    let parsedCode: string | null = null
    try {
      const json = JSON.parse(raw)
      parsedMessage = typeof json.message === 'string' ? json.message : null
      parsedCode = typeof json.code === 'string' ? json.code : null
    } catch {
      parsedMessage = null
    }

    const cleanMessage = (parsedMessage ?? raw)
      .replace(/<[^>]*>?/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    const normalizedCode = parsedCode?.toLowerCase() ?? ''
    const friendly =
      normalizedCode.includes('incorrect_password') || normalizedCode.includes('invalid_username')
        ? 'Incorrect email or password. Please try again.'
        : normalizedCode.includes('invalid_email')
          ? 'The email address looks invalid.'
          : cleanMessage || 'Unable to sign in right now.'

    throw new Error(friendly)
  }

  const data = (await response.json()) as LearnPressTokenResponse
  if (!data.token) {
    throw new Error('LearnPress token response did not include a token value.')
  }

  return data
}

async function requestLearnPressTokenFromEnv(config: Required<LearnPressEnvConfig>) {
  if (cachedEnvToken && cachedEnvToken.expiresAt > Date.now()) {
    return cachedEnvToken.token
  }

  const data = await requestLearnPressTokenRaw({
    siteUrl: config.siteUrl,
    username: config.username,
    password: config.password,
  })

  cachedEnvToken = {
    token: data.token!,
    expiresAt: Date.now() + TOKEN_CACHE_TTL_MS,
  }

  return data.token!
}

export async function requestLearnPressUserToken({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const siteUrl = getLearnPressSiteUrl()
  return requestLearnPressTokenRaw({ siteUrl, username, password })
}

export async function fetchLearnPressCourses(
  options: FetchLearnPressCoursesOptions = {}
): Promise<LearnPressCourse[]> {
  const siteUrl = getLearnPressSiteUrl()
  let authToken = options.authToken
  if (!authToken) {
    const envConfig = getLearnPressEnvConfig()
    authToken = await requestLearnPressTokenFromEnv(envConfig as Required<LearnPressEnvConfig>)
  }

  const {
    perPage = 9,
    page = 1,
    search,
    learned,
    courseFilter,
  } = options

  const url = new URL('/wp-json/learnpress/v1/courses', `${siteUrl}/`)
  url.searchParams.set('per_page', perPage.toString())
  url.searchParams.set('page', page.toString())
  if (search) {
    url.searchParams.set('search', search)
  }
  if (learned) {
    url.searchParams.set('learned', 'true')
  }
  if (courseFilter) {
    url.searchParams.set('course_filter', courseFilter)
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`LearnPress course request failed (${response.status} ${response.statusText}): ${body.slice(0, 200)}`)
  }

  const data = (await response.json()) as LearnPressCourse[]
  return data
}

export async function fetchLearnPressCourse(
  courseId: number,
  options: FetchLearnPressCourseOptions = {}
): Promise<LearnPressCourse> {
  if (!courseId) {
    throw new Error('A valid LearnPress course ID is required.')
  }

  const siteUrl = getLearnPressSiteUrl()
  let authToken = options.authToken
  if (!authToken) {
    const envConfig = getLearnPressEnvConfig()
    authToken = await requestLearnPressTokenFromEnv(envConfig as Required<LearnPressEnvConfig>)
  }

  const url = new URL(`/wp-json/learnpress/v1/courses/${courseId}`, `${siteUrl}/`)
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
    next: { revalidate: 30 },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `LearnPress course detail request failed (${response.status} ${response.statusText}): ${body.slice(0, 200)}`
    )
  }

  return (await response.json()) as LearnPressCourse
}

export async function fetchLearnPressLesson(
  lessonId: number,
  options: FetchLearnPressCourseOptions = {}
): Promise<LearnPressLesson> {
  if (!lessonId) {
    throw new Error('A valid LearnPress lesson ID is required.')
  }

  const siteUrl = getLearnPressSiteUrl()
  let authToken = options.authToken
  if (!authToken) {
    const envConfig = getLearnPressEnvConfig()
    authToken = await requestLearnPressTokenFromEnv(envConfig as Required<LearnPressEnvConfig>)
  }

  const url = new URL(`/wp-json/learnpress/v1/lessons/${lessonId}`, `${siteUrl}/`)
  // use view context so enrolled users can access without edit capabilities
  url.searchParams.set('context', 'view')
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json',
    },
    next: { revalidate: 30 },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `LearnPress lesson request failed (${response.status} ${response.statusText}): ${body.slice(0, 200)}`
    )
  }

  return (await response.json()) as LearnPressLesson
}

export async function userHasCourseAccess(
  hints: string | string[],
  authToken: string
): Promise<boolean> {
  const normalizedHints = (Array.isArray(hints) ? hints : [hints]).map((hint) => hint.toLowerCase())
  if (normalizedHints.length === 0) return false

  const courses = await fetchLearnPressCourses({ perPage: 50, learned: true, authToken })
  return courses.some((course) => {
    const candidates = [
      course.slug,
      course.name,
      course.title?.rendered,
    ].filter(Boolean) as string[]

    return candidates.some((value) => {
      const lower = value.toLowerCase()
      return normalizedHints.some((hint) => lower.includes(hint))
    })
  })
}
