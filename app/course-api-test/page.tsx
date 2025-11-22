import Link from 'next/link'
import { cookies } from 'next/headers'

import { LearnPressLogoutButton } from '@/components/ui/LearnPressLogoutButton'
import {
  fetchLearnPressCourses,
  getLearnPressSiteUrl,
  LEARNPRESS_TOKEN_COOKIE,
  LEARNPRESS_USER_COOKIE,
  type LearnPressCourse,
} from '@/lib/learnpress'

export const metadata = {
  title: 'Course API Fetch Test',
}

export const dynamic = 'force-dynamic'

type LearnPressUserInfo = {
  id?: string
  login?: string
  email?: string
  displayName?: string
}

function parseUserInfo(value?: string): LearnPressUserInfo | null {
  if (!value) return null
  try {
    return JSON.parse(decodeURIComponent(value))
  } catch {
    return null
  }
}

function stripHtml(value?: string | null) {
  if (!value) return ''
  return value.replace(/<[^>]*>?/g, '').replace(/\s+/g, ' ').trim()
}

function getFeaturedImage(course: LearnPressCourse) {
  if (typeof course.featured_image === 'string') {
    return course.featured_image
  }
  return course.featured_image?.large ?? course.featured_image?.full ?? course.image?.url ?? null
}

function getCourseTitle(course: LearnPressCourse) {
  return course.title?.rendered ?? course.name ?? `Course #${course.id}`
}

function getCoursePrice(course: LearnPressCourse) {
  return (
    course.sale_price ??
    course._lp_sale_price ??
    course.price ??
    course._lp_price ??
    course.regular_price ??
    course._lp_regular_price ??
    'Price unavailable'
  )
}

export default async function CourseApiTestPage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  const userInfo = parseUserInfo(cookieStore.get(LEARNPRESS_USER_COOKIE)?.value)
  const siteUrl = getLearnPressSiteUrl()
  let courses: LearnPressCourse[] = []
  let errorMessage: string | null = null

  try {
    if (authToken) {
      courses = await fetchLearnPressCourses({ perPage: 9, authToken })
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Unable to fetch courses at the moment. Please try again soon.'
  }

  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Integration Test</p>
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-900">Course Inventory</h1>
        <p className="text-base leading-7 text-indigo-800">
          This route exercises the LMS REST API (<code className="font-mono text-indigo-900">/wp-json/learnpress/v1</code>)
          after signing in with your course credentials. Use it to make sure the backend responds before wiring the data into
          production components.
        </p>
        <ul className="text-sm leading-6 text-indigo-700">
          <li>
            • Set <code className="font-mono text-indigo-900">LP_SITE_URL</code> or{' '}
            <code className="font-mono text-indigo-900">WC_STORE_URL</code> so API requests know which course host to
            reach.
          </li>
          <li>
            • To view personalized data, visit{' '}
            <Link href="/course-login" className="text-indigo-600 underline">
              /course-login
            </Link>{' '}
            and sign in with your LMS username + password (or application password). The resulting JWT is stored in a
            secure cookie and used below.
          </li>
          <li>
            • Per the{' '}
            <a
              href="https://learnpresslms.com/docs/learnpress/rest-api/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 underline"
            >
              official REST docs
            </a>
            , the API exposes a JWT token endpoint at <code className="font-mono text-indigo-900">/token</code>; this
            page handles the exchange for you after login.
          </li>
        </ul>

        {authToken ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-emerald-800">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">Authenticated</p>
              <p className="text-base">
                Signed in as{' '}
                <span className="font-semibold">
                  {userInfo?.displayName ?? userInfo?.login ?? 'Learner'}
                </span>
              </p>
            </div>
            <LearnPressLogoutButton />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-indigo-800">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">Not signed in</p>
              <p className="text-base">Log in to fetch the courses attached to your profile.</p>
            </div>
            <Link
              href="/course-login"
              className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-white"
            >
              Go to Login
            </Link>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm">
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-rose-800">
            <p className="font-semibold">Request failed</p>
            <p className="mt-1 text-sm leading-6">{errorMessage}</p>
            <p className="mt-3 text-sm leading-6">
              Try logging in again at{' '}
              <Link href="/course-login" className="text-rose-700 underline">
                /course-login
              </Link>
              .
            </p>
          </div>
        ) : !authToken ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 p-6 text-indigo-700">
            <p className="font-semibold">Sign in required.</p>
            <p className="mt-1 text-sm leading-6">
              Visit{' '}
              <Link href="/course-login" className="text-indigo-600 underline">
                /course-login
              </Link>{' '}
              to generate a token for your course account.
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 p-6 text-indigo-700">
            <p className="font-semibold">No courses returned yet.</p>
            <p className="mt-1 text-sm leading-6">
              Add courses inside the LMS or relax the filters passed to{' '}
              <code className="font-mono text-indigo-900">fetchLearnPressCourses()</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-400">Results</p>
              <p className="text-lg text-indigo-800">
                Showing {courses.length} courses returned by <code className="font-mono text-indigo-900">/courses</code>.
              </p>
            </div>
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => {
                const hero = getFeaturedImage(course)
                const title = getCourseTitle(course)
                const summary =
                  stripHtml(course.excerpt?.rendered || course.content?.rendered) || 'No description available yet.'
                const price = getCoursePrice(course)
                const courseUrl = course.link ?? `${siteUrl}/course/${course.slug ?? course.id}`

                return (
                  <li
                    key={course.id}
                    className="flex flex-col rounded-2xl border border-indigo-100 bg-white/90 shadow-sm"
                  >
                    <div className="relative overflow-hidden rounded-t-2xl border-b border-indigo-50 bg-indigo-50">
                      {hero ? (
                        <img src={hero} alt={title} className="h-60 w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-60 items-center justify-center text-sm text-indigo-500">No image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col space-y-4 p-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-indigo-400">{course.status}</p>
                        <h2 className="text-xl font-semibold text-indigo-900">{title}</h2>
                      </div>
                      <p className="flex-1 text-sm leading-6 text-indigo-800">{summary}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-indigo-900">{price}</p>
                        <span className="text-xs uppercase tracking-[0.35em] text-indigo-400">#{course.id}</span>
                      </div>
                      <Link
                        href={courseUrl}
                        className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open in LMS ↗
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
