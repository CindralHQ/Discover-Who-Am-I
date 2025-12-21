import { NextResponse } from 'next/server'

import {
  LEARNPRESS_TOKEN_COOKIE,
  LEARNPRESS_USER_COOKIE,
  requestLearnPressUserToken,
  type LearnPressTokenResponse
} from '@/lib/learnpress'

const TOKEN_MAX_AGE_SECONDS = 60 * 60 // 1 hour

function buildUserPayload(data: LearnPressTokenResponse) {
  return {
    id: data.user_id,
    login: data.user_login,
    email: data.user_email,
    displayName: data.user_display_name
  }
}

function getWpEnv() {
  const siteUrl = process.env.WP_SITE_URL?.replace(/\/+$/, '')
  const user = process.env.WP_API_USER
  const password = process.env.WP_API_PASSWORD
  if (!siteUrl || !user || !password) {
    throw new Error('Missing WP_SITE_URL, WP_API_USER, or WP_API_PASSWORD environment variables.')
  }
  return { siteUrl, user, password }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email?.trim()
  const password = body?.password
  const name = body?.name?.trim() || email

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  let envConfig
  try {
    envConfig = getWpEnv()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Configuration error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  try {
    const createResponse = await fetch(`${envConfig.siteUrl}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${envConfig.user}:${envConfig.password}`).toString('base64')}`
      },
      body: JSON.stringify({
        username: email,
        email,
        password,
        name
      })
    })

    if (!createResponse.ok) {
      let friendly = 'Unable to create account. If you already registered, please log in instead.'
      try {
        const errorJson = await createResponse.json()
        if (typeof errorJson?.message === 'string' && errorJson.message.trim().length > 0) {
          friendly = errorJson.message.replace(/<[^>]*>?/g, '').trim()
        }
      } catch {
        const errorText = await createResponse.text().catch(() => '')
        if (errorText) {
          friendly = errorText.replace(/<[^>]*>?/g, '').trim()
        }
      }

      return NextResponse.json(
        { error: friendly || 'Unable to create account. If you already registered, please log in instead.' },
        { status: createResponse.status === 400 ? 409 : 500 }
      )
    }

    // Log in immediately to set LP cookies.
    const tokenResponse = await requestLearnPressUserToken({ username: email, password })
    const user = buildUserPayload(tokenResponse)
    const response = NextResponse.json({ success: true, user })

    response.cookies.set({
      name: LEARNPRESS_TOKEN_COOKIE,
      value: tokenResponse.token!,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: TOKEN_MAX_AGE_SECONDS
    })

    response.cookies.set({
      name: LEARNPRESS_USER_COOKIE,
      value: encodeURIComponent(JSON.stringify(user)),
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: TOKEN_MAX_AGE_SECONDS
    })

    return response
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to create account right now. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
