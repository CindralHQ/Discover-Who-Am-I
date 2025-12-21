import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { getLearnPressSiteUrl, LEARNPRESS_TOKEN_COOKIE } from '@/lib/learnpress'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const courseId = Number(body?.courseId)

  if (!Number.isFinite(courseId)) {
    return NextResponse.json({ error: 'A valid course id is required.' }, { status: 400 })
  }

  const token = cookies().get(LEARNPRESS_TOKEN_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ error: 'You must be signed in to complete courses.' }, { status: 401 })
  }

  const siteUrl = getLearnPressSiteUrl()
  const response = await fetch(new URL('/wp-json/learnpress/v1/courses/finish', siteUrl), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ id: courseId }),
  })

  const raw = await response.text()
  if (!response.ok) {
    let message = 'Unable to mark this course complete.'
    try {
      const parsed = JSON.parse(raw)
      if (typeof parsed?.message === 'string') {
        message = parsed.message.replace(/<[^>]*>?/g, '').trim()
      }
    } catch {
      // ignore
    }
    return NextResponse.json({ error: message }, { status: response.status })
  }

  let payload: unknown = null
  try {
    payload = JSON.parse(raw)
  } catch {
    payload = raw
  }

  return NextResponse.json({ success: true, data: payload })
}
