import Link from 'next/link'
import { cookies } from 'next/headers'

import { LearnPressLogoutButton } from '@/components/ui/LearnPressLogoutButton'
import {
  fetchLearnPressCourses,
  LEARNPRESS_TOKEN_COOKIE,
  LEARNPRESS_USER_COOKIE,
  type LearnPressCourse,
} from '@/lib/learnpress'

export const metadata = {
  title: 'My Courses',
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

function getCourseTitle(course: LearnPressCourse) {
  return course.title?.rendered ?? course.name ?? `Course #${course.id}`
}

function getCourseSummary(course: LearnPressCourse) {
  return stripHtml(course.excerpt?.rendered || course.content?.rendered) || 'No description available yet.'
}

export default async function MyCoursesPage() {
  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  const userInfo = parseUserInfo(cookieStore.get(LEARNPRESS_USER_COOKIE)?.value)
  let courses: LearnPressCourse[] = []
  let errorMessage: string | null = null

  try {
    if (authToken) {
      courses = await fetchLearnPressCourses({ perPage: 20, learned: true, authToken })
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unable to load courses at the moment.'
  }

  if (!authToken) {
    return (
      <div className="space-y-6 rounded-3xl border border-sky-100 bg-white/95 p-8 text-sky-900 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">My Courses</h1>
        <p className="text-base leading-7 text-sky-800">
          Sign in with your course credentials to unlock your library and jump back into your journey.
        </p>
        <Link
          href="/course-login"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 sm:w-auto"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4 rounded-3xl border border-sky-100 bg-white/95 p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">My Courses</p>
            <h1 className="text-3xl font-semibold tracking-tight text-sky-900">
              Welcome back{userInfo?.displayName ? `, ${userInfo.displayName}` : ''}
            </h1>
            <p className="text-base leading-7 text-sky-800">
              Choose any course below to reopen it inside this experience and continue where you left off.
            </p>
          </div>
          <LearnPressLogoutButton />
        </div>
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-rose-700">
            <p className="font-semibold">Unable to fetch courses.</p>
            <p className="text-sm leading-6">{errorMessage}</p>
            <p className="text-sm leading-6">
              Try logging in again on{' '}
              <Link href="/course-login" className="text-rose-600 underline">
                /course-login
              </Link>
              .
            </p>
          </div>
        ) : null}
      </header>

      {courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/70 p-8 text-sky-800">
          <p className="text-lg font-semibold">No courses found.</p>
          <p className="mt-1 text-sm leading-6">
            If you recently enrolled, give the sync a moment or refresh this page.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/wai1"
              className="inline-flex items-center justify-center rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-white"
            >
              Explore Who Am I – Part 1
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const title = getCourseTitle(course)
            const summary = getCourseSummary(course)
            const learnUrl = `/my-courses/${course.id}`
            const statusLabel = course.status ? course.status.replaceAll('_', ' ') : 'course'

            return (
              <li
                key={course.id}
                className="flex flex-col rounded-2xl border border-sky-100 bg-white/95 p-6 text-sky-900 shadow-sm"
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-sky-400">{statusLabel}</p>
                  <h2 className="text-xl font-semibold leading-tight">{title}</h2>
                </div>
                <p className="flex-1 pt-3 text-sm leading-6 text-sky-700">{summary}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-sky-500">
                  <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">#{course.id}</span>
                  {course.price ? <span>Price: {course.price}</span> : null}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={learnUrl}
                    className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
                  >
                    Open course
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
