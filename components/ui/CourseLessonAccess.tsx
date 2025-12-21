'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lesson = {
  id: number
  title: string
  type: string
  completed?: boolean
}

type Section = {
  id: string
  title: string
  lessons: Lesson[]
}

type CourseLessonAccessProps = {
  courseId: number
  sections: Section[]
  activeLessonId?: number
  activeLessonTitle?: string
  children: React.ReactNode
  disableCompletion?: boolean
  serverCompletedIds?: number[]
  completionCta?: {
    href: string
    label: string
    title?: string
    description?: string
  }
}

const STORAGE_PREFIX = 'lp_progress_v2_'

export function CourseLessonAccess({
  courseId,
  sections,
  activeLessonId,
  activeLessonTitle,
  children,
  disableCompletion = false,
  serverCompletedIds = [],
  completionCta
}: CourseLessonAccessProps) {
  const router = useRouter()
  const flatLessons = useMemo(
    () => sections.flatMap((section) => section.lessons),
    [sections]
  )
  const [completedIds, setCompletedIds] = useState<number[]>(() => Array.from(new Set(serverCompletedIds)))
  const [mounted, setMounted] = useState(false)
  const [completionError, setCompletionError] = useState<string | null>(null)
  const [completingId, setCompletingId] = useState<number | null>(null)
  const [courseCompletionError, setCourseCompletionError] = useState<string | null>(null)
  const [courseCompletionAttempted, setCourseCompletionAttempted] = useState(false)

  const storageKey = `${STORAGE_PREFIX}${courseId}`

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          const merged = [...serverCompletedIds, ...parsed.filter((id) => Number.isFinite(id))]
          setCompletedIds(Array.from(new Set(merged)))
        }
      }
    } catch {
      // ignore
    } finally {
      setMounted(true)
    }
  }, [storageKey, serverCompletedIds])

  useEffect(() => {
    // Keep localStorage in sync when server progress updates (e.g., switching devices).
    if (!mounted) return
    persist([...completedIds, ...serverCompletedIds])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverCompletedIds, mounted])

  function persist(next: number[]) {
    const unique = Array.from(new Set(next))
    setCompletedIds(unique)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(unique))
      } catch {
        // ignore
      }
    }
  }

  async function markCompleted(id?: number) {
    if (!id) return
    if (completedIds.includes(id)) return
    if (completingId) return
    setCompletionError(null)
    setCompletingId(id)
    try {
      const response = await fetch('/api/learnpress/lesson-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: id }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const message = typeof data?.error === 'string' ? data.error : 'Unable to mark this lesson complete.'
        throw new Error(message)
      }
      persist([...completedIds, id])
      router.refresh()
    } catch (error) {
      setCompletionError(error instanceof Error ? error.message : 'Unable to mark this lesson complete.')
    } finally {
      setCompletingId(null)
    }
  }

  const indexById = useMemo(() => {
    const map = new Map<number, number>()
    flatLessons.forEach((lesson, index) => map.set(lesson.id, index))
    return map
  }, [flatLessons])

  function isUnlocked(lessonId: number) {
    const index = indexById.get(lessonId)
    if (index === undefined) return false
    if (index === 0) return true
    const prevId = flatLessons[index - 1]?.id
    return completedIds.includes(prevId) || completedIds.includes(lessonId)
  }

  const firstUnlockedLesson = useMemo(() => {
    if (flatLessons.length === 0) return null
    for (let i = 0; i < flatLessons.length; i += 1) {
      const lesson = flatLessons[i]
      if (i === 0 || isUnlocked(lesson.id)) {
        return lesson
      }
      const prev = flatLessons[i - 1]
      if (completedIds.includes(prev.id)) {
        return lesson
      }
    }
    return flatLessons[0]
  }, [flatLessons, completedIds])

  const activeIsUnlocked = activeLessonId ? isUnlocked(activeLessonId) : false

  useEffect(() => {
    if (!mounted) return
    if (!activeLessonId) return
    if (activeIsUnlocked) return
    const fallback = firstUnlockedLesson
    if (fallback && fallback.id !== activeLessonId) {
      router.replace(`/my-courses/${courseId}?lesson=${fallback.id}`)
    }
  }, [activeLessonId, activeIsUnlocked, courseId, firstUnlockedLesson, mounted, router])
  const totalLessons = flatLessons.length
  const completedCount = Math.min(completedIds.length, totalLessons)
  const lockedNotice =
    activeLessonId && !activeIsUnlocked
      ? 'Complete the previous lesson to unlock this one.'
      : null

  const progressText =
    totalLessons > 0 ? `${completedCount}/${totalLessons} lessons marked complete` : ''
  const isCourseComplete = totalLessons > 0 && completedCount >= totalLessons

  useEffect(() => {
    if (!mounted) return
    if (!isCourseComplete) return
    if (courseCompletionAttempted) return

    const completeCourse = async () => {
      setCourseCompletionAttempted(true)
      setCourseCompletionError(null)
      try {
        const response = await fetch('/api/learnpress/course-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }),
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          const message = typeof data?.error === 'string' ? data.error : 'Unable to mark this course complete.'
          throw new Error(message)
        }
      } catch (error) {
        setCourseCompletionError(error instanceof Error ? error.message : 'Unable to mark this course complete.')
      }
    }

    void completeCourse()
  }, [courseId, courseCompletionAttempted, isCourseComplete, mounted])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-6 rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-sky-900">Curriculum</h2>
          {progressText ? <p className="text-sm text-sky-700">{progressText}</p> : null}
        </div>
        {sections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-700">
            <p className="font-semibold">No lessons detected.</p>
            <p className="mt-1">Publish the course outline in the LMS or refresh to sync the latest data.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.id} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">{section.title}</p>
                <ul className="space-y-1">
                  {section.lessons.map((lesson) => {
                    const isActive = activeLessonId === lesson.id
                    const unlocked = isUnlocked(lesson.id)

                    if (unlocked) {
                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/my-courses/${courseId}?lesson=${lesson.id}`}
                            className={`block rounded-2xl px-3 py-2 text-sm transition ${
                              isActive ? 'bg-sky-600 text-white shadow-sm' : 'text-sky-800 hover:bg-sky-50'
                            }`}
                          >
                            {lesson.title}
                          </Link>
                        </li>
                      )
                    }

                    return (
                      <li key={lesson.id}>
                        <span className="block rounded-2xl px-3 py-2 text-sm text-sky-400">
                          [Locked] {lesson.title}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="space-y-4 rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-sm">
        {lockedNotice ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
            {lockedNotice}{' '}
            {firstUnlockedLesson && firstUnlockedLesson.id !== activeLessonId ? (
              <button
                type="button"
                onClick={() => router.replace(`/my-courses/${courseId}?lesson=${firstUnlockedLesson.id}`)}
                className="font-semibold underline"
              >
                Go to unlocked lesson
              </button>
            ) : null}
          </div>
        ) : null}

        {activeIsUnlocked ? children : null}

        {activeLessonId && activeIsUnlocked && !disableCompletion && !lockedNotice ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-sky-800">
            <div className="space-y-0.5">
              <p className="font-semibold">Mark this lesson complete</p>
              {activeLessonTitle ? <p className="text-xs text-sky-600">{activeLessonTitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => markCompleted(activeLessonId)}
              disabled={completedIds.includes(activeLessonId) || completingId === activeLessonId}
              className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              {completedIds.includes(activeLessonId)
                ? 'Completed'
                : completingId === activeLessonId
                  ? 'Saving…'
                  : 'Mark completed'}
            </button>
          </div>
        ) : null}
        {completionCta && isCourseComplete ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
            <div className="space-y-0.5">
              <p className="font-semibold">{completionCta.title ?? 'Course completed'}</p>
              {completionCta.description ? (
                <p className="text-xs text-emerald-700">{completionCta.description}</p>
              ) : null}
            </div>
            <Link
              href={completionCta.href}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              {completionCta.label}
            </Link>
          </div>
        ) : null}
        {completionError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
            {completionError}
          </div>
        ) : null}
        {courseCompletionError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
            {courseCompletionError}
          </div>
        ) : null}
      </main>
    </div>
  )
}
