import { NextResponse } from 'next/server'

import {
  LEARNPRESS_TOKEN_COOKIE,
  LEARNPRESS_USER_COOKIE,
  requestLearnPressUserToken,
  type LearnPressTokenResponse,
} from '@/lib/learnpress'

const TOKEN_MAX_AGE_SECONDS = 60 * 60 // 1 hour

function buildUserPayload(data: LearnPressTokenResponse) {
  return {
    id: data.user_id,
    login: data.user_login,
    email: data.user_email,
    displayName: data.user_display_name,
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const username = body?.username?.trim()
  const password = body?.password

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 })
  }

  try {
    const tokenResponse = await requestLearnPressUserToken({ username, password })
    const user = buildUserPayload(tokenResponse)
    const response = NextResponse.json({ success: true, user })

    response.cookies.set({
      name: LEARNPRESS_TOKEN_COOKIE,
      value: tokenResponse.token!,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: TOKEN_MAX_AGE_SECONDS,
    })

    response.cookies.set({
      name: LEARNPRESS_USER_COOKIE,
      value: encodeURIComponent(JSON.stringify(user)),
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: TOKEN_MAX_AGE_SECONDS,
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to sign in right now.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
