import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'

import { LearnPressLogoutButton } from '@/components/ui/LearnPressLogoutButton'
import {
  fetchLearnPressCourse,
  fetchLearnPressLesson,
  getLearnPressSiteUrl,
  type LearnPressCurriculumItem,
  type LearnPressCurriculumSection,
  type LearnPressLesson,
  type LearnPressCourse,
  LEARNPRESS_TOKEN_COOKIE,
  LEARNPRESS_USER_COOKIE,
} from '@/lib/learnpress'
import { LessonFeedbackForm } from '@/components/ui/LessonFeedbackForm'

type LearnPressUserInfo = {
  id?: string
  login?: string
  displayName?: string
}

function parseUserInfo(value?: string) {
  if (!value) return null
  try {
    return JSON.parse(decodeURIComponent(value)) as LearnPressUserInfo
  } catch {
    return null
  }
}

function stripHtml(value?: string | null) {
  if (!value) return ''
  return value.replace(/<[^>]*>?/g, '').replace(/\s+/g, ' ').trim()
}

type NormalizedLesson = {
  id: number
  title: string
  type: string
}

type NormalizedSection = {
  id: string
  title: string
  lessons: NormalizedLesson[]
}

function extractSections(course: LearnPressCourse): NormalizedSection[] {
  const rawSections =
    (course.curriculum as LearnPressCurriculumSection[]) ??
    (course._lp_curriculum as LearnPressCurriculumSection[]) ??
    (course as any).sections ??
    []

  if (Array.isArray(rawSections) && rawSections.length > 0) {
    return rawSections.map((section, index) => normalizeSection(section, index))
  }

  const fallbackItems = (course as any).items ?? []
  if (Array.isArray(fallbackItems) && fallbackItems.length > 0) {
    return [
      {
        id: 'default',
        title: 'Curriculum',
        lessons: normalizeItems(fallbackItems),
      },
    ]
  }

  return []
}

function normalizeSection(section: LearnPressCurriculumSection, index: number): NormalizedSection {
  const title =
    section.title ??
    (section as any).name ??
    (section as any).section_name ??
    `Section ${index + 1}`
  const id = String(section.id ?? `section-${index}`)
  const lessonCandidates =
    (section.items as LearnPressCurriculumItem[]) ??
    (section as any).contents ??
    (section as any).curriculum ??
    []

  return {
    id,
    title,
    lessons: normalizeItems(Array.isArray(lessonCandidates) ? lessonCandidates : []),
  }
}

function normalizeItems(items: LearnPressCurriculumItem[]): NormalizedLesson[] {
  return items
    .map((item, index) => {
      const id = Number(item.id ?? item.item_id ?? (item as any).itemId)
      if (!Number.isFinite(id)) {
        return null
      }
      const title =
        (item as any).title?.rendered ??
        item.title ??
        item.name ??
        (item as any).item_title ??
        `Lesson ${index + 1}`
      const type = String(item.type ?? item.item_type ?? (item as any).post_type ?? 'lesson').toLowerCase()
      return { id, title, type }
    })
    .filter(Boolean) as NormalizedLesson[]
}

function isLessonType(type?: string) {
  if (!type) return true
  return type.includes('lesson') || type === 'lp_lesson'
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: { courseId: string }
  searchParams?: { lesson?: string }
}) {
  const courseId = Number(params.courseId)
  if (!courseId || Number.isNaN(courseId)) {
    notFound()
  }

  const cookieStore = cookies()
  const authToken = cookieStore.get(LEARNPRESS_TOKEN_COOKIE)?.value
  const userInfo = parseUserInfo(cookieStore.get(LEARNPRESS_USER_COOKIE)?.value)
  const siteUrl = getLearnPressSiteUrl()

  if (!authToken) {
    return (
      <div className="space-y-6 rounded-3xl border border-indigo-100 bg-white/95 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-900">Course details</h1>
        <p className="text-base leading-7 text-indigo-800">
          Sign in to view the content and continue your journey.
        </p>
        <Link
          href="/course-login"
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  let course
  let errorMessage: string | null = null
  try {
    course = await fetchLearnPressCourse(courseId, { authToken })
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unable to load the course at the moment.'
  }

  if (!course) {
    return (
      <div className="space-y-6 rounded-3xl border border-rose-200 bg-white/95 p-8 text-rose-800 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Course unavailable</h1>
        <p>{errorMessage ?? 'We could not find a course with that ID.'}</p>
        <Link href="/my-courses" className="text-sm font-semibold text-rose-700 underline">
          Back to My Courses
        </Link>
      </div>
    )
  }

  const title = course.title?.rendered ?? course.name ?? `Course #${course.id}`
  const description = stripHtml(course.excerpt?.rendered) || stripHtml(course.content?.rendered)
  const courseUrl = course.link ?? `${siteUrl}/course/${course.slug ?? course.id}`
  const sections = extractSections(course)
  const flatLessons = sections.flatMap((section) => section.lessons)
  const requestedLessonId = searchParams?.lesson ? Number(searchParams.lesson) : undefined
  const activeLesson =
    (requestedLessonId && flatLessons.find((lesson) => lesson.id === requestedLessonId)) || flatLessons[0]

  let lesson: LearnPressLesson | null = null
  let lessonError: string | null = null
  if (activeLesson && isLessonType(activeLesson.type)) {
    try {
      lesson = await fetchLearnPressLesson(activeLesson.id, { authToken })
    } catch (error) {
      lessonError = error instanceof Error ? error.message : 'Unable to load lesson content right now.'
    }
  } else if (activeLesson) {
    lessonError = 'This item is not a lesson. Please open the full course view to continue.'
  }

  const activeLessonTitle = lesson?.title?.rendered ?? activeLesson?.title ?? ''

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Course</p>
            <h1 className="text-3xl font-semibold tracking-tight text-indigo-900">{title}</h1>
            {userInfo?.displayName ? (
              <p className="text-base text-indigo-700">Signed in as {userInfo.displayName}</p>
            ) : null}
          </div>
          <LearnPressLogoutButton />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-indigo-600">
          <span className="rounded-full border border-indigo-100 px-3 py-1 font-semibold">ID #{course.id}</span>
          {course.status ? <span>Status: {course.status.replaceAll('_', ' ')}</span> : null}
          {course.price ? <span>Price: {course.price}</span> : null}
        </div>
        <div className="mt-4">
          <Link
            href="/my-courses"
            className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-white"
          >
            ← Back to My Courses
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-indigo-900">Curriculum</h2>
            {description ? <p className="text-sm text-indigo-700">{description}</p> : null}
          </div>
          {sections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 p-4 text-sm text-indigo-700">
              <p className="font-semibold">No lessons detected.</p>
              <p className="mt-1">
                Publish the course outline in the LMS or refresh to sync the latest data.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {sections.map((section) => (
                <li key={section.id} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">{section.title}</p>
                  <ul className="space-y-1">
                    {section.lessons.map((lessonItem) => {
                      const isActive = activeLesson?.id === lessonItem.id
                      return (
                        <li key={lessonItem.id}>
                          <Link
                            href={`/my-courses/${course.id}?lesson=${lessonItem.id}`}
                            className={`block rounded-2xl px-3 py-2 text-sm transition ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-indigo-800 hover:bg-indigo-50'
                            }`}
                          >
                            {lessonItem.title}
                            {lessonItem.type && !isLessonType(lessonItem.type) ? (
                              <span className="ml-2 text-xs uppercase tracking-[0.3em] text-indigo-200">
                                {lessonItem.type}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="space-y-4 rounded-3xl border border-indigo-100 bg-white/95 p-6 shadow-sm">
          {activeLesson ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">Lesson</p>
              <h2 className="text-2xl font-semibold text-indigo-900">
                {lesson?.title?.rendered ?? activeLesson.title}
              </h2>
              {lessonError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
                  {lessonError}
                </div>
              ) : lesson ? (
                <article
                  className="prose prose-indigo max-w-none text-indigo-800"
                  dangerouslySetInnerHTML={{ __html: lesson.content?.rendered ?? '<p>No content yet.</p>' }}
                />
              ) : (
                <p className="text-sm text-indigo-700">Loading lesson content…</p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-indigo-900">No lessons yet</p>
              <p className="text-sm text-indigo-700">
                Once lessons are added to this course they&apos;ll appear here automatically.
              </p>
            </div>
          )}
        </main>
      </div>
      {lesson ? (
        <LessonFeedbackForm
          courseId={course.id}
          lessonId={activeLesson.id}
          lessonTitle={activeLessonTitle}
        />
      ) : null}
    </div>
  )
}
