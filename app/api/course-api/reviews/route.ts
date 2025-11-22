import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { appendCourseFeedbackRow } from '@/lib/googleSheets'
import { LEARNPRESS_USER_COOKIE, parseLearnPressUserCookie } from '@/lib/learnpress'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const userInfo = parseLearnPressUserCookie(cookieStore.get(LEARNPRESS_USER_COOKIE)?.value)
  if (!userInfo) {
    return NextResponse.json({ error: 'Sign in to submit feedback.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const courseId = Number(body?.courseId)
  const lessonId = Number(body?.lessonId)
  const rating = Number(body?.rating ?? 5)
  const lessonTitle = body?.lessonTitle?.toString()
  const content = body?.content?.toString()

  if (!courseId || !content) {
    return NextResponse.json({ error: 'Course ID and content are required.' }, { status: 400 })
  }

  try {
    await appendCourseFeedbackRow({
      courseId,
      lessonId: Number.isFinite(lessonId) ? lessonId : undefined,
      lessonTitle,
      rating,
      content,
      userId: userInfo.id,
      userEmail: userInfo.email,
      userName: userInfo.displayName ?? userInfo.login,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to record your testimonial right now.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
