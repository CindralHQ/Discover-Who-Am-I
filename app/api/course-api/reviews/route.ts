import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getLearnPressSiteUrl, LEARNPRESS_TOKEN_COOKIE } from '@/lib/learnpress'

export async function POST(request: Request) {
  const token = cookies().get(LEARNPRESS_TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ error: 'Sign in to submit feedback.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const courseId = Number(body?.courseId)
  const lessonId = Number(body?.lessonId)
  const rating = Number(body?.rating ?? 5)
  const title = body?.title?.toString() ?? 'Lesson feedback'
  const content = body?.content?.toString()

  if (!courseId || !content) {
    return NextResponse.json({ error: 'Course ID and content are required.' }, { status: 400 })
  }

  const siteUrl = getLearnPressSiteUrl()

  const response = await fetch(`${siteUrl}/wp-json/learnpress/v1/review/submit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: courseId,
      rate: rating,
      title,
      content: `${content}\n\nLesson ID: ${lessonId ?? 'N/A'}`,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    return NextResponse.json(
      { error: `The course service rejected the review (${response.status}): ${details.slice(0, 120)}` },
      { status: response.status }
    )
  }

  const data = await response.json().catch(() => ({}))
  return NextResponse.json({ success: true, data })
}
